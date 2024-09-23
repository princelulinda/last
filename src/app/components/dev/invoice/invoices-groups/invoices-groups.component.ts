import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { DialogService, MerchantService } from '../../../../core/services';
import { InvoiceGroupModel } from '../invoice.models';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { InvoicesByGroupComponent } from '../invoices-by-group/invoices-by-group.component';
import {
  EmptyStateComponent,
  EmptyStateModel,
} from '../../../../global/components/empty-states/empty-state/empty-state.component';

@Component({
  selector: 'app-invoices-groups',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SkeletonComponent,
    InvoicesByGroupComponent,
    EmptyStateComponent,
  ],
  templateUrl: './invoices-groups.component.html',
  styleUrl: './invoices-groups.component.scss',
})
export class InvoicesGroupsComponent implements OnInit {
  private OnDestroy$: Subject<void> = new Subject<void>();
  invoices_groups!: InvoiceGroupModel[] | null;
  isSelected_group = false;
  GroupInfo!: InvoiceGroupModel;
  invoices: [] | null = [];
  searchType: EmptyStateModel = 'product';
  ngOnInit() {
    this.getBillsGroup();
    this.router.navigate(['/m/mymarket/invoices-groups']);
  }
  constructor(
    private merchantService: MerchantService,
    private dialogService: DialogService,
    private router: Router
  ) {}
  getBillsGroup() {
    this.isSelected_group = false;
    this.invoices_groups = null;
    this.merchantService
      .getBillsGroups()
      .pipe(takeUntil(this.OnDestroy$))
      .subscribe({
        next: (response: { objects: InvoiceGroupModel[] }) => {
          this.invoices_groups = response.objects;
          this.GroupInfo = response.objects[0];
        },
        error: err => {
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: err.error.message ?? 'failed to get invoices groups',
          });
        },
      });
  }

  addingFragmentToInvoiceByGroup() {
    const fragment = 'group_name:' + this.GroupInfo.name;
    this.router.navigate(['/m/mymarket/invoices-groups'], {
      fragment: fragment.toString(),
    });
  }
  getBillsByGroup() {
    this.invoices = null;
    this.addingFragmentToInvoiceByGroup();
    this.isSelected_group = true;
    // this.merchantService.getBillsByGroup(this.GroupInfo.name).pipe(takeUntil(this.OnDestroy$)).subscribe({
    //   next: (response: any) => {
    //     this.invoices = response.objects
    //   }
    // })
  }

  getGoBackEvent(isSelected_group: boolean) {
    this.isSelected_group = isSelected_group;
    this.router.navigate(['/m/mymarket/invoices-groups']);
  }
}
