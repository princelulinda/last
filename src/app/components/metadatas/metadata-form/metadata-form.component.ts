import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
  HostListener,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  charfield = [{ name: 'Maxlength', value: 'max_length' }];
  decimalfield = [
    { name: 'Maxdigits', value: 'max_digits', disabled: false },
    { name: 'Decimal places', value: 'decimal_places', disabled: false },
  ];
  FK = [{ name: 'Model', value: 'model' }];
  metaForm = new FormGroup({
    field_title: new FormControl('', Validators.required),
    field_name: new FormControl('', Validators.required),
    field_type: new FormControl('', Validators.required),
    type: new FormControl(this.metaTypes[0]),
    required: new FormControl(false),
  });
  attributesForm = new FormGroup({
    keyValue: new FormControl(''),
    value: new FormControl(''),
  });
  plateform$!: Observable<activeMainConfigModel>;
  plateform = '';
  keyValues: {
    key: string | null | undefined;
    value: string | number | null | undefined;
  }[] = [];
  selectedDecimalOptions = new Set<string | null | undefined>();
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
    this.metaForm
      .get('field_type')
      ?.valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.attributesForm.reset();
      });
  }
  createMetadata() {
    this.isLoading = true;
    const meta: WidgetAttrsModel = {};

    meta[`${this.attributesForm.value.keyValue}`] =
      this.attributesForm.value.value;
    meta['required'] = this.metaForm.value.required;
    const body: MetadataBodyModel = {
      name: this.metaForm.value.field_title,
      field_name: this.metaForm.value.field_name,
      meta_type: this.metaForm.value.field_type,
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
                'Failed, please try again ',
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
                'Metadata created successfully !',
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
              'Something went wrong please retry again ',
          });
        },
      });
  }
  deleteFields(index: number) {
    this.keyValues.splice(index, 1);
  }

  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent) {
    if (
      (this.metaForm.value.field_type &&
        ['CharField', 'ForeignKey', 'ChoiceField'].includes(
          this.metaForm.value.field_type
        ) &&
        (!this.attributesForm.value.keyValue ||
          !this.attributesForm.value.value)) ||
      (this.metaForm.value.field_type === 'DecimalField' &&
        this.getRemainingDecimalFields() === 0)
    ) {
      this.createMetadata();
    }

    console.log(event);
  }
  addFields() {
    const key = this.attributesForm.value.keyValue;
    const value = this.attributesForm.value.value;

    if (key && value) {
      this.keyValues.push({ key, value });

      this.decimalfield = this.decimalfield.map(option => {
        return option.value === key ? { ...option, disabled: true } : option;
      });

      this.attributesForm.reset();
    }
  }
  getRemainingDecimalFields(): number {
    return this.decimalfield.filter(option => !option.disabled).length;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
