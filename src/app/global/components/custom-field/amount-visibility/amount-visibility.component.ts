import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { DialogService } from '../../../../core/services';
import { CurrencyModel } from '../../../models/global.models';

@Component({
  selector: 'app-amount-visibility',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './amount-visibility.component.html',
  styleUrl: './amount-visibility.component.scss',
})
export class AmountVisibilityComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>(); // Subject to trigger the component destruction

  @Input({ required: true }) amount: number | string = ''; // Input property to receive the amount value
  @Input({ required: true }) currency: CurrencyModel = 'BIF'; // Input property to receive the currency value
  @Input() customClasses = ''; // Input property to receive custom CSS classes

  showAmounts = false; // Variable to store the visibility state of amounts
  @Input() alwaysShowAmount = false;
  showAmounts$: Observable<boolean>; // Observable for the visibility state

  constructor(private dialogService: DialogService) {
    this.showAmounts$ = this.dialogService.getAmountState();
  }

  ngOnInit() {
    if (!this.alwaysShowAmount) {
      this.showAmounts$.subscribe(state => {
        this.showAmounts = state;
      });
    } else {
      this.showAmounts = true;
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(); // Emit the next value to trigger the component destruction
    this.onDestroy$.complete(); // Complete the subject to clean up resources
  }
}
