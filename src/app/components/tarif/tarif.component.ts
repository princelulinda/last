import { Component, OnInit } from '@angular/core';
import { TarifService } from '../../core/services/tarif/tarif.service';
import { Observable } from 'rxjs';
import { SkeletonComponent } from '../../global/components/loaders/skeleton/skeleton.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  bankListResponse,
  tarifResponse,
  feesResonse,
  simulateResponse,
} from './tarif.model';
import { AuthService } from '../../core/services';
import { UserInfoModel } from '../../core/db/models/auth';
import { NgStyle, NgClass } from '@angular/common';
@Component({
  selector: 'app-tarif',
  standalone: true,
  imports: [ReactiveFormsModule, SkeletonComponent, NgStyle, NgClass],
  templateUrl: './tarif.component.html',
  styleUrl: './tarif.component.scss',
})
export class TarifComponent implements OnInit {
  toggleTheme = false;
  theme = 'light';
  bankList: bankListResponse[] | null = null;
  simulates: simulateResponse[] | null = null;
  getclientType = false;
  isAgent = false;
  selectedType = 'internal';
  showInternalTarif = true;
  showExternalTarif = false;
  showSimulate = false;
  showTarifList = false;

  buttonInternalClicked = false;
  buttonExternalClicked = false;
  buttonSimulateClicked = false;
  tariffClicked = false;

  isLoadingTarif = false;
  isLoadingBank = true;
  isLoadingTariffType = false;
  isLoadingTariffFees = false;
  isLoadingSimulate = false;

  //   fetchedTariffType: any;
  tariffData: tarifResponse[] | null = null;
  feesData: feesResonse[] | null = null;
  //   bank_id: any;

  companyName!: string;
  companyLogo!: string;
  tarifTitle!: string;
  typeCode!: string;
  bankId!: number;
  tarifTable!: number;
  tarifName!: string;

  onButtonInternalClick(): void {
    this.showInternalTarif = true;
    this.showExternalTarif = false;

    this.buttonInternalClicked = !this.buttonInternalClicked;
    this.buttonExternalClicked = false;
    this.showSimulate = false;
  }

  onButtonExternalClick(): void {
    this.showInternalTarif = false;
    this.showExternalTarif = true;
    this.buttonExternalClicked = !this.buttonExternalClicked;
    this.buttonInternalClicked = false;
  }
  onButtonSimulateClick(): void {
    this.showInternalTarif = false;
    this.showExternalTarif = false;
    this.showSimulate = true;
    this.tariffClicked = false;
    this.buttonExternalClicked = false;
    this.buttonInternalClicked = false;
  }
  onTariffClick(): void {
    this.tariffClicked = true;
    this.showInternalTarif = false;
    this.showExternalTarif = false;
    this.showSimulate = false;

    this.buttonExternalClicked = false;
    this.buttonInternalClicked = false;
  }

  constructor(
    private TarifService: TarifService,
    private authService: AuthService
  ) {
    this.isAgent$ = this.authService.getUserIsAgent();
  }
  userInfo!: UserInfoModel;
  clientInfo$!: Observable<number>;
  private isAgent$: Observable<boolean>;
  clientInfo!: UserInfoModel;

  ngOnInit() {
    this.getBanksList();
    this.isAgent$.subscribe({
      next: isAgent => {
        this.isAgent = isAgent === true;
      },
    });
  }
  getBanksList() {
    this.TarifService.getBanks().subscribe({
      next: (response: { objects: bankListResponse[] }) => {
        this.bankList = response.objects;
        this.isLoadingBank = false;
        if (this.bankList.length === 0) {
          //                 //
        }
      },
      error: (error: Error) =>
        console.error('Erreur lors de la récupération des banks:', error),
    });
  }

  getTarifType(bankId: number) {
    if (bankId) {
      const bank_id = bankId;
      this.isLoadingTariffType = true;
      this.TarifService.getTarifType(bank_id).subscribe({
        next: (response: { objects: tarifResponse[] }) => {
          this.isLoadingTariffType = false;
          this.tariffData = response.objects;
          if (this.tariffData.length === 0) {
            //
          }
        },
        error: () => {
          this.isLoadingTariffType = false;
        },
      });
    }
  }

  getTarifFees(tarifId: number) {
    if (tarifId) {
      const tarif_id = tarifId;
      this.tarifTable = tarifId;
      this.isLoadingTariffFees = true;
      this.TarifService.getTarifFees(tarif_id).subscribe({
        next: (response: { objects: feesResonse[] }) => {
          this.isLoadingTariffFees = false;
          this.feesData = response.objects;
          if (this.feesData.length === 0) {
            //
          }
        },
        error: () => {
          this.isLoadingTariffFees = false;
        },
      });
    }
  }
  getSimulate() {
    this.isLoadingSimulate = true;
    const amount = this.simulateForm.controls.amount.value;
    if (amount !== null) {
      this.TarifService.getSimulateWithTarifTable(
        this.tarifTable,
        amount.toString()
      ).subscribe({
        next: (response: { objects: simulateResponse[] }) => {
          this.isLoadingSimulate = false;
          this.simulates = response.objects;
          if (this.simulates.length === 0) {
            console.log('no fees founds');
            //
          }
        },
        error: () => {
          this.isLoadingSimulate = false;
        },
      });
    } else {
      this.isLoadingSimulate = false;
    }
  }
  resetSimulateData(): void {
    this.simulates = null;
    this.simulateForm.reset();
  }
  backOnTarifHome(): void {
    this.tariffClicked = false;
    this.showInternalTarif = true;
    this.showExternalTarif = false;
    this.showSimulate = false;
    this.buttonInternalClicked = true;
  }
  selectBank(selectedBank: bankListResponse) {
    this.bankList?.forEach(bank => {
      bank.isSelected = bank === selectedBank;
    });
  }

  selectType(name: string) {
    this.selectedType = name;
  }
  selectedBankInfo(bank: bankListResponse) {
    this.bankId = bank.id;
    this.companyLogo = bank.company.logo;
  }
  selectedTarifInfo(tarif: tarifResponse) {
    this.typeCode = tarif.type_code;
    this.tarifTitle = tarif.type_type;
    this.tarifName = tarif.type_name;
  }

  // getAmount(event: any) {
  //     this.amountInput = event.amount;
  //     this.transferForm.patchValue({
  //         amount: this.amountInput,
  //     });
  // }
  // transferForm = new FormGroup({
  //     amount: new FormControl<any>(this.amountInput, Validators.required),

  simulateForm = new FormGroup({
    amount: new FormControl('', Validators.required),
  });
}
