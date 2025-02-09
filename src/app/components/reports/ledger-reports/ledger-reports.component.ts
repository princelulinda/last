import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { AmountVisibilityComponent } from '../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { AccountingService } from '../../../core/services/accounting/accounting.service';
import { LedgerReportsModel } from '../ledger-reports.model';

@Component({
  selector: 'app-ledger-reports',
  standalone: true,
  imports: [CommonModule, AmountVisibilityComponent, RouterLink],
  templateUrl: './ledger-reports.component.html',
  styleUrl: './ledger-reports.component.scss',
})
export class LedgerReportsComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();

  isParentCollapsed: Record<number, boolean> = {};
  isSubCollapsed: Record<number, boolean> = {};
  isSubSubCollapsed: Record<number, boolean> = {};

  balanceSheet!: LedgerReportsModel;
  isLoading = true;

  totalLeft = 0;
  totalRight = 0;

  selectedMenu = 'balance';

  isParentOpCollapsed: Record<number, boolean> = {};
  isSubOpCollapsed: Record<number, boolean> = {};
  isSubSubOpCollapsed: Record<number, boolean> = {};

  opResult!: LedgerReportsModel;
  isOpLoading = true;

  totalOpLeft = 0;
  totalOpRight = 0;

  constructor(
    private route: ActivatedRoute,
    private accountingService: AccountingService
  ) {
    this.isParentCollapsed[1] = false;
    this.isParentCollapsed[2] = false;
    this.isParentCollapsed[11] = false;
    this.isSubCollapsed[12] = false;
    this.isSubCollapsed[13] = false;
    this.isSubCollapsed[22] = false;
    this.isSubSubCollapsed[121] = false;
    this.isSubSubCollapsed[131] = false;
    this.isSubSubCollapsed[221] = false;
  }

  ngOnInit() {
    this.getBalanceSheet();
    this.getOperationResult();

    if (this.route && this.route.fragment) {
      this.route.fragment.subscribe({
        next: fragment => {
          switch (fragment) {
            case 'operation':
              this.selectedMenu = 'operation';
              break;

            case null:
            default:
              this.selectedMenu = 'balance';
              break;
          }
        },
      });
    }
  }

  getBalanceSheet() {
    this.accountingService
      .getLedgerReport('balance-sheet')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.balanceSheet = data.object;
          this.isLoading = false;
          this.calculateTotal();
        },

        error: err => {
          this.isLoading = false;
          return err;
        },
      });
  }

  getOperationResult() {
    this.accountingService
      .getLedgerReport('operating-result')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.isOpLoading = false;
          this.opResult = data.object;
          this.calculateOpTotal();
        },
        error: () => {
          this.isOpLoading = false;
        },
      });
  }

  calculateTotal() {
    this.balanceSheet.response_data.left_hand.forEach(actif => {
      const num = Number(actif.total);
      this.totalLeft += num;
    });

    this.balanceSheet.response_data.right_hand.forEach(passif => {
      const num = Number(passif.total);
      this.totalRight += num;
    });
  }

  toggleParentCollapse(collapseId: number) {
    this.isParentCollapsed[collapseId] = !this.isParentCollapsed[collapseId];

    Object.keys(this.isParentCollapsed).forEach(key => {
      if (+key !== collapseId) {
        this.isParentCollapsed[+key] = false;
      }
    });

    this.isSubCollapsed = {};
    this.isSubSubCollapsed = {};
  }

  toggleSubCollapse(collapseId: number) {
    this.isSubCollapsed[collapseId] = !this.isSubCollapsed[collapseId];

    Object.keys(this.isSubCollapsed).forEach(key => {
      if (+key !== collapseId) {
        this.isSubCollapsed[+key] = false;
      }
    });

    this.isSubSubCollapsed = {};
  }

  toggleSubSubCollapse(collapseId: number) {
    this.isSubSubCollapsed[collapseId] = !this.isSubSubCollapsed[collapseId];

    Object.keys(this.isSubSubCollapsed).forEach(key => {
      if (+key !== collapseId) {
        this.isSubSubCollapsed[+key] = false;
      }
    });
  }

  calculateOpTotal() {
    this.opResult.response_data.left_hand.forEach(actif => {
      const num = Number(actif.total);
      this.totalOpLeft += num;
    });

    this.opResult.response_data.right_hand.forEach(passif => {
      const num = Number(passif.total);
      this.totalOpRight += num;
    });
  }

  toggleOpParentCollapse(collapseId: number) {
    this.isParentOpCollapsed[collapseId] =
      !this.isParentOpCollapsed[collapseId];

    Object.keys(this.isParentOpCollapsed).forEach(key => {
      if (+key !== collapseId) {
        this.isParentOpCollapsed[+key] = false;
      }
    });

    this.isSubOpCollapsed = {};
    this.isSubSubOpCollapsed = {};
  }

  toggleOpSubCollapse(collapseId: number) {
    this.isSubOpCollapsed[collapseId] = !this.isSubOpCollapsed[collapseId];

    Object.keys(this.isSubOpCollapsed).forEach(key => {
      if (+key !== collapseId) {
        this.isSubOpCollapsed[+key] = false;
      }
    });

    this.isSubSubOpCollapsed = {};
  }

  toggleOpSubSubCollapse(collapseId: number) {
    this.isSubSubOpCollapsed[collapseId] =
      !this.isSubSubOpCollapsed[collapseId];

    Object.keys(this.isSubSubOpCollapsed).forEach(key => {
      if (+key !== collapseId) {
        this.isSubSubOpCollapsed[+key] = false;
      }
    });
  }
}
