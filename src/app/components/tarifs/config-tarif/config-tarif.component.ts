import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ApiService,
  ConfigService,
  DialogService,
  TarifService,
} from '../../../core/services';
import {
  TarifFeesResonseModel,
  TarifTypeInfoModel,
  TarifTypeModel,
  AddTarifModel,
  AddFeesModel,
  FeesModel,
  ModifyFeesModel,
  DeleteFeesModel,
} from '../tarif.model';
import { Observable, Subject } from 'rxjs';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-config-tarif',
  standalone: true,
  imports: [ReactiveFormsModule, SkeletonComponent, NgClass],
  templateUrl: './config-tarif.component.html',
  styleUrl: './config-tarif.component.scss',
})
export class ConfigTarifComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  dialog$: Observable<DialogResponseModel>;
  isLoadingTarifType = false;
  isLoadingTariffFees = false;
  tarifType: TarifTypeModel[] | null = null;
  tarifTable!: string;
  feesData: TarifFeesResonseModel[] | null = null;

  TarifType = true;
  selectedTarif = false;
  addTarif = false;

  tarifDescription!: string;
  tarifTitle!: string;
  tariffName!: string;

  displayFormToAddFees = false;
  displayTarifConfiguration = false;
  tarif!: AddTarifModel;
  show = false;
  showF = false;
  selectedFeeId!: string;

  tatifType!: string;
  tarifName!: string;
  typeCode!: string;
  description!: string;

  tariffCreated = false;
  tarif_type = '';
  feeModificationLoader = false;
  feeDeletedLoader = false;

  boundss = [];
  fees!: ModifyFeesModel;
  minValue!: string;
  maxValue!: string;
  totalCommissions!: string;
  ihelaCommisiions!: string;
  agentCommisions!: string;
  clientCreationCommissions!: string;
  merchantCreationCommissions!: string;

  deleteFee!: DeleteFeesModel;
  idTarif = '';

  bank_id = '';
  feesToModifyForm!: FormGroup<{
    minValue: FormControl<string | null>;
    maxValue: FormControl<string | null>;
    totalCommissions: FormControl<string | null>;
    ihelaCommissions: FormControl<string | null>;
    agentCommisions: FormControl<string | null>;
    clientCreationCommissions: FormControl<string | null>;
    merchantCreationCommissions: FormControl<string | null>;
  }>;

  ngOnInit() {
    this.getTarifType();
    this.dialog$.subscribe({
      next: (status: DialogResponseModel) => {
        if (
          status.action === 'confirmation' &&
          status.response.confirmation === 'YES'
        ) {
          this.deleteFees();
        } else {
          this.selectedFeeId = '';
        }
      },
    });
  }
  constructor(
    private tarifService: TarifService,
    private apiService: ApiService,
    private configService: ConfigService,
    private dialogService: DialogService
  ) {
    this.dialog$ = this.dialogService.getDialogState();
  }

  getTarifType(): void {
    this.isLoadingTarifType = true;
    this.tarifService.getAllTarifType().subscribe({
      next: (data: { objects: TarifTypeModel[] }) => {
        this.tarifType = data.objects;
        this.isLoadingTarifType = false;
        console.log('liste des banks', this.tarifType);
      },
      error: error => {
        this.isLoadingTarifType = false;
        console.error('Erreur lors de la récupération des banques:', error);
      },
    });
  }

  getTarifFees(tarifId: string): void {
    if (tarifId) {
      const tarif_id = tarifId;
      this.tarifTable = tarifId;
      this.isLoadingTariffFees = true;
      this.tarifService.TarifFees(tarif_id).subscribe({
        next: (data: { objects: TarifFeesResonseModel[] }) => {
          this.isLoadingTariffFees = false;
          this.feesData = data.objects;
          console.log('Fees Data:', this.feesData);
        },
        error: error => {
          this.isLoadingTariffFees = false;
          console.error('Error retrieving fees data:', error);
        },
      });
    }
  }

  onClickTarifType(): void {
    this.TarifType = false;
    this.selectedTarif = true;
    this.addTarif = false;
    this.displayTarifConfiguration = false;
  }
  back(): void {
    this.TarifType = true;
    this.selectedTarif = false;
    this.addTarif = false;
    this.displayTarifConfiguration = false;
  }
  addTarifType(): void {
    this.TarifType = false;
    this.selectedTarif = false;
    this.addTarif = true;
    this.displayTarifConfiguration = false;
  }
  getTarifTypeInfo(tarif: TarifTypeInfoModel): void {
    this.tarifDescription = tarif.description;
    this.tarifTitle = tarif.type_type;
    this.tariffName = tarif.type_name;
  }
  onTarifConfigurationButton(): void {
    this.displayTarifConfiguration = true;
    this.TarifType = false;
    this.selectedTarif = false;
    this.addTarif = false;
  }
  addFeesForm(): void {
    this.displayFormToAddFees = !this.displayFormToAddFees;
  }

  showInput(fees: FeesModel) {
    this.show = true;
    this.selectedFeeId = fees.id;
    if (fees) {
      this.feesToModifyForm = new FormGroup({
        minValue: new FormControl(fees.amount_range.lower),
        maxValue: new FormControl(fees.amount_range.upper),
        totalCommissions: new FormControl(fees.total_commission),
        ihelaCommissions: new FormControl(fees.ihela_commission),
        agentCommisions: new FormControl(fees.agent_commission),
        clientCreationCommissions: new FormControl(
          fees.client_creation_commission
        ),
        merchantCreationCommissions: new FormControl(
          fees.merchant_creation_commission
        ),
      });
    }
    console.log('input1 :', fees);
  }

  showFees(id: string) {
    this.showF = true;
    this.show = false;
    this.selectedFeeId = id;
    console.log('this id : ', id);
  }
  tarifForm = new FormGroup({
    tatifType: new FormControl('', Validators.required),
    tarifName: new FormControl('', Validators.required),
    typeCode: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });
  addTariff() {
    this.dialogService.dispatchLoading();
    let tariffType;
    if (this.tariffType === 'Internal') {
      tariffType = 'I';
    } else if (this.tariffType === 'External') {
      tariffType = 'E';
    }
    const data = {
      type_type: tariffType,
      name: this.tarifForm.value.tarifName,
      type_code: this.tarifForm.value.typeCode,
      description: this.tarifForm.value.description,
    };
    this.tarifService.addTarif(data).subscribe({
      next: response => {
        this.tarif = response.object;
        this.tarif_type = this.tarif.id;
        this.tarifForm.reset();
        this.tariffType = '';
        this.tariffCreated = true;
        this.addTarifToTable();
        this.dialogService.closeLoading();
      },
      error: error => {
        this.dialogService.closeLoading();
        this.dialogService.openToast({
          type: 'failed',
          title: 'Échec',
          message:
            error?.object?.response_message ??
            $localize`Something went wrong please retry again !`,
        });
      },
    });
  }
  addTarifToTable() {
    const data = {
      tarif_type: this.tarif_type,
      bank: this.bank_id,
    };
    this.tarifService.addTarifToTable(data).subscribe({
      next: response => {
        this.tarif = response.object;
        this.dialogService.openToast({
          title: '',
          type: 'success',
          message: 'Tarif added Successfully',
        });
        this.TarifType = true;
        this.getTarifType();
      },
      error: error => {
        this.dialogService.openToast({
          type: 'failed',
          title: 'Échec',
          message:
            error?.object?.response_message ??
            $localize`Something went wrong please retry again !`,
        });
      },
    });
  }

  tariffType = '';
  getSelectedType(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.tariffType = selectElement.value;
  }
  // test(){
  // this.configService.getUserBanks();
  // }
  formToAddFees = new FormGroup({
    minValue: new FormControl('', Validators.required),
    maxValue: new FormControl('', Validators.required),
    totalCommissions: new FormControl('0'),
    totalCommissionsRate: new FormControl('0'),
    ihelaCommissions: new FormControl('0'),
    ihelaCommissionsRate: new FormControl('0'),
    agentCommisions: new FormControl('0'),
    agentCommisionsRate: new FormControl('0'),
    clientCreationCommissions: new FormControl('0'),
    clientCreationCommissionsRate: new FormControl('0'),
    merchantCreationCommissions: new FormControl('0'),
    merchantCreationCommissionsRate: new FormControl('0'),
  });

  addFees() {
    this.dialogService.dispatchLoading();
    const newFees = {
      tarif_table: this.tarifTable,
      amount_range: {
        lower: this.formToAddFees.value.minValue,
        upper: this.formToAddFees.value.maxValue,
        bounds: '[]',
      },
      commissions: this.formToAddFees.value.totalCommissions,
      commissions_rate: this.formToAddFees.value.totalCommissionsRate,
      ihela_cios: this.formToAddFees.value.ihelaCommissions,
      ihela_cios_rate: this.formToAddFees.value.ihelaCommissionsRate,
      agent_cios: this.formToAddFees.value.agentCommisions,
      agent_cios_rate: this.formToAddFees.value.agentCommisionsRate,
      client_creation_cios: this.formToAddFees.value.clientCreationCommissions,
      client_creation_cios_rate:
        this.formToAddFees.value.clientCreationCommissionsRate,
      merchant_creation_cios:
        this.formToAddFees.value.merchantCreationCommissions,
      merchant_creation_cios_rate:
        this.formToAddFees.value.merchantCreationCommissionsRate,
      agent_cios_rate_from_amount: false,
      from_partner: false,
      description: 'fees test',
    };

    this.tarifService.addFees(newFees).subscribe({
      next: (response: AddFeesModel) => {
        this.getTarifFees(this.tarifTable);
        this.displayFormToAddFees = false;
        this.fees = response.object;
        this.formToAddFees.reset();
        this.dialogService.closeLoading();
        this.dialogService.openToast({
          title: '',
          type: 'success',
          message: 'Fees added Successfully',
        });
      },
      error: error => {
        this.dialogService.closeLoading();
        this.dialogService.openToast({
          type: 'failed',
          title: 'Échec',
          message:
            error?.object?.response_message ??
            $localize`Something went wrong please retry again !`,
        });
      },
    });
  }
  updateTariff(fees: string) {
    this.dialogService.dispatchLoading();
    const newFees = {
      tarif_table: this.tarifTable,
      amount_range: {
        lower: this.feesToModifyForm.value.minValue,
        upper: this.feesToModifyForm.value.maxValue,
        bounds: '[]',
      },
      commissions: this.feesToModifyForm.value.totalCommissions,
      ihela_cios: this.feesToModifyForm.value.ihelaCommissions,
      agent_cios: this.feesToModifyForm.value.agentCommisions,
      client_creation_cios:
        this.feesToModifyForm.value.clientCreationCommissions,
      merchant_creation_cios:
        this.feesToModifyForm.value.merchantCreationCommissions,
      agent_cios_rate_from_amount: false,
      from_partner: false,
      description: 'fees test',
    };
    this.feeModificationLoader = true;
    this.feesToModifyForm.disable();

    this.tarifService.modifyFees(fees, newFees).subscribe({
      next: (response: ModifyFeesModel) => {
        this.feesToModifyForm.reset();
        this.getTarifFees(this.tarifTable);
        this.feeModificationLoader = false;
        this.fees = response.object;
        this.feesToModifyForm.enable();
        this.show = false;
        this.dialogService.closeLoading();
        this.dialogService.openToast({
          title: '',
          type: 'success',
          message: 'Fees updated Successfully',
        });
      },
      error: error => {
        this.feeModificationLoader = false;
        this.feesToModifyForm.enable();
        this.dialogService.closeLoading();
        this.dialogService.openToast({
          type: 'failed',
          title: 'Échec',
          message:
            error?.object?.response_message ??
            $localize`Something went wrong please retry again !`,
        });
      },
    });
  }
  openPinPopup() {
    this.dialogService.openDialog({
      action: 'confirmation',
      message: 'Are you sure that you want to delete this fees ?',
      title: '',
      type: 'confirm',
    });
  }

  deleteFees() {
    this.dialogService.dispatchLoading();
    this.tarifService.deleteFees(this.selectedFeeId).subscribe({
      next: (response: DeleteFeesModel) => {
        this.getTarifFees(this.tarifTable);
        this.dialogService.closeLoading();

        this.dialogService.openToast({
          title: '',
          type: 'success',
          message: 'Fees Deleted Successfully',
        });
        // this.dialogService.openToast({
        //   title: '',
        //   type: 'success',
        //   message: response.object.response_message,
        // });

        this.feeDeletedLoader = false;
        this.deleteFee = response.object;
        this.show = false;
      },
      error: error => {
        this.dialogService.closeLoading();
        this.dialogService.openToast({
          type: 'failed',
          title: 'Échec',
          message:
            error?.object?.response_message ??
            $localize`Something went wrong please retry again !`,
        });
      },
    });
  }
}
