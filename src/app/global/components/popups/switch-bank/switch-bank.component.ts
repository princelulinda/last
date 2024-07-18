import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';

import { Observable, Subject, takeUntil } from 'rxjs';

import { BankService } from '../../../../core/services/bank/bank.service';
import {
  AuthService,
  ConfigService,
  ModeModel,
} from '../../../../core/services';
import { UserInfoModel } from '../../../../core/db/models/auth';
import { userInfoModel } from '../../../../layouts/header/model';
import { BankOptions } from '../../../../components/dashboards/dashboard.model';
import { bankModel } from '../../../../core/db/models/bank/bank.model';
@Component({
  selector: 'app-switch-bank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './switch-bank.component.html',
  styleUrl: './switch-bank.component.scss',
})
export class SwitchBankComponent implements OnInit {
  banks: bankModel[] = [];
  // clientId$: any;
  clientId: number | null = null;
  defaultBank: bankModel | undefined;
  selectedBank!: bankModel;
  selectedBank$!: Observable<bankModel>;
  // loans: any;
  isModalShown = false;
  mode!: ModeModel;
  mode$!: Observable<ModeModel>;
  userInfo!: userInfoModel;
  clientInfo!: UserInfoModel;
  private userInfo$: Observable<UserInfoModel>;
  @Output() bankOptions = new EventEmitter<BankOptions>();
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private bankService: BankService,
    private configService: ConfigService,
    private authService: AuthService
  ) {
    this.mode$ = this.configService.getMode();
    this.userInfo$ = this.authService.getUserInfo();
    this.selectedBank$ = this.configService.getSelectedBank();
  }

  ngOnInit() {
    this.mode$.subscribe({
      next: datas => {
        this.mode = datas;
      },
    });

    this.userInfo$.subscribe({
      next: userinfo => {
        this.clientInfo = userinfo;
        this.clientId = this.clientInfo.client.client_id;

        this.selectedBank$.subscribe({
          next: datas => {
            this.selectedBank = datas;
          },
        });

        this.bankService
          .getBanksList()
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(banks => {
            this.banks = banks;
            const options = {
              selectedDebitAccountType: null,
              debitAccount: null,
              debitWallet: null,
              banks: this.banks,
              creditAccountType: null,
              accounts: null,
              wallets: null,
            };

            this.bankOptions.emit(options);

            this.defaultBank = banks.find(bank => bank.is_default === true);
          });
      },
    });
  }

  switchBank(index: number) {
    // this.loanService
    //     .getLoansList()
    //     .pipe(takeUntil(this.onDestroy$))
    //     .subscribe((loans: any) => {
    //         this.loans = loans.object.response_data;
    //         // console.log('loans', this.loans.length);
    //         this.loanService.getLoansLength(this.loans.length);
    //     });
    const options: BankOptions = {
      selectedDebitAccountType: null,
      debitAccount: null,
      debitWallet: null,
      banks: this.banks,
      creditAccountType: null,
      accounts: null,
      wallets: null,
    };
    this.bankOptions.emit(options);
    this.selectedBank = this.banks[index];

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
    this.isModalShown = false;
    console.log(index);
  }

  closeModal(event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest('.inner-container')) {
      this.isModalShown = false;
    }
  }

  showModal() {
    this.isModalShown = true;
  }
}
