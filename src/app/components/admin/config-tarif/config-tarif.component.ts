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
  TarifService,
} from '../../../core/services';
import {
  TarifFeesResonseModel,
  TarifTypeInfoModel,
  TarifTypeModel,
  AddTarifModel,
  AddFeesModel,
  feesModel,
  ModifyFeesModel,
} from './config-tarif-model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-config-tarif',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './config-tarif.component.html',
  styleUrl: './config-tarif.component.scss',
})
export class ConfigTarifComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
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
  }
  constructor(
    private tarifService: TarifService,
    private apiService: ApiService,
    private configService: ConfigService
  ) {}

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

  show = false;
  showF = false;
  selectedFeeId!: string;

  showInput(fees: feesModel) {
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

  //   show2: boolean = false;
  //   selectedFeeId2: string = '';

  //   showInput2(id: string) {
  //       this.show2 = true;
  //       this.selectedFeeId = id;

  //     }

  tatifType!: string;
  tarifName!: string;
  typeCode!: string;
  description!: string;

  tarifForm = new FormGroup({
    tatifType: new FormControl('', Validators.required),
    tarifName: new FormControl('', Validators.required),
    typeCode: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  tariffCreated = false;
  tarif_type = '';
  feeModificationLoader = false;
  feeDeletedLoader = false;

  addTariff() {
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
      },
      error: () => {
        //
      },
    });
  }
  addTarifToTable() {
    const data = {
      tarif_type: this.tarif_type,
      bank: this.bank_id,
    };
    // const response = {
    //     title: '',
    //     type: 'loading',
    //     message: '',
    // };
    // this.store.dispatch(new OpenDialog(response));
    this.tarifService.addTarifToTable(data).subscribe({
      next: response => {
        this.tarif = response.object;
        // this.store.dispatch(new CloseDialog({ response: 'close' }));
        // const notification = {
        //     title: '',
        //     type: 'success',
        //     message: 'Tariff added to the table successfully',
        // };
        // this.store.dispatch(new OpenDialog(notification));
        // this.showAddTarifType = false;
        this.TarifType = true;
        this.getTarifType();
      },
      error: () => {
        // this.store.dispatch(new CloseDialog({ response: 'close' }));
        // const notification = {
        //     title: '',
        //     type: 'failed',
        //     message: error.object.response_message,
        // };
        // this.store.dispatch(new OpenDialog(notification));
      },
    });
  }

  tariffType = '';
  getSelectedType(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.tariffType = selectElement.value;
    // this.tarifForm.patchValue({ typeCode: this.tariffType });
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

  boundss = [];
  fees!: ModifyFeesModel;
  feeId = 0;
  minValue!: string;
  maxValue!: string;
  totalCommissions!: string;
  ihelaCommisiions!: string;
  agentCommisions!: string;
  clientCreationCommissions!: string;
  merchantCreationCommissions!: string;

  addFees() {
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
    // const response = {
    //     title: '',
    //     type: 'loading',
    //     message: '',
    // };
    // this.store.dispatch(new OpenDialog(response));

    this.tarifService.addFees(newFees).subscribe({
      next: (response: AddFeesModel) => {
        // this.store.dispatch(new CloseDialog({ response: 'close' }));
        this.getTarifFees(this.tarifTable);
        this.displayFormToAddFees = false;
        this.fees = response.object;
        this.formToAddFees.reset();
      },
      error: () => {
        // // this.store.dispatch(new CloseDialog({ response: 'close' }));
        // const notification = {
        //     title: '',
        //     type: 'failed',
        //     message: error.object.response_message,
        // };
        // // this.store.dispatch(new OpenDialog(notification));
      },
    });
  }
  updateTariff(fees: string) {
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
      },
      error: () => {
        this.feeModificationLoader = false;
        this.feesToModifyForm.enable();
        // const notification = {
        //     title: '',
        //     type: 'failed',
        //     message: error.object.response_message,
        // };
        // this.store.dispatch(new OpenDialog(notification));
      },
    });
  }
}
