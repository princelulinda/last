import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  ConfigService,
  DialogService,
  GeneralService,
} from '../../../core/services';
import { activeMainConfigModel } from '../../../core/services/config/main-config.models';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';
import {
  MetadataBodyModel,
  MetadataModel,
  WidgetAttrsModel,
} from '../metadata.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metadata-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './metadata-form.component.html',
  styleUrl: './metadata-form.component.scss',
})
export class MetadataFormComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  @Input() metadata!: MetadataModel;
  @Input() selectedMenu = '';
  @Output() refreshUpdates = new EventEmitter<string>();
  dialog$: Observable<DialogResponseModel>;

  isLoading = false;
  loadingData = true;
  metaTypes = [
    { name: 'CharField', value: 'CHARFIELD' },
    { name: 'DecimalField', value: 'DECIMALFIELD' },
    { name: 'IntegerField', value: 'INTEGERFIELD' },
    { name: 'DateField', value: 'DATEFIELD' },
    { name: 'DateTimeField', value: 'DATETIMEFIELD' },
    { name: 'ForeignKey', value: 'FK' },
    { name: 'JSONField', value: 'JSON' },
    { name: 'ChoiceField', value: 'CHOICEFIELD' },
  ];
  charfield = [{ name: 'Maxlength', value: 'max-length' }];
  decimalfield = [
    { name: 'Maxdigits', value: 'max-digits' },
    { name: 'Decimal places', value: 'decimal-places' },
    { name: 'Minimum', value: 'min' },
    { name: 'Maximum', value: 'max' },
  ];
  FK = [{ name: 'Model', value: 'model' }];
  metaForm = new FormGroup({
    field_title: new FormControl(''),
    field_name: new FormControl(''),
    field_type: new FormControl(''),
    type: new FormControl(this.metaTypes[0]),
    searchable: new FormControl(false),
  });
  attributesForm = new FormGroup({
    keyValue: new FormControl(''),
    value: new FormControl(''),
  });
  plateform$!: Observable<activeMainConfigModel>;
  plateform = '';
  keyValues: {
    key: string | null | undefined;
    value: string | null | undefined;
  }[] = [];

  constructor(
    private generalService: GeneralService,
    private configService: ConfigService,
    private dialogService: DialogService
  ) {
    this.plateform$ = this.configService.getMainConfig();
    this.dialog$ = this.dialogService.getDialogState();
  }
  ngOnInit(): void {
    this.plateform$.subscribe(plateform => {
      this.plateform = plateform.activePlateform;
    });
  }
  createMetadata() {
    this.isLoading = true;
    const meta: WidgetAttrsModel = {};
    meta[`${this.attributesForm.value.keyValue}`] =
      this.attributesForm.value.value;

    const body: MetadataBodyModel = {
      name: this.metaForm.value.field_title,
      field_name: this.metaForm.value.field_title,
      field_type: this.metaForm.value.field_type,
      meta_type: this.metaForm.value.field_type,
      searchable: this.metaForm.value.searchable,
      widget_attrs: meta,
    };
    this.generalService
      .createMetadata(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (response: {
          object: { success: boolean; response_message: string };
        }) => {
          if (response.object.success === false) {
            this.isLoading = false;
            this.dialogService.openToast({
              type: 'failed',
              title: '',
              message:
                response?.object?.response_message ??
                $localize`Failed, please try again `,
            });
          } else {
            this.isLoading = false;
            this.attributesForm.reset();
            this.metaForm.reset();
            this.dialogService.openToast({
              type: 'success',
              title: '',
              message:
                response?.object?.response_message ??
                $localize`Metadata created successfully !`,
            });
            this.refreshUpdates.emit('success');
          }
        },
        error: (msg: { object: { response_message: string } }) => {
          this.isLoading = false;
          this.dialogService.openToast({
            type: 'failed',
            title: '',
            message:
              msg?.object?.response_message ??
              $localize`Something went wrong please retry again `,
          });
        },
      });
  }
  deleteFields(index: number) {
    this.keyValues.splice(index, 1);
  }

  addFields() {
    const object = {
      key: this.attributesForm.value.keyValue,
      value: this.attributesForm.value.value,
    };
    this.keyValues.push({
      key: this.attributesForm.value.keyValue,
      value: this.attributesForm.value.value,
    });
    this.attributesForm.reset();
    console.log(object);
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
