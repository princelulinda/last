import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../../../core/services/client/client.service';
import { activeMainConfigModel } from '../../../core/services/config/main-config.models';
import { WalletList } from '../wallet.models';

@Component({
  selector: 'app-wallet-details',
  standalone: true,
  imports: [],
  templateUrl: './wallet-details.component.html',
  styleUrl: './wallet-details.component.scss',
})
export class WalletDetailsComponent implements OnInit {
  walletId!: string;
  isLoading = false;
  mainConfig$!: Observable<activeMainConfigModel>;
  mainConfig!: activeMainConfigModel;
  wallet: WalletList[] | [] | null = null;
  hasWalletList = false;
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
    this.clientService.hasWalletList$.subscribe(value => {
      this.hasWalletList = value;
    });
  }

  getClientWalletDetails() {
    this.isLoading = true;
    this.wallet = null;

    this.clientService.getWalletDetails(this.walletId).subscribe({
      next: response => {
        this.wallet = response.object;
        this.isLoading = false;
      },
      error: err => {
        console.error('Erreur lors de la récupération des emails:', err);
        this.isLoading = false;
      },
    });
  }
}
