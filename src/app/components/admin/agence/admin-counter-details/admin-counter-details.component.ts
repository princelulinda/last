import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { CounterDetailsModele } from '../agence.models';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProfileCardComponent } from '../../../../global/components/custom-field/profile-card/profile-card.component';
import { PageMenusModel } from '../../menu/menu.models';
import { MenuService } from '../../../../core/services';
import { ListComponent } from '../../../../global/components/list/list/list.component';
import { LookupComponent } from '../../../../global/components/lookups/lookup/lookup.component';
import { ItemModel } from '../../../../global/components/lookups/lookup/lookup.model';
import { DialogService } from '../../../../core/services';
@Component({
  selector: 'app-admin-counter-details',
  standalone: true,
  imports: [
    CommonModule,
    ProfileCardComponent,
    ListComponent,
    ReactiveFormsModule,
    LookupComponent,
  ],
  templateUrl: './admin-counter-details.component.html',
  styleUrl: './admin-counter-details.component.scss',
})
export class AdminCounterDetailsComponent implements OnInit {
  counterId!: number;
  counterDetails!: CounterDetailsModele | null;
  private onDestroy$: Subject<void> = new Subject<void>();
  private pageMenus: PageMenusModel[] = [];

  loadingData = false;
  selectedCurrencyId: number | null = null;
  newMainBoxForm!: FormGroup;
  counterTellersUrl = '';
  counterTreasurersUrl = '';
  isLoading = false;
  counterMainBoxUrl = '';
  selectedMenu:
    | 'detail'
    | 'counterTellers'
    | 'counterTreasurers'
    | 'mainBoxList'
    | 'newMainBox' = 'detail';
  tellerHeaders = [
    {
      name: 'Teller',
      field: ['hr_operator.operator.employee_client.client_full_name'],
      size: '',
      detail: {
        link: '/w/workstation/desk/admin/agence/teller/',
        field: 'id',
      },
    },
    {
      name: 'Username',
      field: ['hr_operator.operator.username'],
      size: '',
    },
    {
      name: 'Operator',
      field: ['hr_treasurer.operator.employee_client.client_full_name'],
      size: '',
    },
    {
      name: 'Organization',
      field: ['hr_operator.organization.institution_client.client_full_name'],
      size: '',
    },
    {
      name: 'Acc Number',
      field: ['auxiliary_box.acc_number'],
      size: '',
    },
    {
      name: 'Description',
      field: ['auxiliary_box.category.description'],
      size: '',
    },
    {
      name: 'Active',
      field: ['hr_operator.organization.is_active'],
      size: '',
      boolean: true,
    },
  ];

  treasurerHeaders = [
    {
      name: 'Operator',
      field: ['operator.employee_client.client_full_name'],
      size: '',
      detail: {
        link: '/w/workstation/desk/admin/agence/treasurer/',
        field: 'id',
      },
    },
    {
      name: 'Type',
      field: ['operator.employee_client.client_type.title'],
      size: '',
    },
    {
      name: 'Organization',
      field: ['organization.institution_client.client_full_name'],
      size: '',
    },
    {
      name: 'Company Type',
      field: ['organization.company_type_name'],
      size: '',
    },
  ];

  mainBoxHeaders = [
    {
      name: 'Name',
      field: ['account_mapping.name'],
      size: '',
    },

    {
      name: 'Account',
      field: ['account_mapping.account.acc_short_number'],
      size: '',
    },
    {
      name: 'Currency',
      field: ['account_mapping.account.currency'],
      size: '',
    },
    {
      name: 'Balance',
      field: ['account_mapping.account.balance'],
      size: '',
      format: 'currency',
    },
    {
      name: 'Created At',
      field: ['account_mapping.created_at'],
      size: '',
      format: 'date',
    },
    {
      name: 'URL',
      field: ['account_mapping.account.absolute_url'],
      size: '',
    },
    {
      name: 'Category',
      field: ['account_mapping.account.category.description'],
      size: '',
    },
  ];

