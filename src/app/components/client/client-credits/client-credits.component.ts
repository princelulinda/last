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

  showAmount$!: Observable<boolean>;
  showAmount = false;
  showAmountStat = false;

  amountState$!: Observable<boolean>;
  amountState = false;

  isLoading = false;
  balance_currency: CurrencyModel = 'BIF';
  customClasses = 'text-success fs-x-small';

  @Input() selectedClient!: {
    id: string;
    client_id: number;
    client_phone_number: number;
    client_code: string;
    client_full_name: string;
    picture_url: string;
    client_is_custom: boolean;
    client_type: string;
  };

  plan!: boolean;
  credits!:
    | {
        cred_status: {
          css: string;
          label: string;
        };
      }
    | null
    | unknown
    | [];
  credit!: [] | null;
  creditId!: number;
  // client: any;
  clientId!: number;
  id = '';
  selectedCredit!: {
    id: number;
  };
  // clientDetails: any;
  // amortissmentPlan: any;

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
    this.showAmount$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: showAmount => {
        this.showAmount = !showAmount;
        this.showAmountStat = !showAmount;
      },
    });

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
    this.clientId = this.selectedClient.client_id;
    this.id = this.selectedClient.id;
    this.getCreditsList();
  }

  selectCredit(credit: { id: number }) {
    this.selectedCredit = credit;

    this.getCreditDetails();
  }

  showBalance() {
    this.showAmount = !this.showAmount;
  }
  showBalanceStat() {
    this.showAmountStat = !this.showAmountStat;
    // this.store.dispatch(new displayAmount({ show: this.showAmountStat }));
  }

  selectPlan() {
    this.plan = !this.plan;
  }

  getCreditsList() {
    this.loanService
      .getLoanListByClient(this.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (credits: unknown) => {
          this.credits = credits;
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
      .getCreditDetails(this.selectedCredit.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (credit: unknown) => {
          const creditObject = credit as { object: unknown };
          this.isLoading = false;
          this.credit = creditObject.object as [];
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
