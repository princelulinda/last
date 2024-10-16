import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrganizationModel } from '../../auth/auth.model';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../core/services';
import { LookupComponent } from '../../../global/components/lookups/lookup/lookup.component';
import { AutocompleteModel } from '../../../global/models/global.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-diverse-operation',
  standalone: true,
  imports: [LookupComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './diverse-operation.component.html',
  styleUrl: './diverse-operation.component.scss',
})
export class DiverseOperationComponent {
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

  tellerSender: AutocompleteModel | null = null;
  tellerReceiver: AutocompleteModel | null = null;
  sender: AutocompleteModel | null = null;
  receiver: AutocompleteModel | null = null;

  organization$: Observable<OrganizationModel | null>;
  constructor(
    private fb: FormBuilder,
    private configService: ConfigService
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
}
