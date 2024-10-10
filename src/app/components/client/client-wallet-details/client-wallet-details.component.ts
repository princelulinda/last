import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../core/services';
import { WalletDetail } from '../../wallet/wallet.models';
import { ActivatedRoute } from '@angular/router';
import { ClipboardDirective } from '../../../global/directives/clipboard/clipboard.directive';
import { ListComponent } from '../../../global/components/list/list/list.component';
import { AmountVisibilityComponent } from '../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-client-wallet-details',
  standalone: true,
  imports: [
    CommonModule,
    ClipboardDirective,
    AmountVisibilityComponent,
    ListComponent,
  ],
  templateUrl: './client-wallet-details.component.html',
  styleUrl: './client-wallet-details.component.scss',
})
export class ClientWalletDetailsComponent implements OnInit, OnDestroy {
  selectedSetting = 'details';
  selectedConfig = false;
  isLoading = false;
  walletDetails: WalletDetail | null = null;
  walletId!: string;
  private onDestroy$ = new Subject<void>();
  headers = [
    {
      name: 'Date',
      field: ['date_created'],
      size: '',
      format: 'date',
    },
    {
      name: 'Wallet Number',
      field: ['client_account'],
      size: '',
    },
    {
      name: 'Details',
      field: ['description'],
      size: '',
    },
    {
      name: 'Reference',
      field: ['reference'],
      size: '',
    },
    {
      name: 'Debit',
      field: ['debit'],
      size: '',
      format: 'currency',
    },
    {
      name: 'Credit amount',
      field: ['credit'],
      size: '',
      format: 'currency',
    },
    {
      name: 'Balance',
      field: ['solde'],
      size: '',
      format: 'currency',
    },
  ];
  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe({
      next: data => {
        this.walletId = data['walletId'];
      },
    });
    this.getClientWalletDetails();
  }

  getClientWalletDetails() {
    this.isLoading = true;
    this.walletDetails = null;
    this.clientService.getWalletDetails(this.walletId).subscribe({
      next: (response: { object: WalletDetail }) => {
        this.walletDetails = response.object;
      },
      error: error =>
        console.error('Erreur lors de la récupération des tontines:', error),
    });
  }

  refresh() {
    this.walletDetails = null;

    this.isLoading = true;

    this.getClientWalletDetails();
  }
  selectSetting(setting: string) {
    this.selectedSetting = setting;
    if (this.selectedSetting) {
      this.selectedConfig = false;
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
