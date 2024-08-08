import { Component, OnInit } from '@angular/core';
import { Accountdetail } from '../models';
import { ClientService } from '../../../core/services/client/client.service';
import { ActivatedRoute } from '@angular/router';
import { AmountVisibilityComponent } from '../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DialogService } from '../../../core/services';
@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [AmountVisibilityComponent, CommonModule],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss',
})
export class AccountDetailsComponent implements OnInit {
  isLoading = false;
  account: Accountdetail | null = null;
  accountId!: string;
  showAmounts = false; // Variable to store the visibility state of amounts
  showAmounts$: Observable<boolean>; // Observable for the visibility state
  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private dialogService: DialogService
  ) {
    this.showAmounts$ = this.dialogService.getAmountState();
  }
  ngOnInit(): void {
    this.showAmounts$.subscribe(state => {
      this.showAmounts = state;
    });

    this.route.params.subscribe({
      next: data => {
        this.accountId = data['accountId'];
        //console.log('iddddd',this.accountId)
        if (this.accountId) {
          this.getClientAccountDetails();
        }
      },
    });
    this.getClientAccountDetails();
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

  refresh() {
    this.account = null;

    this.isLoading = true;

    this.getClientAccountDetails();
  }
}
