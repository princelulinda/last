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
import {
  activeMainConfigModel,
  ModeModel,
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
  mainConfig$!: Observable<activeMainConfigModel>;
  activePlatform: string | null = null;
  private client_id$: Observable<number>;
  clientId!: number;
  theme$: Observable<ModeModel>;
  theme!: ModeModel;
  isLoading = false;
  accountsListData: accountsList[] | [] | null = null;

  selectedLoneAccount: accountsList | null = null;
  selectedAccount!: accountsList[];
  isLoneAccountSelected = false;

  // close the account's creation form
  closeForm = false;
  @Input() Type: 'transfer' | 'list' = 'transfer';
  @Output() accountSelected = new EventEmitter<accountsList>();
  @Output() dataLoaded = new EventEmitter<boolean>();
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
    this.theme$ = this.configService.getMode();
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
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: theme => {
        this.theme = theme;
        //console.log('themmeee',this.theme)
      },
    });

    this.mainConfig$.subscribe({
      next: configs => {
        this.activePlatform = configs.activePlateform;
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
          this.dataLoaded.emit(true);
        },
        error: err => {
          console.error('Erreur :', err);
          this.isLoading = false;
          this.dataLoaded.emit(false); // Émet l'événement en cas d'erreur
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
