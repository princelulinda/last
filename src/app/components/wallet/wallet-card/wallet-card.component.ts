import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable, takeUntil } from 'rxjs';
import {
  AuthService,
  BankService,
  ClientService,
  ConfigService,
  DialogService,
} from '../../../core/services';
import { UserInfoModel } from '../../../core/db/models/auth';

import { NgClass, CommonModule } from '@angular/common';
import { WalletCardModel, WalletTypModel } from '../wallet.models';
import { BankModel } from '../../../core/db/models/bank/bank.model';
import { ModeModel } from '../../../core/services/config/main-config.models';
import { RouterLink } from '@angular/router';
import { AmountVisibilityComponent } from '../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StatementComponent } from '../../statements/statement/statement.component';
interface mainConfigModel {
  activeMode: string;
  activePlateform: string;
  activeTheme: string;
}
@Component({
  selector: 'app-wallet-card',
  standalone: true,
  imports: [
    NgClass,
    CommonModule,
    RouterLink,
    AmountVisibilityComponent,
    ReactiveFormsModule,
    StatementComponent,
  ],
  templateUrl: './wallet-card.component.html',
  styleUrl: './wallet-card.component.scss',
})
export class WalletCardComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  mode!: ModeModel;
  mode$!: Observable<ModeModel>;
  clientInfo!: UserInfoModel;
  selectedBank!: BankModel;
  selectedBank$!: Observable<BankModel>;
  private userInfo$: Observable<UserInfoModel>;
  mainConfig$!: Observable<mainConfigModel>;
  activePlatform: string | null = null;
  defaultWalletId!: string;
  defaultWallet!: WalletCardModel;
  noWalletData = false;
  clientId: number | null = null;
  bankId: number | null = null;
  mouseHover = false;
  walletForm!: FormGroup;
  isLoading = false;
  walletsTypeData: WalletTypModel[] | [] | null = null;
  constructor(
    private bankService: BankService,
    private configService: ConfigService,
    private authService: AuthService,
    private clientService: ClientService,
    private dialogService: DialogService
  ) {
    this.mode$ = this.configService.getMode();
    this.userInfo$ = this.authService.getUserInfo();
    this.selectedBank$ = this.configService.getSelectedBank();
    this.mainConfig$ = this.configService.getMainConfig();

    this.mainConfig$ = this.configService.getMainConfig();
    this.walletForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      category: new FormControl('', Validators.required),
      pin: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.maxLength(4),
      ]),
    });
  }
  ngOnInit(): void {
    this.mode$.subscribe({
      next: datas => {
        this.mode = datas;
      },
    });

    this.mainConfig$.subscribe({
      next: configs => {
        this.activePlatform = configs.activePlateform;
      },
    });

    this.userInfo$.subscribe({
      next: userinfo => {
        if (userinfo) {
          this.clientInfo = userinfo;
          this.clientId = this.clientInfo.client.id;
          if (this.clientId) {
            this.selectedBank$.subscribe({
              next: datas => {
                this.selectedBank = datas;
                this.bankId = this.selectedBank?.id;
                if (this.bankId) {
                  this.getDefaultWallet();
                }
              },
            });
          }
        }
      },
    });
    this.getDefaultWallet();
    this.getWalletType();
  }

  // toggleAmount() {
  //   this.dialogService.displayAmount();
  // }

  getWalletType() {
    this.isLoading = true;
    this.clientService.getWalletType().subscribe({
      next: response => {
        this.walletsTypeData = response.objects;
        this.isLoading = false;
      },
      error: err => {
        console.error('Erreur :', err);
        this.isLoading = false;
      },
    });
  }

  getDefaultWallet() {
    this.bankService
      .getDefaultWallet()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: defaultWallet => {
          this.defaultWallet = defaultWallet.object;
          this.defaultWalletId = this.defaultWallet.response_data.id;
          //console.log('defaultWalletId', this.defaultWalletId);
          if (defaultWallet.object.success === false) {
            this.noWalletData = true;
          }
        },
      });
  }
  onSubmit() {
    if (this.walletForm.valid) {
      console.log(this.walletForm.value);
      this.creatWallet();
    } else {
      console.log('Form is invalid');
    }
  }

  creatWallet() {
    this.dialogService.dispatchLoading();
    // const selectedCategoryId = this.walletForm.get('category')?.value;
    // this.loading = true;

    const selectedCategoryId = this.walletForm.get('category')?.value;
    const title = this.walletForm.get('name')?.value;
    const pin_code = this.walletForm.get('pin')?.value;
    this.clientService
      .creatWallet(selectedCategoryId, title, pin_code)
      .subscribe({
        next: response => {
          //this.loading = false;
          this.dialogService.closeLoading();
          if (response.object.success) {
            this.dialogService.openToast({
              type: 'success',
              title: 'Succès',
              message: response.object.response_message,
            });
            this.walletForm.reset();
          } else {
            this.dialogService.openToast({
              type: 'failed',
              title: 'Échec',
              message: response.object.response_message,
            });
          }
        },
        error: error => {
          console.error('creation  failed', error);
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            type: 'failed',
            title: 'Échec',
            message: 'failed please try again',
          });
        },
      });
  }
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
