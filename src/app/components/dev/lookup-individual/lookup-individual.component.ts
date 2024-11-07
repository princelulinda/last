import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  ClientInfoModel,
  SignatureModel,
} from '../../../global/components/lookups/lookup/lookup.model';
import {
  ClientService,
  ConfigService,
  DialogService,
} from '../../../core/services';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';
import { OrganizationModel } from '../../auth/auth.model';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';

@Component({
  selector: 'app-lookup-individual',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, ReactiveFormsModule],
  templateUrl: './lookup-individual.component.html',
  styleUrl: './lookup-individual.component.scss',
})
export class LookupIndividualComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  @Input() bankId = '';
  @Input() menuSelected = '';
  @Input() cardBackground = 'level-2';
  @Input() close_option = false;
  @Output() individualInfo = new EventEmitter<ClientInfoModel>();
  @Output() closeInfo = new EventEmitter<boolean>();
  closing = true;

  searchForm: FormGroup;

  dialog$!: Observable<DialogResponseModel>;
  // dialog: string = '';

  clientId!: ClientInfoModel | null | undefined;
  clientLookUp!: string;
  placeholder = 'Search Client';
  client_id!: string;

  dataCheck = false;
  signatureDisplay = true;
  signature!: SignatureModel['object'];
  signatureloader = false;
  organizationId: number | undefined;
  organization$!: Observable<OrganizationModel | null>;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private dialogService: DialogService,
    private configService: ConfigService
  ) {
    this.dialog$ = this.dialogService.getDialogState();
    this.searchForm = this.fb.group({
      clientId: [''],
    });

    this.organization$ = this.configService.getSelectedOrganization();
  }
  ngOnInit(): void {
    this.organization$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((organization: OrganizationModel | null) => {
        this.organizationId = organization?.id;
      });
    if (this.menuSelected === 'merchant_code') {
      this.placeholder = 'Merchant Code';
    } else if (this.menuSelected !== 'merchant_code') {
      this.placeholder = 'Search Client';
    }
  }

  getClientSignatures() {
    this.clientService
      .getIndividualClientDetails(this.client_id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (signature: SignatureModel) => {
          this.signature = signature.object;
          this.signatureloader = false;
        },
        error: data => {
          this.signatureloader = false;
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message:
              data.object.detail ??
              'Error occured when displaying signature information',
          });
        },
      });
  }
  getCorporateSignatures() {
    this.clientService
      .getCorporateClientDetails(this.client_id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (signature: SignatureModel) => {
          this.signature = signature.object;
          this.signatureloader = false;
        },
        error: data => {
          this.signatureloader = false;
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message:
              data.object.detail ??
              'Error occured when displaying signature information',
          });
        },
      });
  }
  getClientInfo() {
    const clientId = this.searchForm.value.clientId;
    let organizationId;
    if (this.bankId !== '') {
      organizationId = this.bankId;
    } else if (this.bankId === '') {
      organizationId = this.organizationId;
    }
    if (this.menuSelected === 'merchant_code') {
      this.clientLookUp =
        'organization_pk=' +
        organizationId +
        '&account_id=' +
        clientId +
        '&account_type=merchant';
    } else {
      this.clientLookUp =
        'organization_pk=' + organizationId + '&account_id=' + clientId;
    }
    this.dataCheck = true;
    this.searchForm.disable();
    this.clientService
      .client(this.clientLookUp)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (clientId: { object: ClientInfoModel }) => {
          this.dataCheck = false;
          this.closing = false;
          this.searchForm.reset();
          this.searchForm.enable();
          this.clientId = clientId.object;
          this.client_id = this.clientId.acc_client_id;
          this.individualInfo.emit(this.clientId);
          if (this.clientId.acc_client_type === 'I') {
            this.signatureloader = true;
            this.getClientSignatures();
          }

          if (this.clientId.acc_status.reason === '') {
            console.log('Client ID is not', this.clientId.acc_status.reason);
          }
        },
        error: data => {
          this.dataCheck = false;
          this.searchForm.enable();
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: data.object.response_message ?? 'Error occured',
          });
        },
      });
  }

  showSignatures() {
    this.signatureDisplay = false;
  }
  closeInformation() {
    this.closing = true;
    this.closeInfo.emit(this.closing);
    this.clientId = null;
    this.signatureDisplay = true;
    this.signature.signature = '';
    this.signature.signature2 = '';
    if (!this.clientId) {
      this.individualInfo.emit(undefined);
    }
  }
  hideSignatures() {
    this.signatureDisplay = true;
  }
}
