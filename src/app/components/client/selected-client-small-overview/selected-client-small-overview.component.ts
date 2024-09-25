import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ClientWorkstationModel } from '../client.model';

@Component({
  selector: 'app-selected-client-small-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selected-client-small-overview.component.html',
  styleUrl: './selected-client-small-overview.component.scss',
})
export class SelectedClientSmallOverviewComponent implements OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  clientId!: number;

  @Input() selectedClient!: ClientWorkstationModel | undefined;

  // constructor() {
  //     //comment
  // }

  // ngOnInit(): void {
  //     //comment
  // }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
