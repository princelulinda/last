import { Component, OnInit, OnDestroy } from '@angular/core';
import { Modal } from 'bootstrap';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StatementComponent } from '../../../statements/statement/statement.component';
import { ListComponent } from '../../../../global/components/list/list/list.component';
import { Subject, takeUntil } from 'rxjs';
import { ClientService, LoanService } from '../../../../core/services';
import { CommonModule } from '@angular/common';
import { LoanModel } from '../../../loan/loan.models';
import { ClientWorkstationModel } from '../../../client/client.model';

@Component({
  selector: 'app-credit-details',
  standalone: true,
  imports: [StatementComponent, ListComponent, CommonModule, RouterLink],
  templateUrl: './credit-details.component.html',
  styleUrl: './credit-details.component.scss',
})
export class CreditDetailsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  headers = [
    {
      name: 'Echeance Date',
      field: ['crep_echeance_date'],
      size: '',
      format: 'date',
      detail: {
        link: '/w/workstation/d/desk/credit/details/',
        field: 'id',
      },
    },
    {
      name: 'Echeance Amount',
      field: ['currency', 'crep_echeance_amount'],
      size: '',
      format: '',
    },

    {
      name: 'Capital Amount',
      field: ['currency', 'crep_capital'],
      size: '',
      format: 'currency',
    },
    {
      name: 'Interests',
      field: ['currency', 'crep_interest'],
      size: '',
      format: 'currency',
    },
    {
      name: 'Due Interests',
      field: ['currency', 'crep_due_interest'],
      size: '',
      format: 'currency',
    },

    {
      name: 'Due Capital',
      field: ['crep_due_capital'],
      size: '',
      format: 'currency',
    },
    {
      name: 'Due Capital',
      field: ['crep_status.label'],
      size: '',
      format: '',
      css: 'crep_status.css',
      class: 'badge',
    },
  ];
  credLoading = true;
  clientLoading = true;
  credit: LoanModel | undefined;
  creditId = '';
  clientId = '';
  client!: ClientWorkstationModel;

  showPlan = false;

  constructor(
    private router: Router,
    private loanService: LoanService,
    private clientService: ClientService,
    private route: ActivatedRoute
  ) {}

  openPlanModel() {
    const modalEl = document.getElementById('planModal');
    if (modalEl !== null) {
      const modal = new Modal(modalEl);
      modal.show();

      modalEl.addEventListener('hidden.bs.modal', () => {
        this.router.navigate([]);
      });
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: data => {
        this.creditId = data['id'];

        this.getCreditDetails();
      },
    });

    this.showPlan = false;
  }

  getCreditDetails() {
    this.credit = undefined;
    this.loanService
      .getCreditDetails(this.creditId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: credit => {
          this.credLoading = false;
          this.credit = credit.object;
          this.clientId = this.credit.cred_client_code;

          if (credit) {
            this.showPlan = true;
          }
          this.getClientInfo();
        },
        error: error => {
          this.credLoading = false;
          return error;
        },
      });
  }

  getClientInfo() {
    this.clientService
      .getClientDetails(this.clientId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: client => {
          this.clientLoading = false;
          this.client = client.object;
        },
        error: error => {
          this.clientLoading = false;
          return error;
        },
      });
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
