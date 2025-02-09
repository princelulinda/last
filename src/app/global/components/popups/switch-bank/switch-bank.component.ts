import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';

import { Observable, Subject, takeUntil } from 'rxjs';

import { BankService } from '../../../../core/services/bank/bank.service';
import { AuthService, ConfigService } from '../../../../core/services';
import { UserInfoModel } from '../../../../core/db/models/auth';
import { BankOptionsModel } from '../../../../components/dashboards/dashboard.model';
import { BankModel } from '../../../../core/db/models/bank/bank.model';
import { ModeModel } from '../../../../core/services/config/main-config.models';
@Component({
  selector: 'app-switch-bank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './switch-bank.component.html',
  styleUrl: './switch-bank.component.scss',
})
export class SwitchBankComponent implements OnInit {
  banks: BankModel[] = [];
  @Input() isTransfer = false;
  clientId: number | null = null;
  defaultBank: BankModel | undefined;
  selectedBank!: BankModel;
  selectedBank$!: Observable<BankModel>;

  isModalShown = false;
  mode!: ModeModel;
  mode$!: Observable<ModeModel>;
  clientInfo!: UserInfoModel;
  private userInfo$: Observable<UserInfoModel>;
  @Output() bankOptions = new EventEmitter<BankOptionsModel>();
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

    this.selectedBank$.subscribe({
      next: bank => {
        this.selectedBank = bank;
      },
    });
  }

  switchBank(index: number) {
    this.selectedBank = this.banks[index];
    this.configService.setSelectedBank(this.selectedBank);
    this.isModalShown = false;
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
