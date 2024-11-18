import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { debounceTime, filter, Observable, Subject, takeUntil } from 'rxjs';

import {
  ConfigService,
  DialogService,
  MenuService,
  MerchantService,
} from '../../../core/services';
import {
  MenuGroupAndMenusSimpleModel,
  MenuSimpleModel,
  TypeMenuModel,
  URLTypeMenuModel,
} from '../../../core/db/models/menu/menu.models';
import { EmptyStateComponent } from '../../../global/components/empty-states/empty-state/empty-state.component';
import { ConnectedOperatorModel } from '../../../components/auth/auth.model';
import { MerchantCardComponent } from '../../../components/merchant/global/merchant-card/merchant-card.component';
import { MerchantAutocompleteModel } from '../../../components/merchant/merchant.models';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { VariableService } from '../../../core/services/variable/variable.service';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-workstation-menu',
  standalone: true,
  imports: [
    RouterModule,
    EmptyStateComponent,
    NgClass,
    MerchantCardComponent,
    ReactiveFormsModule,
    SkeletonComponent,
    EmptyStateComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './workstation-menu.component.html',
  styleUrl: './workstation-menu.component.scss',
})
export class WorkstationMenuComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  activatedTypeMenu: URLTypeMenuModel = '';

  activatedTypeGroupMenus: MenuGroupAndMenusSimpleModel[] | [] = [];
  selectedGroup: MenuGroupAndMenusSimpleModel | null = null;

  marketMenus: MenuSimpleModel[] = [];
  bankingMenus: MenuSimpleModel[] = [];

  // TODO :: TO FIND A WAY TO REMOVE THIS VARIABLE AND USING ROUTERLINKACTIVE
  selectedMenu: MenuSimpleModel | null = null;

  baseMenuUrl = '/w/workstation';

  menus$: Observable<TypeMenuModel[]>;
  menus: TypeMenuModel[] = [];

  loadingMenu = false;
  searchForm: FormControl = new FormControl('');
  isLoading = false;
  isSearchInputFocused = false;
  merchants: MerchantAutocompleteModel[] | null = null;
  private isMenuChange = false;

  operator: ConnectedOperatorModel | null = null;
  operator$: Observable<ConnectedOperatorModel>;

  private routeSignature$: Observable<string>;
  routeSignature = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private configService: ConfigService,
    private merchantService: MerchantService,
    private menuService: MenuService,
    private dialogService: DialogService,
    private variableService: VariableService
  ) {
    this.operator$ = this.configService.getConnectedOperator();
    this.menus$ = this.configService.getTypeMenus();
    this.routeSignature$ = toObservable(this.variableService.MENU_ACCESS_KEY);
  }

  ngOnInit(): void {
    this.operator$.subscribe({
      next: operator => {
        this.operator = operator;
      },
    });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart),
        takeUntil(this.onDestroy$)
      )
      .subscribe(() => {
        this.resetData();
        this.isMenuChange = true;
      });

    if (this.route.params) {
      this.route.params.subscribe({
        next: params => {
          this.activatedTypeMenu = params['TypeMenu'];

          // NOTE :: GETTING MENUS BY SELECTED TYPE MENU
          if (this.menus) {
            if (this.activatedTypeMenu === 'b') {
              [this.bankingMenus, this.baseMenuUrl] =
                this.menuService.getBankingMenu(
                  'banking',
                  'Aside-Menu',
                  this.menus
                );
            } else if (this.activatedTypeMenu === 'm') {
              [this.marketMenus, this.baseMenuUrl] =
                this.menuService.getBankingMenu(
                  'market',
                  'Aside-Menu',
                  this.menus
                );
            } else {
              [this.activatedTypeGroupMenus, this.baseMenuUrl] =
                this.menuService.getActiveMenuGroups(
                  this.menus,
                  this.activatedTypeMenu
                );
            }
          }
        },
      });
    }

    this.routeSignature$.subscribe({
      next: signature => {
        this.routeSignature = signature;
      },
    });

    this.searchForm.valueChanges
      .pipe(debounceTime(300), takeUntil(this.onDestroy$))
      .subscribe(value => {
        if (this.isMenuChange) {
          this.isMenuChange = false;
          return;
        }
        if (value !== null && value.trim() !== '') {
          this.getMerchants(value);
        } else {
          this.getMerchants('');
        }
      });

    this.menus$.subscribe({
      next: menus => {
        this.menus = this.configService.toArray(menus);

        // this.manageMenuByActivatedRoute();

        // NOTE :: GETTING MENUS BY TYPE MENU
        if (this.activatedTypeMenu) {
          if (this.activatedTypeMenu === 'b') {
            [this.bankingMenus, this.baseMenuUrl] =
              this.menuService.getBankingMenu(
                'banking',
                'Aside-Menu',
                this.menus
              );
          } else if (this.activatedTypeMenu === 'm') {
            [this.marketMenus, this.baseMenuUrl] =
              this.menuService.getBankingMenu(
                'market',
                'Aside-Menu',
                this.menus
              );
          } else {
            [this.activatedTypeGroupMenus, this.baseMenuUrl] =
              this.menuService.getActiveMenuGroups(
                this.menus,
                this.activatedTypeMenu
              );
          }
        }
      },
    });
  }

  resetData() {
    this.merchants = null;
    this.searchForm.setValue('');
    this.isSearchInputFocused = false;
  }

  onClick() {
    this.isSearchInputFocused = true;
    if (this.isSearchInputFocused) {
      if (!this.merchants) {
        this.getMerchants('');
      }
    }
  }

  onBlur() {
    if (
      !this.searchForm.value &&
      (this.merchants as MerchantAutocompleteModel[]).length === 0
    ) {
      this.isSearchInputFocused = false;
    }
  }

  onSearchMarchant(event: Event) {
    event.preventDefault();
    const searchValue = this.searchForm.value;
    this.getMerchants(searchValue ?? '');
  }

  selectGroup(group: MenuGroupAndMenusSimpleModel | null) {
    this.selectedGroup = group;
  }

  getMerchants(search: string) {
    this.isLoading = true;
    this.merchants = null;

    this.merchantService
      .getRecentAllMerchantsAutocomplete(search)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.isLoading = false;
          this.merchants = data.objects;
        },
        error: () => {
          this.isLoading = false;

          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'There is an error accessing this menu, Please try again',
          });
        },
      });
  }

  isSearchInputNotEmpty(): boolean {
    const searchValue = this.searchForm.value;
    return typeof searchValue === 'string' && searchValue.trim() !== '';
  }

  setSelectedMenu(
    menu: MenuSimpleModel,
    url: string,
    event?: MouseEvent,
    enableRedirection?: boolean
  ) {
    this.selectedMenu = this.menuService.setSelectedMenu(
      menu,
      url,
      event,
      enableRedirection
    );
    this.getAccesses(url, enableRedirection);
  }

  private getAccesses(url: string, redirect = true) {
    this.menuService
      .getAccesses(`${this.baseMenuUrl}${url}`, redirect)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        error: () => {
          this.selectedMenu = null;
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            message: 'Something went wrong, Please try again',
            title: '',
            type: 'failed',
          });
        },
      });
  }

  private manageMenuByActivatedRoute(): void {
    [this.activatedTypeGroupMenus, this.baseMenuUrl] =
      this.menuService.getActiveMenuGroups(this.menus, this.activatedTypeMenu);

    const routeMenu = this.menuService.getMenuGroupByActivateRoute(
      this.menus,
      this.activatedTypeMenu,
      this.routeSignature
    );

    if (routeMenu !== undefined) {
      this.selectGroup(routeMenu);
      if (this.selectedGroup?.menus) {
        this.setSelectedMenu(
          this.selectedGroup.menus[0],
          this.selectedGroup.menus[0].component_url,
          undefined,
          false
        );
      } else {
        this.router.navigate([`${this.baseMenuUrl}access-required`]);
      }
    }
  }
}
