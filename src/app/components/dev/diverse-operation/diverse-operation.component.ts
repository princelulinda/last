import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationModel } from '../../auth/auth.model';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../core/services';
import { LookupComponent } from '../../../global/components/lookups/lookup/lookup.component';
import { AutocompleteModel } from '../../../global/models/global.models';

@Component({
  selector: 'app-diverse-operation',
  standalone: true,
  imports: [LookupComponent],
  templateUrl: './diverse-operation.component.html',
  styleUrl: './diverse-operation.component.scss',
})
export class DiverseOperationComponent {
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
    }
  }
}
