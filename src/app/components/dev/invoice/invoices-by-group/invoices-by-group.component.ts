import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import {
  EmptyStateComponent,
  EmptyStateModel,
} from '../../../../global/components/empty-states/empty-state/empty-state.component';

@Component({
  selector: 'app-invoices-by-group',
  standalone: true,
  imports: [RouterLink, SkeletonComponent, EmptyStateComponent],
  templateUrl: './invoices-by-group.component.html',
  styleUrl: './invoices-by-group.component.scss',
})
export class InvoicesByGroupComponent {
  @Input() group_name = '';
  @Input() teller_id!: number;
  @Input() invoices: [] | null = [];
  @Output() goBackEvent = new EventEmitter<boolean>();
  searchType: EmptyStateModel = 'product';

  goBack() {
    const isSelected_group = false;
    this.goBackEvent.emit(isSelected_group);
  }

  // constructor(
  //   private route: ActivatedRoute
  // ) {
  //   this.groupInfo = this.route.snapshot.data['GroupInfo'];
  // }

  // ngOnInit() {
  //   this.groupInfo
  //   console.log('the groupInfo value:', this.groupInfo)
  //   // this.groupInfo$ = this.route.paramMap.pipe(map(params => {
  //   //   const state = params.get('state');
  //   //   return new InvoiceGroupModel(state);
  //   // }

  //   // ));
  // }
}
