import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ClientWorkstationModel } from '../client.model';

@Component({
  selector: 'app-selected-client-small-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selected-client-small-overview.component.html',
  styleUrl: './selected-client-small-overview.component.scss',
})
export class SelectedClientSmallOverviewComponent implements OnDestroy, OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  clientId!: number;

  @Input() selectedClient!: ClientWorkstationModel;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
