import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';

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
import {
  addBankResponse,
  MenuGroup,
  MerchantLookup,
  PayMerchant,
} from '../dashboard.model';
import { userInfoModel } from '../../../layouts/header/model';
import { bankModel } from '../../../core/db/models/bank/bank.model';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';
import { ModeModel } from '../../../core/services/config/main-config.models';

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
  ],
})
export class OnlineBankingComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  mode!: ModeModel;
  mode$!: Observable<ModeModel>;
  selectedBank!: bankModel;
  selectedBank$!: Observable<bankModel>;
  isLoading = false;

  clientVerified = '&filter_for_client=true';
  dialog$: Observable<DialogResponseModel>;
  banks: bankModel[] = [];
  banksFiltered: bankModel[] = [];

  clientId: number | null = null;
  merchantId: number | null = null;
  payMerchant: PayMerchant | null = null;
  merchants: MerchantLookup[] = [];
  openBankListPopup = false;
  selectedNewBank: number | null = null;
  userInfo!: userInfoModel;
  clientInfo!: UserInfoModel;
  pin!: string;

  private userInfo$: Observable<UserInfoModel>;

  @ViewChild('closeModal') closeModal!: ElementRef;

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
          link: '/b/onlineBanking/banking/menuBanking/saving/club',
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
    private dialogService: DialogService,
    private router: Router
  ) {
    this.mode$ = this.configService.getMode();
    this.userInfo$ = this.authService.getUserInfo();
    this.selectedBank$ = this.configService.getSelectedBank();
    this.dialog$ = this.dialogService.getDialogState();
  }
  ngOnInit(): void {
    this.mode$.subscribe({
      next: datas => {
        this.mode = datas;
      },
    });
    this.userInfo$.subscribe({
      next: userinfo => {
        this.clientInfo = userinfo;
        this.clientId = this.clientInfo.client.id;
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
      client: this.clientInfo.client.id,
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

          if (response && response.object && response.object.success === true) {
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
            this.closeModal.nativeElement.click();
          } else if (response.object.success === false) {
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
  selectBank(bank: bankModel) {
    this.configService.setSelectedBank(bank);
    if (bank) {
      this.router.navigate(['']);
    }
  }
  getMerchant(data: PayMerchant, event: MouseEvent) {
    event.stopPropagation();
    // add data-bs after click on favorite star
    const element = event.target as HTMLButtonElement;
    element.setAttribute('data-bs-target', '#publicService');
    element.setAttribute('data-bs-toggle', 'modal');
    element.click();
    this.payMerchant = data;
    if (this.payMerchant) {
      this.merchantId = this.payMerchant.id;
    }
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
        error: () => {
          // code
        },
      });
  }

  openPinPopup() {
    this.dialogService.openDialog({
      type: 'pin',
      title: 'Enter your PIN code',
      message: 'Please enter your PIN code to continue.',
      action: 'confirmation',
    });
  }
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
