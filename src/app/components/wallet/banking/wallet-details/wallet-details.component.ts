import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../../../../core/services/client/client.service';
import { ActiveMainConfigModel } from '../../../../core/services/config/main-config.models';
import { walletDetailModel } from '../../wallet.models';
import { WalletListComponent } from '../wallet-list/wallet-list.component';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WalletTopupComponent } from '../wallet-topup/wallet-topup.component';
@Component({
  selector: 'app-wallet-details',
  standalone: true,
  imports: [
    WalletListComponent,
    AmountVisibilityComponent,
    CommonModule,
    RouterLink,
    WalletTopupComponent,
  ],
  templateUrl: './wallet-details.component.html',
  styleUrl: './wallet-details.component.scss',
})
export class WalletDetailsComponent implements OnInit {
  walletId!: string;
  isLoading = false;
  mainConfig$!: Observable<ActiveMainConfigModel>;
  mainConfig!: ActiveMainConfigModel;
  wallet: walletDetailModel | null = null;
  hasWalletList = false;
  isTopUpClicked!: string;

  constructor(
    private clientService: ClientService,

    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe({
      next: data => {
        this.walletId = data['walletId'];
        if (this.walletId) {
          this.getClientWalletDetails();
        }
      },
    });
  }

  getClientWalletDetails() {
    this.isLoading = true;
    this.wallet = null;
    this.clientService.getWalletDetails(this.walletId).subscribe({
      next: response => {
        this.wallet = response.object;
      },
    });
  }
  onTopupSuccess() {
    this.getClientWalletDetails(); // Actualiser les détails du portefeuille
    this.isTopUpClicked = '';
  }
  refresh() {
    this.wallet = null;

    this.isLoading = true;

    this.getClientWalletDetails();
  }

  selectedOption(option: string) {
    this.isTopUpClicked = option;
  }
}
