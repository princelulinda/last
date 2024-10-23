import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AccountingService } from '../../../../core/services/accounting/accounting.service';
import { Subject, takeUntil } from 'rxjs';
import { BalanceSheetModel } from '../accounting.model';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';

@Component({
  selector: 'app-balance-sheet',
  standalone: true,
  imports: [CommonModule, AmountVisibilityComponent],
  templateUrl: './balance-sheet.component.html',
  styleUrl: './balance-sheet.component.scss',
})
export class BalanceSheetComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();

  isParentCollapsed: Record<number, boolean> = {};
  isSubCollapsed: Record<number, boolean> = {};
  isSubSubCollapsed: Record<number, boolean> = {};

  balanceSheet!: BalanceSheetModel;
  isLoading = true;

  totalLeft = 0;
  totalRight = 0;

  constructor(private accountingService: AccountingService) {
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
    this.accountingService
      .getBalanceSheet()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.balanceSheet = data.object.response_data;
          this.isLoading = false;
          this.calculateTotal();
        },

        error: err => {
          this.isLoading = false;
          return err;
        },
      });
  }

  calculateTotal() {
    this.balanceSheet.left_hand.forEach(actif => {
      const num = Number(actif.total);
      this.totalLeft += num;
    });

    this.balanceSheet.right_hand.forEach(passif => {
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
}
