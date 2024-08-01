import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Observable, Subject, takeUntil } from 'rxjs';

import { AuthService, ConfigService } from '../../../core/services';
import { ClientService } from '../../../core/services/client/client.service';
import { accountsList } from '../models';

import { AmountVisibilityComponent } from '../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { activeMainConfigModel } from '../../../core/services/config/main-config.models';
@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [CommonModule, AmountVisibilityComponent],
  templateUrl: './accounts-list.component.html',
  styleUrl: './accounts-list.component.scss',
})
export class AccountsListComponent implements OnInit, OnDestroy, OnChanges {
  mainConfig$!: Observable<activeMainConfigModel>;
  mainConfig!: activeMainConfigModel;
  private client_id$: Observable<number>;
  clientId!: number;

  isLoading = false;
  accountsListData: accountsList[] | [] | null = null;

  selectedLoneAccount: accountsList | null = null;
  selectedAccount!: accountsList[];
  isLoneAccountSelected = false;

  // close the account's creation form
  closeForm = false;
  @Input() Type: 'transfer' | 'list' = 'transfer';
  @Output() accountSelected = new EventEmitter<accountsList>();
  @Input() isTransferDone = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isTransferDone']) {
      if (this.isTransferDone) {
        this.clearSelectedAccount();
      }
    }
  }

  private onDestroy$ = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private clientService: ClientService
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
    this.client_id$ = this.authService.getUserClientId();
  }

  ngOnInit(): void {
    this.client_id$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: client_id => {
        this.clientId = client_id;
        if (this.clientId) {
          this.getClientAccounts();
        }
      },
    });
    // this.clientId = Number(this.authService.getLocalClientId())
    // if(this.clientId){
    //    this.getClientAccounts();
    // }

    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  getClientAccounts() {
    this.isLoading = true;
    this.clientService
      .getClientAccounts(this.clientId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.accountsListData = response.objects;
          this.isLoading = false;
        },
        error: err => {
          console.error('Erreur :', err);
          this.isLoading = false;
        },
      });
  }

  clearSelectedAccount() {
    this.selectedLoneAccount = null;
  }

  selectLoneAccount(account: accountsList) {
    this.selectedLoneAccount = account;
    this.isLoneAccountSelected = true;
    this.isLoading = false;
    this.closeForm = false;
    this.accountSelected.emit(account);
  }

  refresh() {
    this.accountsListData = null;
    this.isLoading = true;
    this.getClientAccounts();
  }
}
