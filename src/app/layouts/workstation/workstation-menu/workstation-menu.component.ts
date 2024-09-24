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
  TypeMenuModel,
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
  activatedTypeMenu: 'b' | 'm' | 'i' | 'd' | 'r' | 'a' | '' = '';

  activatedTypeGroupMenus: MenuGroupAndMenusSimpleModel[] | [] = [];
  selectedGroup: MenuGroupAndMenusSimpleModel | null = null;

  menus$: Observable<TypeMenuModel[]>;
  menus: TypeMenuModel[] = [];

  loadingMenu = false;
  searchForm = new FormControl('');
  isLoading = false;
  isSearchInputFocused = false;
  merchants!: MerchantAutocompleteModel[] | null;

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
      });

    if (this.route.params) {
      this.route.params.subscribe({
        next: params => {
          this.activatedTypeMenu = params['TypeMenu'];
          if (this.menus) {
            this.getActiveMenuGroups();
          }
        },
      });
    }

    this.searchForm.valueChanges
      .pipe(debounceTime(300), takeUntil(this.onDestroy$))
      .subscribe(value => {
        this.getMerchants(value ?? '');
      });

    this.menus$.subscribe({
      next: menus => {
        this.menus = this.configService.toArray(menus);
        this.getActiveMenuGroups();
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
      this.getMerchants('');
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

  private getActiveMenuGroups() {
    switch (this.activatedTypeMenu) {
      case 'a':
        this.activatedTypeGroupMenus = this.menus.find(
          typeMenu => typeMenu.name === 'Admin'
        )?.menu_groups as MenuGroupAndMenusSimpleModel[];
        break;

      case 'd':
        this.activatedTypeGroupMenus = this.menus.find(
          typeMenu => typeMenu.name === 'Desk'
        )?.menu_groups as MenuGroupAndMenusSimpleModel[];
        break;
      case 'i':
        this.activatedTypeGroupMenus = this.menus.find(
          typeMenu => typeMenu.name === 'Intranet'
        )?.menu_groups as MenuGroupAndMenusSimpleModel[];
        break;
      case 'r':
        this.activatedTypeGroupMenus = this.menus.find(
          typeMenu => typeMenu.name === 'Reporting'
        )?.menu_groups as MenuGroupAndMenusSimpleModel[];
        break;

      default:
        this.activatedTypeGroupMenus = [];
        break;
    }
  }

  getMerchants(search: string) {
    this.isLoading = true;
    this.merchants = null;

    this.merchantService
      .getRecentMerchantsAutocomplete(search)
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
            message: 'Something went wrong, please try again',
          });
        },
      });
  }

  isSearchInputNotEmpty(): boolean {
    const searchValue = this.searchForm.value;
    return typeof searchValue === 'string' && searchValue.trim() !== '';
  }

  selectAMenu(menu: { id: number; name: string; component_url: string }) {
    // NOTE :: GETTING ACCESS MENUS
    // this.getAccesses();

    this.menuService.setLocalSelectedMenu(menu.id);
    this.dialogService.dispatchLoading('topLoader');

    setTimeout(() => {
      this.dialogService.closeLoading();
    }, 4000);
  }

  // private getAccesses() {
  //   this.menuService.getAccesses().subscribe({
  //     next: () => {},
  //   });
  // }
}