  constructor(
    private adminService: AdminService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService,
    private dialogService: DialogService
  ) {
    this.newMainBoxForm = new FormGroup({
      title: new FormControl('', Validators.required),
    });
  }
  ngOnInit(): void {
    if (this.route && this.route.fragment) {
      this.route.fragment.subscribe({
        next: fragment => {
          switch (fragment) {
            case 'counterTellers':
              this.selectedMenu = 'counterTellers';
              break;

            case 'counterTreasurers':
              this.selectedMenu = 'counterTreasurers';
              break;

            case 'mainBoxList':
              this.selectedMenu = 'mainBoxList';
              break;

            case 'newMainBox':
              this.selectedMenu = 'newMainBox';
              break;

            case null:
            default:
              this.selectedMenu = 'detail';
              break;
          }
        },
      });
    }

    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: params => {
        this.counterId = params['counterId'];
        this.counterTellersUrl = `/hr/tellers/list/?counter=${this.counterId}&`;
        this.counterTreasurersUrl = `/hr/treasurers/list/?counter=${this.counterId}&`;
        this.counterMainBoxUrl = `/hr/counter-mainbox/?counter=${this.counterId}&`;

        this.pageMenus = [
          {
            icon: 'circle-info',
            title: 'Counter Details',
            url: `/w/workstation/a/admin/counter/${this.counterId}`,
          },
          {
            icon: 'fa-solid fa-users',
            title: 'Counter tellers',
            url: `/w/workstation/a/admin/counter/${this.counterId}`,
            fragment: 'counterTellers',
          },
          {
            icon: 'fa-solid fa-people-line',
            title: 'Counter Treasurers',
            url: `/w/workstation/a/admin/counter/${this.counterId}`,
            fragment: 'counterTreasurers',
          },
          {
            icon: 'fa-regular fa-rectangle-list',
            title: 'MainBox List',
            url: `/w/workstation/a/admin/counter/${this.counterId}`,
            fragment: 'mainBoxList',
          },

          {
            icon: 'fa-solid fa-plus',
            title: 'AddMainBox',
            url: `/w/workstation/a/admin/counter/${this.counterId}`,
            fragment: 'newMainBox',
          },

          {
            icon: 'fa-solid fa-list-ul',
            title: 'Counter List',
            url: `/w/workstation/a/admin/counter/`,
          },
        ];
        this.menuService.setPageMenus(this.pageMenus);
      },
    });
    this.getCounterDetails();
  }
  goBack(): void {
    this.location.back();
  }

  refresh() {
    this.getCounterDetails();
    this.counterDetails = null;
  }
  selectedcurrency($event: ItemModel | null) {
    this.selectedCurrencyId = $event ? $event.id : null;
  }
  getCounterDetails() {
    this.loadingData = true;
    this.adminService.getCounterDetails(this.counterId).subscribe({
      next: (response: { object: CounterDetailsModele }) => {
        this.loadingData = false;
        this.counterDetails = response.object;
      },
    });
  }

  addNewMainBox() {
    this.dialogService.dispatchLoading();

    this.isLoading = true;

    const title = this.newMainBoxForm.get('title')?.value;

    const currency = this.selectedCurrencyId;
    const counter = this.counterId;
    if (currency) {
      this.adminService.addNewMainBox(title, currency, counter).subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogService.closeLoading();

          this.dialogService.openToast({
            type: 'success',
            title: 'Succès',
            message: 'Main Box added successfully!',
          });
          this.router.navigate(
            ['/w/workstation/a/admin/counter', this.counterId],
            {
              fragment: 'mainBoxList',
            }
          );
          this.newMainBoxForm.reset();
        },
        error: () => {
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            type: 'failed',
            title: 'Échec',
            message: 'Failed please try again',
          });
        },
      });
    }
  }
}
