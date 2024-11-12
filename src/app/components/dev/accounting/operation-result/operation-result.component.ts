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

  isParentOpCollapsed: Record<number, boolean> = {};
  isSubOpCollapsed: Record<number, boolean> = {};
  isSubSubOpCollapsed: Record<number, boolean> = {};

  opResult!: BalanceSheetModel;
  isOpLoading = true;

  totalOpLeft = 0;
  totalOpRight = 0;

  constructor(private accountingService: AccountingService) {}

  ngOnInit() {
    this.accountingService
      .getOperatingResult()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.isOpLoading = false;
          this.opResult = data.object.response_data;
          this.calculateOpTotal();
        },
        error: () => {
          this.isOpLoading = false;
        },
      });
  }

  calculateOpTotal() {
    this.opResult.left_hand.forEach(actif => {
      const num = Number(actif.total);
      this.totalOpLeft += num;
    });

    this.opResult.right_hand.forEach(passif => {
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
