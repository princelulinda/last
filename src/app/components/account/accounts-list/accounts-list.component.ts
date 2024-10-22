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
import { AccountsListModel } from '../models';

import { AmountVisibilityComponent } from '../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import {
  ActiveMainConfigModel,
  ModeModel,
  PlateformModel,
} from '../../../core/services/config/main-config.models';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [CommonModule, AmountVisibilityComponent, RouterLink],
  templateUrl: './accounts-list.component.html',
  styleUrl: './accounts-list.component.scss',
})
export class AccountsListComponent implements OnInit, OnDestroy, OnChanges {
  private onDestroy$ = new Subject<void>();

  mainConfig$!: Observable<ActiveMainConfigModel>;
  activePlatform!: PlateformModel;
  theme$: Observable<ModeModel>;
  theme!: ModeModel;

  clientId$: Observable<number>;
  clientId = 0;

  isLoading = false;
  accountsListData: AccountsListModel[] | [] | null = null;

  selectedLoneAccount: AccountsListModel | null = null;
  selectedAccount!: AccountsListModel[];
  isLoneAccountSelected = false;

  // close the account's creation form
  closeForm = false;
  @Input() Type: 'transfer' | 'list' = 'transfer';
  @Output() accountSelected = new EventEmitter<AccountsListModel>();
  @Output() dataLoaded = new EventEmitter<boolean>();
  @Input() isTransferDone = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isTransferDone']) {
      if (this.isTransferDone) {
        alert(this.isTransferDone);
        this.clearSelectedAccount();
      }
    }
  }

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private clientService: ClientService
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
    this.clientId$ = this.authService.getUserClientId();
    this.theme$ = this.configService.getMode();
  }

  ngOnInit(): void {
    this.clientId$.subscribe(clientId => {
      this.clientId = clientId;
      if (this.clientId) {
        this.getClientAccounts();
      }
    });
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: theme => {
        this.theme = theme;
      },
    });

    this.mainConfig$.subscribe({
      next: configs => {
        this.activePlatform = configs.activePlateform;
      },
    });
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
          this.dataLoaded.emit(true);
        },
        error: () => {
          this.isLoading = false;
          this.dataLoaded.emit(false); // Émet l'événement en cas d'erreur
        },
      });
  }

  clearSelectedAccount() {
    this.selectedLoneAccount = null;
  }

  selectLoneAccount(account: AccountsListModel) {
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

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
