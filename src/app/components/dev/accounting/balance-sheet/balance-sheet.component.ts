import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-balance-sheet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balance-sheet.component.html',
  styleUrl: './balance-sheet.component.scss',
})
export class BalanceSheetComponent {
  isParentCollapsed: Record<number, boolean> = {};
  isSubCollapsed: Record<number, boolean> = {};
  isSubSubCollapsed: Record<number, boolean> = {};

  constructor() {
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
