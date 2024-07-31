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
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthService, ConfigService } from '../../../core/services';
import { ClientService } from '../../../core/services/client/client.service';
import { UserInfoModel } from '../../../core/db/models/auth';
import { CommonModule } from '@angular/common';
import { AmountVisibilityComponent } from '../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import {
  activeMainConfigModel,
  ModeModel,
} from '../../../core/services/config/main-config.models';
import { WalletList } from '../wallet.models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wallet-list',
  standalone: true,
  imports: [CommonModule, AmountVisibilityComponent, RouterLink],
  templateUrl: './wallet-list.component.html',
  styleUrl: './wallet-list.component.scss',
})
export class WalletListComponent implements OnInit, OnDestroy, OnChanges {
  mainConfig$!: Observable<activeMainConfigModel>;
  mainConfig!: activeMainConfigModel;
  private userInfo$: Observable<UserInfoModel>;
  clientInfo!: UserInfoModel;
  clientId!: number;
  isLoading = false;
  walletsListData: WalletList[] | [] | null = null;

  selectedLoneWallet: WalletList | null = null;
  selectedWallet!: WalletList[];
  isLoneWalletSelected = false;
  theme$: Observable<ModeModel>;
  theme!: ModeModel;
  // close the account's creation form
  closeForm = false;
  @Input() Type: 'transfer' | 'list' = 'transfer';
  @Output() walletSelected = new EventEmitter<WalletList>();

  @Output() dataLoaded = new EventEmitter<boolean>();

  private onDestroy$ = new Subject<void>();
  isWalletDetailsShown = false;
  @Input() isTransferDone = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isTransferDone']) {
      if (this.isTransferDone) {
        this.clearSelectedWallet();
      }
    }
  }

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private clientService: ClientService
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
    this.userInfo$ = this.authService.getUserInfo();
    this.theme$ = this.configService.getMode();
  }
  ngOnInit(): void {
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: theme => {
        this.theme = theme;
        //console.log('themmeee',this.theme)
      },
    });

    this.userInfo$.subscribe({
      next: userinfo => {
        this.clientInfo = userinfo;
        this.clientId = this.clientInfo.client.id;
        if (this.clientId) {
          this.getClientAccounts();
        }
      },
    });

    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });
  }

  getClientAccounts() {
    this.isLoading = true;
    this.clientService.getWallets(this.clientId).subscribe({
      next: response => {
        this.walletsListData = response.objects;
        this.isLoading = false;
        this.dataLoaded.emit(true); // Émet l'événement lorsque les données sont chargées
      },
      error: err => {
        console.error('Erreur :', err);
        this.isLoading = false;
        this.dataLoaded.emit(false); // Émet l'événement en cas d'erreur
      },
    });
  }
  clearSelectedWallet() {
    this.selectedLoneWallet = null;
  }

  selectLoneAccount(wallet: WalletList) {
    this.selectedLoneWallet = wallet;
    this.isLoneWalletSelected = true;
    this.isLoading = false;
    this.closeForm = false;
    this.walletSelected.emit(wallet);
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
