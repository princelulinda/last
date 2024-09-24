import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import {
  ConfigService,
  DialogService,
  MenuService,
  MerchantService,
} from '../../../core/services';
import {
  MenuGroupsByTypeMenuModel,
  MenuGroupsModel,
  MenuModel,
} from '../../../core/db/models/menu/menu.models';
import { debounceTime, filter, Observable, Subject, takeUntil } from 'rxjs';
import { EmptyStateComponent } from '../../../global/components/empty-states/empty-state/empty-state.component';
import { NgClass } from '@angular/common';
import { ConnectedOperatorModel } from '../../../components/auth/auth.model';
import { MerchantCardComponent } from '../../../components/merchant/global/merchant-card/merchant-card.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
  activatedTypeMenu: 'b' | 'm' | 'i' | 'd' | 'r' | 'a' | '' = '';

  activeMenuGroups: MenuGroupsModel | null = null;
  selectedGroup: MenuGroupsByTypeMenuModel | null = null;

  menu: MenuModel[] | null = null;
  loadingMenu = false;
  searchForm = new FormControl('');
  isLoading = false;
  isSearchInputFocused = false;
  merchants!: MerchantAutocompleteModel[] | null;
  private onDestroy$: Subject<void> = new Subject<void>();

  operator: ConnectedOperatorModel | null = null;
  operator$: Observable<ConnectedOperatorModel>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private configService: ConfigService,
    private menuService: MenuService,
    private merchantService: MerchantService,
    private dialogService: DialogService
  ) {
    this.operator$ = this.configService.getConnectedOperator();
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
          // if (this.menuGroups) {
          //   this.getActiveMenuGroups();
          // }
        },
      });
    }
    this.searchForm.valueChanges
      .pipe(debounceTime(300), takeUntil(this.onDestroy$))
      .subscribe(value => {
        this.getMerchants(value ?? '');
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

  getMenuByGroup(group_id: string) {
    this.loadingMenu = true;
    this.menu = null;
    this.menuService.getMenuByGroup(group_id).subscribe({
      next: menu => {
        this.menu = menu.objects;
        this.loadingMenu = false;
      },
    });
  }

  selectGroup(group: MenuGroupsByTypeMenuModel) {
    this.selectedGroup = group;
    this.getMenuByGroup(this.selectedGroup.id.toString());
  }

  // private getActiveMenuGroups() {
  //   switch (this.activatedTypeMenu) {
  //     case 'a':
  //       this.activeMenuGroups = this.menuGroups.find(
  //         group => group.name === 'Admin'
  //       ) as MenuGroupsModel;
  //       break;

  //     case 'd':
  //       this.activeMenuGroups = this.menuGroups.find(
  //         group => group.name === 'Admin'
  //       ) as MenuGroupsModel;
  //       break;
  //     case 'i':
  //       this.activeMenuGroups = this.menuGroups.find(
  //         group => group.name === 'Intranet'
  //       ) as MenuGroupsModel;
  //       break;
  //     case 'r':
  //       this.activeMenuGroups = this.menuGroups.find(
  //         group => group.name === 'Reporting'
  //       ) as MenuGroupsModel;
  //       break;

  //     default:
  //       this.activeMenuGroups = null;
  //       break;
  //   }
  // }

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
        error: err => {
          this.isLoading = false;

          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'Something went wrong, please try again',
          });

          return err;
        },
      });
  }

  isSearchInputNotEmpty(): boolean {
    const searchValue = this.searchForm.value;
    return typeof searchValue === 'string' && searchValue.trim() !== '';
  }
}
