import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

import { Subject, Observable, takeUntil } from 'rxjs';

import { WalletCardComponent } from '../../wallet/wallet-card/wallet-card.component';
import { NyamuranziCardComponent } from '../../nyamuranzi/nyamuranzi-card/nyamuranzi-card.component';
import {
  AuthService,
  ConfigService,
  DialogService,
} from '../../../core/services';
import { BankService } from '../../../core/services/bank/bank.service';
import { UserInfoModel } from '../../../core/db/models/auth';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { MerchantService } from '../../../core/services/merchant/merchant.service';
import { addBankResponse, MenuGroup } from '../dashboard.model';
import { BankModel } from '../../../core/db/models/bank/bank.model';
import {
  DialogResponseModel,
  MerchantPaymentTypesModel,
} from '../../../core/services/dialog/dialogs-models';
import {
  ModeModel,
  PlateformModel,
} from '../../../core/services/config/main-config.models';
import { BankHomeComponent } from './bank-home/bank-home.component';
import { ReusableListComponent } from '../../../global/components/list/reusable-list/reusable-list.component';
import { MerchantAutocompleteModel } from '../../merchant/merchant.models';

@Component({
  selector: 'app-online-banking',
  standalone: true,
  templateUrl: './online-banking.component.html',
  styleUrl: './online-banking.component.scss',
  imports: [
    WalletCardComponent,
    NyamuranziCardComponent,
    NgClass,
    SkeletonComponent,
    CommonModule,
    WalletCardComponent,
    RouterLink,
    RouterOutlet,
    BankHomeComponent,
    ReusableListComponent,
  ],
})
export class OnlineBankingComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  mode!: ModeModel;
  mode$!: Observable<ModeModel>;
  selectedBank!: BankModel;
  selectedBank$!: Observable<BankModel>;
  isLoading = false;

  clientVerified = '&filter_for_client=true';
  dialog$: Observable<DialogResponseModel>;
  banks: BankModel[] = [];
  banksFiltered: BankModel[] = [];

  clientId: number | null = null;
  merchantId: number | null = null;

  merchants: MerchantAutocompleteModel[] = [];
  openBankListPopup = false;
  selectedNewBank: number | null = null;
  clientInfo!: UserInfoModel;
  pin!: string;

  plateform!: PlateformModel;
  plateform$: Observable<PlateformModel>;
  activePlatform: string | null = null;

  private userInfo$: Observable<UserInfoModel>;

  menuGroups: MenuGroup[] = [
    {
      icon: 'building-columns',
      name: 'Banking services',
      description: 'Manage accounts, make payments.',
      menus: [
        {
          name: '',
          icon: '',
          link: '',
        },
      ],
      is_active: false,
    },
    {
      icon: 'piggy-bank',
      name: 'Savings and investment',
      description: 'Financial security through money management.',
      menus: [
        {
          name: 'Saving clubs',
          icon: 'users',
          link: [
            '/b/banking/saving/saving-club',
            '/w/workstation/b/bankingsaving/saving-club',
          ],
        },
      ],
      is_active: false,
    },
    {
      icon: 'building-user',
      name: 'Public services',
      description: 'Governement offerings for community.',
      menus: [
        {
          name: '',
          icon: '',
          link: '',
        },
      ],
      is_active: false,
    },
    {
      icon: 'globe',
      name: 'International transfer',
      description: 'Send money globally, with secure transactions.',
      menus: null,
      is_active: false,
    },
    {
      icon: 'people-roof',
      name: 'Life and General insurance',
      description: 'Financial security for your loved ones.',
      menus: null,

      is_active: false,
    },
    {
      icon: 'heart-pulse',
      name: 'Health and wellbeing',
      description: 'Prioritize your well-being for a healthier lifestyle.',
      menus: null,
      is_active: false,
    },
  ];

  constructor(
    private bankService: BankService,
    private configService: ConfigService,
    private authService: AuthService,
    private merchantService: MerchantService,
    private dialogService: DialogService
  ) {
    this.mode$ = this.configService.getMode();
    this.userInfo$ = this.authService.getUserInfo();
    this.selectedBank$ = this.configService.getSelectedBank();
    this.dialog$ = this.dialogService.getDialogState();
    this.plateform$ = this.configService.getPlateform();
  }
  ngOnInit(): void {
    this.mode$.subscribe({
      next: datas => {
        this.mode = datas;
      },
    });
    this.plateform$.subscribe({
      next: plateform => {
        this.plateform = plateform;
      },
    });
    this.userInfo$.subscribe({
      next: userinfo => {
        if (userinfo && userinfo.client) {
          this.clientInfo = userinfo;
          this.clientId = this.clientInfo.client.id;
        }
      },
    });

    this.selectedBank$.subscribe({
      next: datas => {
        this.selectedBank = datas;
      },
    });
    this.getPublicServicesMerchants();
    this.dialog$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (dialogResponse: DialogResponseModel) => {
        if (dialogResponse.response.pin) {
          this.pin = dialogResponse.response.pin;
          this.addBank();
        }
      },
    });

    this.getBanks();
    this.bankService
      .getBanksListAll()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.banksFiltered = data.objects;
        },
      });
  }

  getBanks() {
    this.bankService
      .getBanksList()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.banks = data;
        },
      });
  }
  toggleModal() {
    this.openBankListPopup = false;
  }

  addBank() {
    const body = {
      client: this.clientId,
      organization: this.selectedNewBank,
      pin_code: this.pin,
    };
    this.dialogService.dispatchLoading();

    this.bankService
      .addBank(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (response: addBankResponse) => {
          console.log(response);
          this.dialogService.closeLoading();
          if (response.object.success === false) {
            this.dialogService.closeLoading();

            this.openBankListPopup = false;
            this.pin = '';
            this.dialogService.openToast({
              type: 'failed',
              title: 'Échec',
              message:
                response?.object?.response_message ??
                $localize`Something went wrong please retry again !`,
            });
          } else {
            this.banks = [];
            this.getBanks();
            this.pin = '';

            this.dialogService.openToast({
              type: 'success',
              title: '',
              message:
                response.object.response_message ??
                $localize`Bank added successfully`,
            });
          }
        },
        error: error => {
          this.dialogService.closeLoading();

          this.openBankListPopup = false;
          this.pin = '';

          this.dialogService.openToast({
            type: 'failed',
            title: '',
            message:
              error?.object?.response_message ??
              $localize`Something went wrong please retry again `,
          });
        },
      });
  }
  getAddedBankId(bankId: number) {
    this.selectedNewBank = bankId;
  }
  selectBank(bank: BankModel) {
    this.configService.setSelectedBank(bank);
  }

  openMerchantPayment(
    type: MerchantPaymentTypesModel,
    merchant: MerchantAutocompleteModel
  ) {
    this.dialogService.openMerchantPaymentDialog({
      type: type,
      merchant: merchant,
    });
  }

  showMenus(index: number) {
    this.menuGroups.forEach((menu, i) => {
      if (i !== index) {
        menu.is_active = false;
      } else {
        menu.is_active = !menu.is_active;
      }
    });
  }
  getPublicServicesMerchants() {
    this.merchantService
      .getMerchantsByCategoriesSlug('public-services')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.merchants = data.objects;
        },
      });
  }

  openPinPopup() {
    this.dialogService.openDialog({
      type: 'pin',
      title: 'Enter your PIN code',
      message:
        'To create an account in this bank, enter your PIN code to continue.',
      action: 'confirmation',
    });
  }
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  paymentsHeaders = [
    {
      name: 'Date',
      field: ['created_at'],
      size: '',
      format: 'date',
    },
    {
      name: 'Amount',
      field: ['amount'],
      size: '',
      format: 'currency',
    },
    {
      name: 'Account',
      field: [
        'other_info.credit_account.data.account_holder',
        'other_info.credit_account.data.account_number',
      ],
      size: '',
    },
    {
      name: 'Reference',
      field: ['reference'],
      size: '',
    },
    {
      name: 'Merchant reference',
      field: ['other_info.merchant_reference.data'],
      size: '',
    },
    {
      name: 'Status',
      field: ['status.title'],
      css: 'status.css',
      class: 'badge',
      size: '',
    },
    {
      name: 'Description',
      field: ['comment'],
      size: '4',
      canBeDisplayed: false,
    },
  ];
}
