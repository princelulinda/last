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
} from './configuration-tarif-model';

@Component({
  selector: 'app-configutarion-tarif',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './configutarion-tarif.component.html',
  styleUrl: './configutarion-tarif.component.scss',
})
export class ConfigutarionTarifComponent implements OnInit {
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
  tarif!: string;

  ngOnInit() {
    this.getTarifType();
  }
  constructor(
    private tarifService: TarifService,
    private apiService: ApiService
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
  addFees(): void {
    this.displayFormToAddFees = !this.displayFormToAddFees;
  }

  show = false;
  showF = false;
  selectedFeeId = '';
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

  addTariff() {
    const data = {
      type_type: this.tarifForm.value.tatifType,
      name: this.tarifForm.value.tarifName,
      type_code: this.tarifForm.value.typeCode,
      description: this.tarifForm.value.description,
    };
    this.tarifService.addTarif(data).subscribe({
      next: response => {
        this.tarif = response.objects;
      },
      error: () => {
        //
      },
    });
  }

  formToAddFees = new FormGroup({
    minValue: new FormControl('', Validators.required),
    maxValue: new FormControl('', Validators.required),
  });
}
