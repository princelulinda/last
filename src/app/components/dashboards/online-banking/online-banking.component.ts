import { Component, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { WalletCardComponent } from '../../wallet/wallet-card/wallet-card.component';
import { NyamuranziCardComponent } from '../../nyamuranzi/nyamuranzi-card/nyamuranzi-card.component';
import { Subject, Observable, takeUntil } from 'rxjs';
import { AuthService, ConfigService, ModeModel } from '../../../core/services';
import { CommonModule, NgClass } from '@angular/common';
import { BankService } from '../../../core/services/bank/bank.service';
import { UserInfoModel } from '../../../core/db/models/auth';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { MerchantService } from '../../../core/services/merchant/merchant.service';
import { MenuGroup, MerchantLookup, PayMerchant } from '../dashboard.model';
import { userInfoModel } from '../../../layouts/header/model';
import { WithdrawalComponent } from '../../withdrawal/withdrawal.component';
import { bankModel } from '../../../core/db/models/bank/bank.model';
import { SessionsComponent } from '../../dev/sessions/sessions/sessions.component';
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
    WithdrawalComponent,
    WalletCardComponent,
    SessionsComponent,
  ],
})
export class OnlineBankingComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  mode!: ModeModel;
  mode$!: Observable<ModeModel>;

  isLoading = false;

  clientVerified = '&filter_for_client=true';

  //  clientId$: Observable<any>;
  //  clientId: any;
  //  client$: Observable<any>;
  //  client: any;
  //  selectedBankId$: Observable<any>;
  //  selectedBankId: any;

  banks: bankModel[] = [];
  banksFiltered: bankModel[] = [];

  clientId: number | null = null;
  merchantId: number | null = null;
  selectedBank: object | undefined;
  payMerchant: PayMerchant | null = null;
  merchants: MerchantLookup[] = [];
  openBankListPopup = false;
  selectedNewBank: number | null = null;
  userInfo!: userInfoModel;
  clientInfo!: UserInfoModel;
  private userInfo$: Observable<UserInfoModel>;

  @ViewChild('closeModal') closeModal = '';

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
    @Inject(BankService) private bankService: BankService,
    @Inject(ConfigService) private configService: ConfigService,
    @Inject(AuthService) private authService: AuthService,
    @Inject(MerchantService) private merchantService: MerchantService
  ) {
    this.mode$ = this.configService.getMode();
    this.userInfo$ = this.authService.getUserInfo();
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
    this.getPublicServicesMerchants();

    //   this.clientId$.pipe(takeUntil(this.onDestroy$)).subscribe({
    //     next: (clientId) => {
    //         this.clientId = clientId;
    //         if (this.clientId) {
    //             this.selectedBankId$.pipe(takeUntil(this.onDestroy$)).subscribe({
    //                 next: (bankId) => {
    //                     if (bankId) {
    //                         this.getDefaultAccount();
    //                         this.getTontineData();
    //                         this.getDefaultWallet();

    //                         const period = {
    //                             start_date: '',
    //                             end_date: '',
    //                         };
    //                         this.transferService
    //                             .getRecentTransactions(
    //                                 '',
    //                                 period,
    //                                 this.clientVerified
    //                             )
    //                             .subscribe((recentTransactions: any) => {
    //                                 this.recentTransactions =
    //                                     recentTransactions.objects;
    //                             });
    //                     }
    //                 },
    //             });
    //         }
    //     },
    // });

    this.getBanks();
    this.bankService
      .getBanksListAll()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.banksFiltered = data.objects;
        },
        error: () => {
          // code
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
        error: () => {
          // code
        },
      });
  }
  toggleModal() {
    this.openBankListPopup = false;
  }

  addBank() {
    // const body = {
    //     client: this.clientInfo.client.id,
    //     organization: this.selectedNewBank,
    //     // pin_code: this.variableService.pin,
    // };
    // const response = {
    //     title: '',
    //     type: 'loading',
    //     message: '',
    // };
    // this.store.dispatch(new OpenDialog(response));
    // this.bankService
    //     .addBank(body)
    //     .pipe(takeUntil(this.onDestroy$))
    //     .subscribe({
    //         next: (response) => {
    //             console.log(response);
    //             // this.store.dispatch(new CloseDialog({ response: 'close' }));
    //             // if (response || response.object.success === true) {
    //             //     this.banks = null;
    //             //     this.getBanks();
    //             //     // this.variableService.pin = '';
    //             //     // const notification = {
    //             //     //     title: '',
    //             //     //     type: 'success',
    //             //     //     message: 'Bank added successfully',
    //             //     // };
    //             //     // this.store.dispatch(new OpenDialog(notification));
    //             //     this.closeModal.nativeElement.click();
    //             // } else if (response.object.success === false) {
    //             //     // this.store.dispatch(
    //             //     //     new CloseDialog({ response: 'close' })
    //             //     // );
    //             //     this.openBankListPopup = false;
    //             //     // this.variableService.pin = '';
    //             //     // const notification = {
    //             //     //     title: '',
    //             //     //     type: 'failed',
    //             //     //     message: response.object.response_message,
    //             //     // };
    //             //     // this.store.dispatch(new OpenDialog(notification));
    //             // }
    //         },
    //         error: (msg) => {
    //             console.log('error', msg);
    //             // this.store.dispatch(new CloseDialog({ response: 'close' }));
    //             this.openBankListPopup = false;
    //             // this.variableService.pin = '';
    //             // const notification = {
    //             //     title: '',
    //             //     type: 'failed',
    //             //     message: 'Something went wrong, please try again',
    //             // };
    //             // this.store.dispatch(new OpenDialog(notification));
    //         },
    //     });
  }
  getAddedBankId(bankId: number) {
    this.selectedNewBank = bankId;
  }
  selectBank(bank: object | undefined) {
    this.selectedBank = bank;

    // this.store.dispatch(
    //     new SelectClientBank({
    //         id: this.selectedBank.id,
    //         name: this.selectedBank.name,
    //         slug: this.selectedBank.slug,
    //         bank_type: this.selectedBank.bank_type,
    //         bank_code: this.selectedBank.bank_code,
    //         is_active: this.selectedBank.is_active,
    //         is_default: this.selectedBank.is_default,
    //         company: this.selectedBank.company,
    //     })
    // );
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
  // copyReferalLink() {
  //   const reference = this.clipboardService.copyFromContent(
  //       window.location.origin + '/ihela/sign-up/' + this.clientId
  //   );

  //   // if (reference) {
  //   //     const data = {
  //   //         title: '',
  //   //         type: 'success',
  //   //         message: 'Referal link copied to clipboard',
  //   //     };
  //   //     this.store.dispatch(new OpenDialog(data));
  //   // }
  // }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
