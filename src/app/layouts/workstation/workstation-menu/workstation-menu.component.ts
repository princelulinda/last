import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { NgClass } from '@angular/common';
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
  ],
  templateUrl: './workstation-menu.component.html',
  styleUrl: './workstation-menu.component.scss',
})
export class WorkstationMenuComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  activatedTypeMenu: URLTypeMenuModel = '';

  activatedTypeGroupMenus: MenuGroupAndMenusSimpleModel[] | [] = [];
  selectedGroup: MenuGroupAndMenusSimpleModel | null = null;
  // TODO :: TO FIND A WAY TO REMOVE THIS VARIABLE AND USING ROUTERLINKACTIVE
  selectedMenu: MenuSimpleModel | null = null;

  baseMenuUrl = '/w/workstation';

  menus$: Observable<TypeMenuModel[]>;
  menus: TypeMenuModel[] = [];

  loadingMenu = false;
  searchForm = new FormControl('');
  isLoading = false;
  isSearchInputFocused = false;
  merchants!: MerchantAutocompleteModel[] | null;
  private isMenuChange = false;

  operator: ConnectedOperatorModel | null = null;
  operator$: Observable<ConnectedOperatorModel>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private configService: ConfigService,
    private merchantService: MerchantService,
    private menuService: MenuService,
    private dialogService: DialogService
  ) {
    this.operator$ = this.configService.getConnectedOperator();
    this.menus$ = this.configService.getTypeMenus();
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
          if (this.menus) {
            [this.activatedTypeGroupMenus, this.baseMenuUrl] =
              this.menuService.getActiveMenuGroups(
                this.menus,
                this.activatedTypeMenu
              );
          }
        },
      });
    }

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
        [this.activatedTypeGroupMenus, this.baseMenuUrl] =
          this.menuService.getActiveMenuGroups(
            this.menus,
            this.activatedTypeMenu
          );
        const routeMenu = this.menuService.getMenuByActivateRoute(
          this.menus,
          this.activatedTypeMenu
        );
        if (routeMenu !== undefined) {
          this.selectGroup(routeMenu);
          if (this.selectedGroup?.menus) {
            this.setSelectedMenu(
              this.selectedGroup.menus[0],
              this.selectedGroup.menus[0].component_url
            );
          } else {
            this.router.navigate([`${this.baseMenuUrl}access-required`]);
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
          const response = data as { objects: MerchantAutocompleteModel[] };
          this.isLoading = false;
          this.merchants = response.objects;
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

  setSelectedMenu(menu: MenuSimpleModel, url: string, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
    }
    this.selectedMenu = menu;
    this.menuService.setLocalSelectedMenu(menu.id);
    // NOTE :: GETTING ACCESS MENUS
    this.getAccesses(url);
  }

  private getAccesses(url: string) {
    this.dialogService.dispatchLoading('topLoader');
    this.configService.clearActiveAccesses();
    this.menuService
      .getAccesses()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: accesses => {
          this.configService.setActiveAccesses(accesses.objects);
          this.dialogService.closeLoading();
          this.router.navigate([`${this.baseMenuUrl}${url}`]);
        },
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
}
