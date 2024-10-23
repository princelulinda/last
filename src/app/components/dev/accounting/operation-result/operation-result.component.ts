import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { Subject, takeUntil } from 'rxjs';
import { AccountingService } from '../../../../core/services/accounting/accounting.service';
import { BalanceSheetModel } from '../accounting.model';

@Component({
  selector: 'app-operation-result',
  standalone: true,
  imports: [CommonModule, AmountVisibilityComponent],
  templateUrl: './operation-result.component.html',
  styleUrl: './operation-result.component.scss',
})
export class OperationResultComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();

  isParentCollapsed: Record<number, boolean> = {};
  isSubCollapsed: Record<number, boolean> = {};
  isSubSubCollapsed: Record<number, boolean> = {};

  opResult!: BalanceSheetModel;
  isLoading = true;

  totalLeft = 0;
  totalRight = 0;

  constructor(private accountingService: AccountingService) {}

  ngOnInit() {
    this.accountingService
      .getOperatingResult()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.isLoading = false;
          this.opResult = data.object.response_data;
          this.calculateTotal();
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  calculateTotal() {
    this.opResult.left_hand.forEach(actif => {
      const num = Number(actif.total);
      this.totalLeft += num;
    });

    this.opResult.right_hand.forEach(passif => {
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
