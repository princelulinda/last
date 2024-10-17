import { Component, OnInit } from '@angular/core';
import { AccountDetailModel } from '../models';
import { ClientService } from '../../../core/services/client/client.service';
import { ActivatedRoute } from '@angular/router';
import { AmountVisibilityComponent } from '../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DialogService } from '../../../core/services';
import { StatementComponent } from '../../statements/statement/statement.component';
import { AdminBranchListComponent } from '../../admin/agence/admin-branch-list/admin-branch-list.component';
@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [
    AmountVisibilityComponent,
    CommonModule,
    StatementComponent,
    AdminBranchListComponent,
  ],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss',
})
export class AccountDetailsComponent implements OnInit {
  isLoading = false;
  account: AccountDetailModel | null = null;
  accountId = '';
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
        if (this.accountId) {
          this.getClientAccountDetails();
        }
      },
    });
    // this.getClientAccountDetails();
  }

  getClientAccountDetails() {
    this.isLoading = true;
    this.account = null;
    this.clientService
      .getClientAccountDetails(Number(this.accountId))
      .subscribe({
        next: (response: { object: AccountDetailModel }) => {
          this.account = response.object;
        },
      });
  }

  refresh() {
    this.account = null;

    this.isLoading = true;

    this.getClientAccountDetails();
  }
}
