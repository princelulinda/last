import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  ClientService,
  ConfigService,
  DialogService,
} from '../../../core/services';
import { CommonModule } from '@angular/common';
import { LookupComponent } from '../../../global/components/lookups/lookup/lookup.component';
import {
  ClientCorporateModel,
  ClientWorkstationModel,
  IndividualClientModel,
  ResponseDataAfterUpdate,
} from '../client.model';
import { ModeModel } from '../../../core/services/config/main-config.models';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';
import { AutocompleteModel } from '../../../global/models/global.models';

@Component({
  selector: 'app-client-sensitive-info',
  standalone: true,
  imports: [CommonModule, LookupComponent],
  templateUrl: './client-sensitive-info.component.html',
  styleUrl: './client-sensitive-info.component.scss',
})
export class ClientSensitiveInfoComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  @Input() clientId!: string | number;
  @Input() clientIndiv!: IndividualClientModel | null;
  @Input() clientEntreprise!: ClientCorporateModel | null;
  @Input() selectedClient!: ClientWorkstationModel;
  @Output() refreshUpdates = new EventEmitter<string>();

  theme!: ModeModel;
  dialog!: DialogResponseModel;
  dialog$: Observable<DialogResponseModel>;
  theme$: Observable<ModeModel>;
  selectedSectorId!: AutocompleteModel | null;
  selectedCategoryId!: AutocompleteModel | null;
  selectClient: ClientWorkstationModel | null = null;

  @Input() isSensitiveInfoFormShown = false;
  @Input() selectedSensitiveInfo = false;

  loadingCategory = false;
  loadingSector = false;

  constructor(
    private clientService: ClientService,
    private dialogService: DialogService,
    private configService: ConfigService
  ) {
    this.theme$ = this.configService.getMode();
    this.dialog$ = this.dialogService.getDialogState();
  }

  ngOnInit(): void {
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: theme => {
        this.theme = theme;
      },
    });
    this.dialog$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: dialog => {
        if (dialog) {
          this.dialog = dialog;
          if (this.dialog && this.dialog.response) {
            if (
              this.dialog.response.pin &&
              this.dialog.action === 'confirm category modification'
            ) {
              this.modifyCategoryCorporate();
            } else if (
              this.dialog.response.pin &&
              this.dialog.action === 'confirm activity sector modification'
            ) {
              this.modifySectorCorporate();
            }
          }
        }
      },
    });
  }
  modifyCategoryCorporate() {
    this.loadingCategory = true;

    const data = {
      client_category: (this.selectedCategoryId as AutocompleteModel).id,
    };

    this.dialogService.dispatchLoading();
    this.clientService
      .modifyCategoryCorporate(
        this.clientId as string,
        (this.selectedCategoryId as AutocompleteModel).id,
        data
      )
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          const res = response as { object: ResponseDataAfterUpdate };
          if (response || res.object.success === true) {
            this.dialogService.closeLoading();
            this.loadingCategory = false;
            this.dialogService.openToast({
              title: '',
              type: 'success',
              message: res?.object?.response_message ?? 'Successfully done',
            });
            this.refreshUpdates.emit('updated');
          } else if (res.object.success === false) {
            this.dialogService.closeLoading();
            this.loadingCategory = false;
            this.dialogService.openToast({
              title: '',
              type: 'failed',
              message: res?.object?.response_message ?? 'Failed',
            });
          }
        },
        error: msg => {
          this.dialogService.closeLoading();
          this.loadingCategory = false;
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
  modifySectorCorporate() {
    this.loadingSector = true;

    const data = {
      activity_sector: (this.selectedSectorId as AutocompleteModel).id,
    };
    this.dialogService.dispatchLoading();

    this.clientService
      .modifySectorCorporate(
        this.clientId as string,
        (this.selectedSectorId as AutocompleteModel).id,
        data
      )

      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          const res = response as { object: ResponseDataAfterUpdate };
          if (response || res.object.success === true) {
            this.dialogService.closeLoading();
            this.loadingSector = false;
            this.dialogService.openToast({
              title: '',
              type: 'success',
              message: res?.object?.response_message ?? 'Successfully done',
            });
            this.refreshUpdates.emit('updated');
          } else if (res.object.success === false) {
            this.dialogService.closeLoading();
            this.loadingSector = false;
            this.dialogService.openToast({
              title: '',
              type: 'failed',
              message: res?.object?.response_message ?? 'Failed',
            });
          }
        },
        error: msg => {
          this.dialogService.closeLoading();
          this.loadingSector = false;
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
  enterPinSector() {
    this.dialogService.openDialog({
      title: 'confirm activity sector modification',
      type: 'pin',
      message: 'Please enter your pin to continue',
      action: 'confirm activity sector modification',
    });
  }
  enterPinCategory() {
    this.dialogService.openDialog({
      title: 'confirm category modification',
      type: 'pin',
      message: 'Please enter your pin to continue',
      action: 'confirm category modification',
    });
  }

  setSelectedSector(id: AutocompleteModel | null) {
    if (id) {
      this.selectedSectorId = id;
    } else {
      this.selectedSectorId = null;
    }
  }

  setSelectedCategory(id: AutocompleteModel | null) {
    if (id) {
      this.selectedCategoryId = id;
    } else {
      this.selectedCategoryId = null;
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
