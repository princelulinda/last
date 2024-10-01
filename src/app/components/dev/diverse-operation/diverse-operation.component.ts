import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationModel } from '../../auth/auth.model';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../core/services';
import { LookupComponent } from '../../../global/components/lookups/lookup/lookup.component';
import { ItemModel } from '../../../global/components/lookups/lookup/lookup.model';

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

  tellerSender!: ItemModel | null;
  sender!: ItemModel | null;

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
    // this.descriptionForm.reset();
  }

  getTellerSender(teller: ItemModel | null) {
    this.descriptionForm.reset();
    this.tellerSender = teller;
    this.sender = teller;
  }
}
