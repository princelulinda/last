import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrganizationModel } from '../../auth/auth.model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ConfigService, DialogService } from '../../../core/services';
import { LookupComponent } from '../../../global/components/lookups/lookup/lookup.component';
import { AutocompleteModel } from '../../../global/models/global.models';
import { CommonModule } from '@angular/common';
import { CounterService } from '../../../core/services/counter/counter.service';
import { TransactionResModel } from './diverse-operation.model';

@Component({
  selector: 'app-diverse-operation',
  standalone: true,
  imports: [LookupComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './diverse-operation.component.html',
  styleUrl: './diverse-operation.component.scss',
})
export class DiverseOperationComponent {
  private onDestroy$: Subject<void> = new Subject<void>();

  password = new FormControl('', [Validators.required]);
  // description = new FormControl('');
  one = new FormControl(0);
  two = new FormControl(0);
  three = new FormControl(0);
  four = new FormControl(0);
  five = new FormControl(0);
  six = new FormControl(0);

  resOne = 0;
  resTwo = 0;
  resThree = 0;
  resFour = 0;
  resFive = 0;
  resSix = 0;
  totalSum = 0;

  operation!: string | null;
  descriptionForm: FormGroup;
  operationPerformed!: TransactionResModel;
  operationSuccess!: boolean;

  tellerSender: AutocompleteModel | null = null;
  tellerReceiver: AutocompleteModel | null = null;
  sender: AutocompleteModel | null = null;
  receiver: AutocompleteModel | null = null;

  organization$: Observable<OrganizationModel | null>;
  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private dialogService: DialogService,
    private counterService: CounterService
  ) {
    this.organization$ = this.configService.getSelectedOrganization();
    this.descriptionForm = this.fb.group({
      description: ['', Validators.required],
      external_reference: ['', Validators.required],
    });

    this.one.valueChanges.subscribe(() => {
      if (this.one.value && this.one.value > 0) {
        this.resOne = this.one.value * 100;
      } else {
        this.resOne = 0;
      }
      this.calculateSum();
    });

    this.two.valueChanges.subscribe(() => {
      if (this.two.value && this.two.value > 0) {
        this.resTwo = this.two.value * 500;
      } else {
        this.resTwo = 0;
      }
      this.calculateSum();
    });

    this.three.valueChanges.subscribe(() => {
      if (this.three.value && this.three.value > 0) {
        this.resThree = this.three.value * 1000;
      } else {
        this.resThree = 0;
      }
      this.calculateSum();
    });

    this.four.valueChanges.subscribe(() => {
      if (this.four.value && this.four.value > 0) {
        this.resFour = this.four.value * 2000;
      } else {
        this.resFour = 0;
      }
      this.calculateSum();
    });

    this.five.valueChanges.subscribe(() => {
      if (this.five.value && this.five.value > 0) {
        this.resFive = this.five.value * 5000;
      } else {
        this.resFive = 0;
      }
      this.calculateSum();
    });

    this.six.valueChanges.subscribe(() => {
      if (this.six.value && this.six.value > 0) {
        this.resSix = this.six.value * 10000;
      } else {
        this.resSix = 0;
      }
      this.calculateSum();
    });
  }

  calculateSum() {
    this.totalSum =
      this.resOne +
      this.resTwo +
      this.resThree +
      this.resFour +
      this.resFive +
      this.resSix;
  }

  selectOperation(operation: string | null) {
    this.operation = operation;
    this.descriptionForm.reset();
  }

  getTellerSender(teller: AutocompleteModel | null) {
    this.descriptionForm.reset();
    this.tellerSender = teller;
    this.sender = teller;
  }

  getTellerReceiver(teller: AutocompleteModel | null) {
    this.descriptionForm.reset();
    this.tellerReceiver = teller;
    this.receiver = teller;
  }

  returnPage() {
    this.operation = null;
    // this.account = null;
    this.tellerReceiver = null;
    this.tellerSender = null;
    // this.ledger = null;
  }

  goBack() {
    if (this.operation === 'Treasure Movement') {
      this.operation = null;
      // if (this.optionSelected && !this.ledger) {
      //   this.operation = null;
      //   this.descriptionForm.reset();
      // } else if (this.ledger && !this.account) {
      //   this.ledger = null;
      //   this.descriptionForm.reset();
      // } else if (this.account) {
      //   this.account = null;
      //   this.descriptionForm.reset();
      // }
    } else if (this.operation === 'Box Transfer') {
      if (!this.sender && !this.receiver) {
        this.operation = null;
        this.descriptionForm.reset();
      } else if (this.sender && !this.receiver) {
        this.sender = null;
        this.tellerSender = null;
        this.descriptionForm.reset();
      } else if (this.receiver) {
        this.receiver = null;
        this.tellerReceiver = null;
        this.descriptionForm.reset();
      }
    } else if (this.operation === 'Transfer') {
      this.operation = null;
    } else if (this.operation === 'Transfer Movement') {
      this.operation = null;
    }
  }

  cancel() {
    this.operation = null;
    this.sender = null;
    this.tellerSender = null;
    this.receiver = null;
    this.tellerReceiver = null;
    this.descriptionForm.reset();
  }

  isFormValid(): boolean {
    return this.descriptionForm.valid && this.password.valid;
  }

  sendToTeller() {
    const trans = {
      password: this.password.value || '',
      teller: this.tellerSender!.id,
      teller_destination: this.tellerReceiver!.id,
      description: this.descriptionForm.value.description,
      notes: [
        {
          bank_note: 100,
          number: this.one.value || 0,
        },
        {
          bank_note: 500,
          number: this.two.value || 0,
        },
        {
          bank_note: 1000,
          number: this.three.value || 0,
        },
        {
          bank_note: 2000,
          number: this.four.value || 0,
        },
        {
          bank_note: 5000,
          number: this.five.value || 0,
        },
        {
          bank_note: 10000,
          number: this.six.value || 0,
        },
      ],
    };

    this.dialogService.dispatchLoading();
    this.descriptionForm.disable();
    this.counterService
      .sendToTeller(trans)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: operation => {
          console.log('))))))))))))))))))))))))))))))Operation:', operation);
          this.descriptionForm.enable();
          this.dialogService.closeLoading();
          this.operationPerformed = operation.object;
          this.operationSuccess = this.operationPerformed.success;
          if (this.operationSuccess) {
            this.dialogService.openToast({
              title: '',
              type: 'success',
              message: this.operationPerformed.response_message,
            });
            this.tellerReceiver = null;
            this.tellerSender = null;
          } else {
            this.dialogService.openToast({
              title: '',
              type: 'failed',
              message: this.operationPerformed.response_message,
            });
          }
        },

        error: error => {
          this.dialogService.closeLoading();
          this.descriptionForm.enable();
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'Something went wrong, please retry again',
          });
          console.error('Error:', error);
        },
      });
  }
}
