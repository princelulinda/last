import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  ConfigService,
  DialogService,
  LoanService,
} from '../../../core/services';
import { OrganizationModel } from '../../auth/auth.model';
import { CurrencyModel } from '../../../global/models/global.models';
import { CommonModule } from '@angular/common';
import { AmountVisibilityComponent } from '../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { SelectedClientSmallOverviewComponent } from '../selected-client-small-overview/selected-client-small-overview.component';
import { RouterLink } from '@angular/router';
import { ClientWorkstationModel, CreditsLineModel } from '../client.model';

@Component({
  selector: 'app-client-credits-line',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AmountVisibilityComponent,
    SelectedClientSmallOverviewComponent,
  ],
  templateUrl: './client-credits-line.component.html',
  styleUrl: './client-credits-line.component.scss',
})
export class ClientCreditsLineComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  @Input() selectedClient: ClientWorkstationModel =
    {} as ClientWorkstationModel;

  organization$: Observable<OrganizationModel | null>;
  amountState$!: Observable<boolean>;
  organization!: OrganizationModel | null;

  amountState = false;
  isLoading = false;

  creditsLine!: CreditsLineModel[] | null;
  creditLine!: CreditsLineModel | null;
  creditLineId!: number;
  clientId!: number;
  id = '';
  selectedCreditLine!: CreditsLineModel;
  balance_currency: CurrencyModel = 'BIF';
  customClasses = ['text-success', 'fw-bold'];

  constructor(
    private loanService: LoanService,
    private configService: ConfigService,
    private dialogService: DialogService
  ) {
    this.organization$ = this.configService.getSelectedOrganization();
    this.amountState$ = this.dialogService.getAmountState();
  }

  ngOnInit(): void {
    this.amountState$.subscribe({
      next: state => {
        this.amountState = state;
      },
    });
    this.organization$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: organization => {
        this.organization = organization;
      },
    });
    this.clientId = this.selectedClient?.client_id as number;
    this.id = (this.selectedClient?.id ?? '').toString();
    this.getCreditsLineList();
  }

  selectCreditLine(creditLine: CreditsLineModel) {
    this.selectedCreditLine = creditLine;
    this.getCreditLineDetails();
  }

  getCreditsLineList() {
    this.loanService
      .getLoanLineListByClient(this.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (credits: { objects: CreditsLineModel[] }) => {
          this.creditsLine = credits.objects;
        },
      });
  }
  getCreditLineDetails() {
    this.isLoading = true;
    this.creditLine = null;
    this.loanService
      .getCreditLinesDetails(this.selectedCreditLine.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (creditLine: { object: CreditsLineModel }) => {
          this.isLoading = false;
          this.creditLine = creditLine.object;
        },
        error: error => {
          this.isLoading = false;
          this.dialogService.openToast({
            type: 'failed',
            title: 'Error',
            message: error ?? 'error, try again please',
          });
        },
      });
  }

  refresh() {
    this.creditsLine = null;
    this.creditLine = null;

    this.isLoading = true;

    this.getCreditsLineList();
    this.getCreditLineDetails();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
