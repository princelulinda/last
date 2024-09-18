import { Component, OnInit } from '@angular/core';
import { NgStyle, NgClass } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Observable } from 'rxjs';

import { TarifService } from '../../../core/services/tarif/tarif.service';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import {
  BankListResponseModel,
  TarifResponseModel,
  FeesResonseModel,
  SimulateResponseModel,
} from '../tarif.model';
import { AuthService } from '../../../core/services';
import { UserInfoModel } from '../../../core/db/models/auth';
import { EmptyStateComponent } from '../../../global/components/empty-states/empty-state/empty-state.component';
import { AmountFieldComponent } from '../../../global/components/custom-field/amount-field/amount-field.component';

@Component({
  selector: 'app-tarif',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SkeletonComponent,
    NgStyle,
    NgClass,
    EmptyStateComponent,
    AmountFieldComponent,
  ],
  templateUrl: './tarif.component.html',
  styleUrl: './tarif.component.scss',
})
export class TarifComponent implements OnInit {
  theme = 'light';
  bankList: BankListResponseModel[] | null = null;
  simulates: SimulateResponseModel[] | null = null;
  isAgent = false;
  selectedType = 'internal';
  isLoadingTarif = false;
  isLoadingBank = true;
  isLoadingTariffType = false;
  isLoadingTariffFees = false;
  isLoadingSimulate = false;
  tariffData: TarifResponseModel[] | null = null;
  feesData: FeesResonseModel[] | null = null;
  companyName!: string;
  companyLogo!: string;
  tarifTitle!: string;
  typeCode!: string;
  bankId!: number;
  tarifTable!: number;
  tarifName!: string;
  constructor(
    private TarifService: TarifService,
    private authService: AuthService
  ) {
    this.isAgent$ = this.authService.checkUserIsAgent();
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
      next: (response: { objects: BankListResponseModel[] }) => {
        this.bankList = response.objects;
        this.isLoadingBank = false;
        if (this.bankList.length === 0) {
          //
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
        next: (response: { objects: TarifResponseModel[] }) => {
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
        next: (response: { objects: FeesResonseModel[] }) => {
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
    const amount = this.amountWritten;
    if (amount !== null) {
      this.TarifService.getSimulateWithTarifTable(
        this.tarifTable,
        amount.toString()
      ).subscribe({
        next: (response: { objects: SimulateResponseModel[] }) => {
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

  selectBank(selectedBank: BankListResponseModel) {
    this.bankList?.forEach(bank => {
      bank.isSelected = bank === selectedBank;
    });
  }

  selectType(name: string) {
    this.selectedType = name;
  }
  selectedBankInfo(bank: BankListResponseModel) {
    this.bankId = bank.id;
    this.companyLogo = bank.company.logo;
  }
  selectedTarifInfo(tarif: TarifResponseModel) {
    this.typeCode = tarif.type_code;
    this.tarifTitle = tarif.type_type;
    this.tarifName = tarif.type_name;
  }
  amountWritten!: number | null;
  inputAmount(event: { amount: number | null }) {
    this.amountWritten = event.amount;
  }

  simulateForm = new FormGroup({
    amount: new FormControl('', Validators.required),
  });

  actifSection:
    | 'internalBank'
    | 'tarif'
    | 'externalBank'
    | 'simulate'
    | 'internalBank' = 'internalBank';
  setActifSection(
    name: 'internalBank' | 'externalBank' | 'tarif' | 'simulate'
  ) {
    this.actifSection = name;
  }
}
