import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ListComponent } from '../../../../../global/components/list/list/list.component';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, LoanService } from '../../../../../core/services';
import { LookupComponent } from '../../../../../global/components/lookups/lookup/lookup.component';
import { DialogResponseModel } from '../../../../../core/services/dialog/dialogs-models';
import { AutocompleteModel } from '../../../../../global/models/global.models';

@Component({
  selector: 'app-credit-line-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ListComponent, LookupComponent],
  templateUrl: './credit-line-list.component.html',
  styleUrl: './credit-line-list.component.scss',
})
export class CreditLineListComponent implements OnInit, OnDestroy {
  myForm!: FormGroup;
  isChecked = false;
  isclicked = false;
  selecedUnit = 'amount';
  client!: number | null;
  isLoading = false;
  onDestroy$: Subject<void> = new Subject<void>();
  dialog!: DialogResponseModel;
  dialog$: Observable<DialogResponseModel>;
  isDebitorGreaterThan100 = false;
  isPenalitiesGreaterThan100 = false;
  lookupEffectue = false;
  isFacilityGreaterThanDue = false;
  showCreditLine = false;

  headers = [
    {
      name: 'Name',
      field: ['crel_account_info.acc_holder'],
      size: '',
      format: '',
      detail: {
        link: '/w/workstation/desk/credit/line/details/',
        field: 'id',
      },
    },

    {
      name: 'Code',
      field: ['crel_code'],
      size: '',
      format: '',
    },
    {
      name: 'Account',
      field: ['crel_account_info.acc_number'],
      size: '',
      format: '',
    },
    {
      name: 'Status',
      field: ['crel_status.title'],
      size: '',
      format: '',
      css: 'crel_status.css',
    },

    {
      name: 'Created at',
      field: ['created_at'],
      size: '',
      format: 'date',
    },
    {
      name: 'Expiry date',
      field: ['crel_expiry_date'],
      size: '',
      format: '',
    },
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private loanService: LoanService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.myForm = new FormGroup({
      due: new FormControl('', Validators.required),
      facility: new FormControl('', Validators.required),
      penalities: new FormControl('', Validators.required),

      debitor: new FormControl('', Validators.required),
      fees: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),

      isRenewable: new FormControl<boolean>(
        this.isChecked,
        Validators.required
      ),
    });
    this.dialog$ = this.dialogService.getDialogState();
  }

  ngOnInit(): void {
    this.dialog$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (dialog: DialogResponseModel) => {
        if (dialog) {
          this.dialog = dialog;
          if (this.dialog && this.dialog.response) {
            if (
              this.dialog.response.confirmation === 'YES' &&
              this.dialog.action === 'create'
            ) {
              this.creditLine();
            }
          }
        }
      },
    });
    if (this.route && this.route.fragment) {
      this.route.fragment.subscribe({
        next: fragment => {
          if (fragment === 'creditLine') {
            this.showCreditLine = true;
          } else {
            this.showCreditLine = false;
          }
        },
      });
    }
  }
  toggleCheckbox() {
    this.isChecked = !this.isChecked;
    this.cdr.detectChanges();
    this.myForm.patchValue({
      isRenewable: this.isChecked,
    });
  }

  checkFacilityDue() {
    const facilityValue = this.myForm.get('facility')?.value;
    const dueValue = this.myForm.get('due')?.value;

    this.isFacilityGreaterThanDue = facilityValue > dueValue;
  }

  checkDebitorValue() {
    const debitorValue = this.myForm.get('debitor')?.value;
    this.isDebitorGreaterThan100 = debitorValue >= 100;
  }

  checkPenalitiesValue() {
    const penalitiesValue = this.myForm.get('penalities')?.value;
    this.isPenalitiesGreaterThan100 = penalitiesValue >= 100;
  }

  getClientId(event: AutocompleteModel | null) {
    if (event) {
      this.client = event.id;
      this.lookupEffectue = true;
    } else {
      this.client = null;
      this.lookupEffectue = false;
    }
  }

  calculateValue() {
    const feesValue = this.myForm.get('fees')?.value;
    const amountValue = this.myForm.get('amount')?.value;

    if (feesValue && amountValue) {
      return (feesValue * amountValue) / 100;
    }

    return 0;
  }

  creditLine() {
    this.isLoading = true;
    const body = {
      crel_account: this.client,
      crel_expiry_date: this.myForm.get('due')?.value,
      crel_debitor_rate: this.myForm.get('debitor')?.value,
      crel_penalities_rate: this.myForm.get('penalities')?.value,

      crel_fees: this.myForm.get('fees')?.value,
      crel_credit_limit: this.myForm.get('amount')?.value,
      crel_limit_expiry_date: this.myForm.get('facility')?.value,
    };
    this.dialogService.dispatchLoading();
    this.loanService
      .creditLine(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.myForm.reset();
          this.dialogService.closeLoading();
          this.router.navigate([
            '/w/workstation/d/desk/credit/creditsline/list',
          ]);
          this.dialogService.openToast({
            title: '',
            type: 'success',
            message: 'Your credit line has been successfully requested.',
          });
        },
        error: () => {
          this.isLoading = false;
          this.myForm.reset();
          this.dialogService.closeLoading();
          this.router.navigate([
            '/w/workstation/d/desk/credit/creditsline/list',
          ]);
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'Failed to credit line.',
          });
        },
      });
  }
  goBack() {
    this.router.navigate(['/w/workstation/d/desk/credit/creditsline/list']);
  }

  openModal() {
    this.dialogService.openDialog({
      title: 'create credit line',
      type: 'confirm',
      message: 'Are you sure that you want to create credit line',
      action: 'create',
    });
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
