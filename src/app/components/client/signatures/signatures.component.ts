import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { PaginationConfig } from '../../../global/models/pagination.models';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ClientService,
  ConfigService,
  DialogService,
} from '../../../core/services';
import { ActivatedRoute } from '@angular/router';
import { ModeModel } from '../../../core/services/config/main-config.models';
import { CommonModule, NgClass } from '@angular/common';
import {
  ClientWorkstationModel,
  SignatoriesAccountsModel,
  SignatoriesConfigsModel,
  SignatoriesModel,
  SignatoryGroupsModel,
} from '../client.model';
import { ClientContactsComponent } from '../client-contacts/client-contacts.component';

@Component({
  selector: 'app-signatures',
  standalone: true,
  imports: [
    NgClass,
    CommonModule,
    ReactiveFormsModule,
    ClientContactsComponent,
  ],
  templateUrl: './signatures.component.html',
  styleUrl: './signatures.component.scss',
})
export class SignaturesComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  theme!: ModeModel;
  theme$: Observable<ModeModel>;

  error!: string;
  dragAreaClass!: string;
  draggedFiles!: File[];

  loader = false;

  clientId!: string;
  client!: ClientWorkstationModel;
  selectedSetting = 'signatures';
  selectedSection = 'signaturesList';
  selectedPersonalForm = false;
  selectedOtherInfoForm = false;
  pagination = new PaginationConfig();
  canMoveToPrev = false;
  canMoveToNext = true;
  currentPage = 0;
  count!: number;

  expandedSignatures = false;
  configForm = new FormGroup({
    minimum: new FormControl('', Validators.pattern('[0-9]*')),
    pvFile: new FormControl(''),
  });
  signatoryGroupForm = new FormGroup({
    signature_order: new FormControl('', Validators.pattern('[0-9]*')),
    name: new FormControl(''),
    description: new FormControl(''),
    exclusive: new FormControl(false),
  });
  isLoading = false;
  loading = false;
  signatoryConfig!: SignatoriesConfigsModel[] | null;
  signatoryConfigGroup!: SignatoryGroupsModel[] | null;
  isLoadingConfigs = false;
  selectedConfiguration!: number | boolean;
  signatories!: SignatoriesModel;
  signatoryAccounts!: SignatoriesAccountsModel;
  signatoryConfigDetails!: SignatoriesConfigsModel | null;
  success!: SignatoriesConfigsModel | null;
  toggleGroupForm = false;
  constructor(
    private clientService: ClientService,
    private configService: ConfigService,
    private dialogService: DialogService,
    private route: ActivatedRoute
  ) {
    this.theme$ = this.configService.getMode();
  }
  ngOnInit(): void {
    this.dragAreaClass = 'dragarea';

    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: theme => {
        this.theme = theme;
      },
    });

    if (this.route.params) {
      this.route.params.subscribe({
        next: data => {
          this.clientId = data['client_id'];

          this.getClientInfo();
        },
      });
    }

    this.pagination.filters.limit = 10;
    this.getSignatoryConfigurationsList();
    this.getSignatoryConfigurationsGroup();
    this.getSignatories();
    this.getSignatoryAccounts();
  }

  get minimumControl() {
    return this.configForm.get('minimum');
  }
  get signatureOrderControl() {
    return this.signatoryGroupForm.get('signature_order');
  }
  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    this.dragAreaClass = 'droparea';
    event.preventDefault();
  }
  @HostListener('dragenter', ['$event']) onDragEnter(event: DragEvent) {
    this.dragAreaClass = 'droparea';
    event.preventDefault();
  }
  @HostListener('dragend', ['$event']) onDragEnd(event: DragEvent) {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
  }
  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
  }
  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer && event.dataTransfer.files) {
      const files: FileList = event.dataTransfer.files;
      this.saveFiles(files);
    }
  }
  onFileChange(event: Event) {
    const files: FileList = (event.target as HTMLInputElement).files!;
    this.saveFiles(files);
  }

  saveFiles(files: FileList) {
    if (files.length > 1) this.error = 'Only one file at time allow';
    else {
      this.error = '';
      this.draggedFiles = Array.from(files);
    }
  }

  selectSection(section: string) {
    this.selectedSection = section;
  }

  selectSetting(setting: string) {
    this.selectedSetting = setting;
  }

  expandSignatures() {
    this.expandedSignatures = !this.expandedSignatures;
  }

  refresh() {
    this.signatoryConfig = null;
    this.getSignatoryConfigurationsList();
    if (this.selectedSection === 'configurations') {
      this.selectedSection = 'signaturesList';
    }
    if (this.selectedConfiguration) {
      this.selectedConfiguration = false;
    }
  }
  refreshConfigurationDetails() {
    this.signatoryConfigDetails = null;
    this.getSignatoryConfigurationsDetails();
  }

  addSignatoryConfiguration() {
    this.isLoading = true;
    const body = {
      minimum: this.configForm.value.minimum,
      client: this.clientId,
    };
    this.clientService
      .addSignatoryConfig(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.success = response;
          if (response) {
            this.isLoading = false;

            this.configForm.reset();

            this.dialogService.openToast({
              title: '',
              type: 'success',
              message: 'Successfully done',
            });
          }
        },

        error: msg => {
          this.isLoading = false;

          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message:
              msg?.object?.response_message ??
              'Something went wrong, please try again',
          });
        },
      });
  }

  getSignatoryConfigurationsList() {
    this.isLoadingConfigs = true;

    this.clientService
      .getSignaroryConfigList(this.pagination)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.signatoryConfig = data.objects;
          this.count = data.count;
          this.isLoadingConfigs = false;
        },
        error: error => {
          this.isLoadingConfigs = false;

          error = 'error, try again please';
          return error;
        },
      });
  }

  getSignatoryConfigurationsDetails() {
    this.clientService
      .getSignaroryConfigDetails(this.selectedConfiguration as number)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.signatoryConfigDetails = data.object;
        },
        error: error => {
          error = 'error, try again please';
          return error;
        },
      });
  }

  getSignatoryConfigurationsGroup() {
    this.clientService
      .getSignaroryConfigGroups()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.signatoryConfigGroup = data.objects;
        },
        error: error => {
          error = 'error, try again please';
          return error;
        },
      });
  }
  doListMove(action: string) {
    if (action === 'next') {
      this.currentPage += 1;
    } else {
      this.currentPage -= 1;
    }

    if (this.pagination.filters.limit) {
      this.pagination.filters.offset =
        this.pagination.filters.limit * this.currentPage;
      this.signatoryConfig = null;
      this.getSignatoryConfigurationsList();
    }
  }
  addGroup() {
    this.toggleGroupForm = !this.toggleGroupForm;
  }
  getSignatories() {
    this.clientService
      .getSignarories()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.signatories = data.object;
        },
        error: error => {
          error = 'error, try again please';
          return error;
        },
      });
  }
  getSignatoryAccounts() {
    this.clientService
      .getSignaroriesAccounts()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.signatoryAccounts = data.object;
        },
        error: error => {
          error = 'error, try again please';
          return error;
        },
      });
  }

  selectConfiguration(configId: number) {
    this.selectedConfiguration = configId;
    this.signatoryConfigDetails = null;
    this.getSignatoryConfigurationsDetails();
  }

  addSignatoryGroup() {
    this.loading = true;
    const body = {
      signature_order: this.signatoryGroupForm.value.signature_order,
      name: this.signatoryGroupForm.value.name,
      signatories_config: this?.selectedConfiguration,
      description: this.signatoryGroupForm.value.description,
      exclusive: this.signatoryGroupForm?.value?.exclusive,
    };
    this.clientService
      .addSignatoryGroups(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          if (response) {
            this.loading = false;
            this.signatoryGroupForm.reset();
            this.success = null;
            this.signatoryConfigDetails = null;
            this.getSignatoryConfigurationsDetails();
            this.toggleGroupForm = false;
            this.signatoryConfigGroup = null;
            this.dialogService.openToast({
              title: '',
              type: 'success',
              message: 'Successfully done',
            });
          }
        },

        error: msg => {
          this.loading = false;

          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message:
              msg?.object?.response_message ??
              'Something went wrong, please try again',
          });
        },
      });
  }

  getClientInfo() {
    this.clientService
      .getClientDetails(this.clientId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: client => {
          this.client = client.object;
        },
        error: error => {
          error = 'error, try again please';
          return error;
        },
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
