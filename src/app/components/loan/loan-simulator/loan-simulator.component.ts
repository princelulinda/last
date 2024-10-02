import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
// import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { LoanService } from '../../../core/services/loan/loan.service';
import { SimulationResModel } from '../loan.models';
import { DialogService } from '../../../core/services';
import { RouterLink } from '@angular/router';
import { AmountVisibilityComponent } from '../../../global/components/custom-field/amount-visibility/amount-visibility.component';

@Component({
  selector: 'app-loan-simulator',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    AmountVisibilityComponent,
  ],
  templateUrl: './loan-simulator.component.html',
  styleUrl: './loan-simulator.component.scss',
})
export class LoanSimulatorComponent implements OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  simulationForm: FormGroup;
  isLoading = false;
  simulationResult: SimulationResModel | null = null;
  showResults = false;

  constructor(
    private _location: Location,
    private loanService: LoanService,
    // private router: Router,
    private dialogService: DialogService
  ) {
    this.simulationForm = new FormGroup({
      payment_number: new FormControl<string>('', Validators.required),
      amount: new FormControl<string>('', Validators.required),
      mode: new FormControl<string>('', Validators.required),
      interest_rate: new FormControl<string>('', Validators.required),
      period: new FormControl<string>('', Validators.required),
    });
  }

  // ngOnInit() {}

  simulateLoan() {
    this.isLoading = true;
    const formValue = this.simulationForm.value;
    formValue.amount = parseFloat(formValue.amount);
    formValue.period = parseInt(formValue.period);
    formValue.interest_rate = parseInt(formValue.interest_rate);

    this.loanService
      .simulateLoan(formValue)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          const res = data;
          if (res.object.success === true) {
            this.dialogService.openToast({
              title: '',
              type: 'success',
              message: res.object.response_message,
            });
            this.simulationResult = res.object.response_data;
            this.showResults = true;
          } else if (res.object.success === false) {
            this.dialogService.openToast({
              title: '',
              type: 'failed',
              message: res.object.response_message,
            });
          }
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.dialogService.openToast({
            title: 'failure',
            type: 'failed',
            message: 'Failed to simulate a loan',
          });
        },
      });
  }

  goBack() {
    this._location.back();
  }

  newSimulation() {
    this.showResults = false;
    this.simulationResult = null;
    this.simulationForm.reset();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
