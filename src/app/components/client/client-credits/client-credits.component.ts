import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  ConfigService,
  DialogService,
  LoanService,
} from '../../../core/services';
import { ListComponent } from '../../../global/components/list/list/list.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SelectedClientSmallOverviewComponent } from '../selected-client-small-overview/selected-client-small-overview.component';
import { CurrencyModel } from '../../../global/models/global.models';
import { AmountVisibilityComponent } from '../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { OrganizationModel } from '../../auth/auth.model';
import { LoanListModel, LoanModel } from '../../loan/loan.models';
import { ClientWorkstationModel } from '../client.model';

@Component({
  selector: 'app-client-credits',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ListComponent,
    SelectedClientSmallOverviewComponent,
    AmountVisibilityComponent,
  ],
  templateUrl: './client-credits.component.html',
  styleUrl: './client-credits.component.scss',
})
export class ClientCreditsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  organization$!: Observable<OrganizationModel | null>;
  organization!: OrganizationModel | null;

  amountState$!: Observable<boolean>;
  amountState = false;

  isLoading = false;
  balance_currency: CurrencyModel = 'BIF';
  customClasses = 'text-success fs-x-small';

  @Input() selectedClient!: ClientWorkstationModel;

  plan!: boolean;
  credits!: LoanListModel[] | null;
  credit!: LoanModel | null;
  creditId!: number;
  // client: any;
  clientId!: number;
  id!: number;
  selectedCredit!: LoanListModel;
  // clientDetails: any;

  headersPlan = [
    {
      name: 'Date',
      field: ['crep_echeance_date'],
      size: '',
    },
    {
      name: 'Capital',
      field: ['crep_capital'],
      size: '',
      format: 'currency',
    },
    {
      name: 'Due capital',
      field: ['crep_due_capital'],
      size: '',
      format: 'currency',
    },
    {
      name: 'Interests',
      field: ['crep_interest'],
      size: '',
      format: 'currency',
    },
    {
      name: 'Due interests',
      field: ['crep_due_interest'],
      size: '',
      format: 'currency',
    },
    {
      name: 'Echeance amount',
      field: ['crep_echeance_amount'],
      size: '',
      format: 'currency',
    },
    {
      name: 'Status',
      field: ['crep_status.label'],
      size: '',
      format: '',
      css: 'crep_status.css',
      class: 'badge',
    },
  ];

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
    this.id = this.selectedClient?.id as number;
    this.getCreditsList();
  }

  selectCredit(credit: LoanListModel) {
    this.selectedCredit = credit;

    this.getCreditDetails();
  }

  selectPlan() {
    this.plan = !this.plan;
  }

  getCreditsList() {
    this.loanService
      .getLoanListByClient(this.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (credits: { objects: LoanListModel[] }) => {
          this.credits = credits.objects;
          console.log('=================>credits value:', this.credits);
        },
        error: () => {
          this.isLoading = false;
          this.dialogService.openToast({
            type: 'failed',
            title: 'Error',
            message: 'Failed to retrieve credit List. Please try again.',
          });
        },
      });
  }

  getCreditDetails() {
    this.isLoading = true;
    this.credit = null;
    this.loanService
      .getCreditDetails(this.selectedCredit.id.toString())
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (credit: { object: LoanModel }) => {
          this.isLoading = false;
          this.credit = credit.object;
        },
        error: () => {
          this.isLoading = false;
          this.dialogService.openToast({
            type: 'failed',
            title: 'Error',
            message: 'Failed to retrieve credit details. Please try again.',
          });
        },
      });
  }

  refresh() {
    this.credits = null;
    this.credit = null;

    this.isLoading = true;

    this.getCreditsList();
    this.getCreditDetails();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
