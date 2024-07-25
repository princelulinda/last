import { Component, OnDestroy, OnInit } from '@angular/core';
import { BeneficiariesComponent } from '../beneficiaries/beneficiaries/beneficiaries.component';
import { Subject } from 'rxjs';
import { DebitAccountComponent } from '../debit-account/debit-account.component';
import { CreditAccountComponent } from '../credit-account/credit-account.component';
// import { InstitutionInfoModel } from '../transfer.model';

@Component({
  selector: 'app-transfer',
  standalone: true,
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss',
  imports: [
    BeneficiariesComponent,
    DebitAccountComponent,
    CreditAccountComponent,
  ],
})
export class TransferComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  isNewTransfer = false;
  isTransferDone = false;
  // eslint-disable-next-line
  selectedInstitution: any;

  // eslint-disable-next-line
  selectedInstitutionType: any;
  // eslint-disable-next-line
  selectedCreditAccountType: any;

  constructor() {
    console.log('transfer');
  }
  ngOnInit(): void {
    console.log('transfer');
  }
  // eslint-disable-next-line
  setSelectedInstitution(institution: any) {
    this.selectedInstitution = institution;
  }

  // eslint-disable-next-line
  setSelectedInstitutionType(type: any) {
    this.selectedInstitutionType = type;
  }

  // eslint-disable-next-line
  setSelectedCreditAccountType(type: any) {
    this.selectedCreditAccountType = type;
  }

  // eslint-disable-next-line
  getDebitOptions(event: any) {
    console.log(event);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
