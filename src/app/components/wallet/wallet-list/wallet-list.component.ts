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
  ActiveMainConfigModel,
  ModeModel,
} from '../../../core/services/config/main-config.models';
import { WalletModel } from '../wallet.models';
import { RouterLink } from '@angular/router';
import { VariableService } from '../../../core/services/variable/variable.service';
@Component({
  selector: 'app-wallet-list',
  standalone: true,
  imports: [CommonModule, AmountVisibilityComponent, RouterLink],
  templateUrl: './wallet-list.component.html',
  styleUrl: './wallet-list.component.scss',
})
export class WalletListComponent implements OnInit, OnDestroy, OnChanges {
  mainConfig$!: Observable<ActiveMainConfigModel>;
  mainConfig!: ActiveMainConfigModel;
  clientId$: Observable<number>;
  clientId!: UserInfoModel;

  isLoading = false;
  walletsListData: WalletModel[] | [] | null = null;
  userClientId!: number;
  activePlatform: string | null = null;
  selectedLoneWallet: WalletModel | null = null;
  selectedWallet!: WalletModel[];
  isLoneWalletSelected = false;
  theme$: Observable<ModeModel>;
  theme!: ModeModel;
  closeForm = false;

  @Input() Type: 'transfer' | 'list' = 'transfer';
  @Output() walletSelected = new EventEmitter<WalletModel>();

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
    private clientService: ClientService,
    private variableService: VariableService
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
    this.clientId$ = this.authService.getUserClientId();
    this.theme$ = this.configService.getMode();
  }
  ngOnInit(): void {
    this.clientId$.subscribe(clientId => {
      this.userClientId = clientId;

      if (this.userClientId) {
        this.getClientWallet();
      }
    });
    this.variableService.topUpComplete$.subscribe(() => {
      this.getClientWallet(); // Actualiser la liste des wallets
    });

    this.mainConfig$.subscribe({
      next: configs => {
        this.activePlatform = configs.activePlateform;
      },
    });

    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: theme => {
        this.theme = theme;
      },
    });

    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });
  }

  getClientWallet() {
    this.isLoading = true;
    this.clientService.getWallets(this.userClientId).subscribe({
      next: response => {
        this.walletsListData = response.objects;
        this.isLoading = false;
        this.dataLoaded.emit(true); // Émet l'événement lorsque les données sont chargées
      },
      error: () => {
        this.isLoading = false;
        this.dataLoaded.emit(false); // Émet l'événement en cas d'erreur
      },
    });
  }

  clearSelectedWallet() {
    this.selectedLoneWallet = null;
  }

  selectLoneAccount(wallet: WalletModel) {
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
