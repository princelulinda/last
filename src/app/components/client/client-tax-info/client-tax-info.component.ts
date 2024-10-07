import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ClientCorporateModel,
  ClientWorkstationModel,
  IndividualClientModel,
} from '../client.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-client-tax-info',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './client-tax-info.component.html',
  styleUrl: './client-tax-info.component.scss',
})
export class ClientTaxInfoComponent implements OnInit, OnDestroy {
  taxForm!: FormGroup;

  private onDestroy$ = new Subject<void>();

  @Input() selectedTaxInfo = false;
  @Input() isTaxAdditionFormShown = false;

  @Input() clientEntreprise!: ClientCorporateModel | null;
  @Input() clientIndiv!: IndividualClientModel | null;
  @Input() selectedClient!: ClientWorkstationModel | null;
  @Input() clientId!: string | number;
  fiscalCenterCode = [
    { name: 'Department of Large Taxpayers', abbrev: 'DGC' },
    { name: 'Taxpayer Ressources Department', abbrev: 'DMC' },
    { name: 'Department of Small and Micro- taxpayers', abbrev: 'DPMC' },
  ];

  taxFormIndividuel = new FormGroup({
    tradeRegisterNumber: new FormControl(''),
    trnFile: new FormControl(''),
    trnIssueDate: new FormControl(''),
    taxIdentificationCode: new FormControl(''),
    ticFile: new FormControl(''),
    ticIssueDate: new FormControl(''),
    postalCode: new FormControl(''),
    isValueAddedTaxPayer: new FormControl(false),
    isConsumptionTaxPayer: new FormControl(false),
    isTlTaxPayer: new FormControl(false),
    isOttTaxPayer: new FormControl(false),
    isTsceTaxPayer: new FormControl(false),

    fiscalCenterCode: new FormControl(this.fiscalCenterCode[0].abbrev),
    other_fiscal_center_code: new FormControl(''),
    legalForm: new FormControl(''),
  });
  imageSrcTrn!: string;
  fileNameTrn = '';
  trnFile = new FormControl('');
  ticFile = new FormControl('');
  imageSrcTic!: string;
  fileNameTic = '';
  newTaxInfo = false;
  isLoading = false;

  ngOnInit(): void {
    if (this.clientEntreprise && this.clientEntreprise.fisc.length > 0) {
      this.taxForm = new FormGroup({
        trade_register_number: new FormControl(
          this.clientEntreprise.fisc[0].trade_register_number
        ),
        trn_file: new FormControl(this.clientEntreprise.fisc[0].trn_file),
        trn_issue_date: new FormControl(
          this.clientEntreprise.fisc[0].trn_issue_date
        ),
        tax_identification_code: new FormControl(
          this.clientEntreprise.fisc[0].tax_identification_code
        ),
        tic_file: new FormControl(this.clientEntreprise.fisc[0].tic_file),
        tic_issue_date: new FormControl(
          this.clientEntreprise.fisc[0].tic_issue_date
        ),
        postal_code: new FormControl(this.clientEntreprise.fisc[0].postal_code),
        fiscal_center_code: new FormControl(this.fiscalCenterCode[0].abbrev),
        is_value_added_tax_payer: new FormControl(
          this.clientEntreprise.fisc[0].is_value_added_tax_payer
        ),
        is_consumption_tax_payer: new FormControl(
          this.clientEntreprise.fisc[0].is_consumption_tax_payer
        ),
        is_tl_tax_payer: new FormControl(
          this.clientEntreprise.fisc[0].is_tl_tax_payer
        ),

        legal_form: new FormControl(this.clientEntreprise.fisc[0].legal_form),
      });
    }
  }

  addNewTax() {
    this.newTaxInfo = !this.newTaxInfo;
  }

  onFileSelectedTrn(event: Event): void {
    const inputElementTrn = event.target as HTMLInputElement;
    const fileTrn = inputElementTrn.files?.[0];

    if (fileTrn) {
      const readerTrn = new FileReader();

      readerTrn.onload = e1 => {
        if (e1.target && e1.target.result) {
          this.imageSrcTrn = e1.target.result as string;
        }
      };

      readerTrn.readAsDataURL(fileTrn);
      this.fileNameTrn = fileTrn.name;
    }
  }
  onFileSelectedTic(event: Event): void {
    const inputElementTic = event.target as HTMLInputElement;
    const fileTic = inputElementTic.files?.[0];

    if (fileTic) {
      const readerTic = new FileReader();

      readerTic.onload = (e2: ProgressEvent<FileReader>) => {
        if (e2.target && e2.target.result) {
          this.imageSrcTic = e2.target.result as string;
        }
      };

      readerTic.readAsDataURL(fileTic);
      this.fileNameTic = fileTic.name;
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
