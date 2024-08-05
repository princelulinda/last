import { Component, OnInit } from '@angular/core';
import { Accountdetail } from '../../wallet/wallet.models';
import { ClientService } from '../../../core/services/client/client.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss',
})
export class AccountDetailsComponent implements OnInit {
  isLoading = false;
  account: Accountdetail | null = null;
  accountId!: string;
  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe({
      next: data => {
        this.accountId = data['walletId'];
        if (this.accountId) {
          this.getClientAccountDetails();
        }
      },
    });
  }

  getClientAccountDetails() {
    this.isLoading = true;
    this.account = null;
    this.clientService.getClientAccountDetails(this.accountId).subscribe({
      next: (response: { object: Accountdetail }) => {
        this.account = response.object;
        console.log('Données de tontine:', this.account);
      },
      error: (error: Error) =>
        console.error('Erreur lors de la récupération des tontines:', error),
    });
  }
}
