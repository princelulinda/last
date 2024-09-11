import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService, TarifService } from '../../core/services';
import {
  TarifFeesResonseModel,
  TarifTypeInfoModel,
  TarifTypeModel,
  AddTarifModel,
} from './configuration-tarif-model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-configutarion-tarif',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './configutarion-tarif.component.html',
  styleUrl: './configutarion-tarif.component.scss',
})
export class ConfigutarionTarifComponent implements OnInit {
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
  // bank_name: any;
  // organization$: any;

  ngOnInit() {
    this.getTarifType();

    // this.organization$.pipe(takeUntil(this.onDestroy$)).subscribe({
    //         next: (bank: any) => {
    //             if (bank && bank.bank_id) {
    //                 this.bank_id = bank.bank_id;
    //                 this.bank_name = bank.institution_client.client_full_name;
    //                 console.log('this bank', this.bank_id);
    //             }
    //         },
    //     });
  }
  constructor(
    private tarifService: TarifService,
    private apiService: ApiService
  ) {
    // this.organization$ = this.store.select(AuthState.GetOrganization);
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
  addFees(): void {
    this.displayFormToAddFees = !this.displayFormToAddFees;
  }

  show = false;
  showF = false;
  selectedFeeId!: string;
  showInput(id: string) {
    this.show = true;
    this.selectedFeeId = id;
    console.log('input1 :', this.show);
  }
  showFees(id: string) {
    this.showF = true;
    this.show = false;
    this.selectedFeeId = id;
    console.log('fess :', this.showF);
    console.log('input2 :', this.show);
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
  formToAddFees = new FormGroup({
    minValue: new FormControl('', Validators.required),
    maxValue: new FormControl('', Validators.required),
  });

  tariffType = '';
  getSelectedType(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.tariffType = selectElement.value;
    // this.tarifForm.patchValue({ typeCode: this.tariffType });
  }
}
