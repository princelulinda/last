import { Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
// import { LoanService } from '../../../core/services/loan/loan.service';
// import { Route } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-loan-simulator',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './loan-simulator.component.html',
  styleUrl: './loan-simulator.component.scss',
})
export class LoanSimulatorComponent implements OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  simulationForm: FormGroup;
  isLoading = false;
  // simulationResult: any;
  showResults = false;

  constructor(
    private _location: Location
    // private loanService: LoanService
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

    // this.loanService
    //   .simulateLoan(formValue)
    //   .pipe(takeUntil(this.onDestroy$))
    //   .subscribe({
    //     next: data => {
    //       console.log(formValue);
    //       console.log(
    //         'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSimulation Result : ',
    //         data
    //       );
    //     },
    //   });
  }

  goBack() {
    this._location.back();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
