import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';

import { LookupComponent } from '../../../global/components/lookups/lookup/lookup.component';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { PaginationConfig } from '../../../global/models/pagination.models';
import { CounterService } from '../../../core/services/counter/counter.service';
import { DialogService } from '../../../core/services';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';
import { BalanceActionModel, BalanceModel } from './balance.model';
import { ProfileCardComponent } from '../../../global/components/custom-field/profile-card/profile-card.component';
import { AmountVisibilityComponent } from '../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { PaginationComponent } from '../../../global/components/list/pagination/pagination.component';
import { AutocompleteModel } from '../../../global/models/global.models';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LookupComponent,
    SkeletonComponent,
    ProfileCardComponent,
    AmountVisibilityComponent,
    PaginationComponent,
  ],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss',
})
export class BalanceComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  @ViewChild('closeChecking') checkingBalance!: ElementRef;
  @ViewChild('closeAction') closeAction_Balance!: ElementRef;

  dialog$: Observable<DialogResponseModel>;
  dialog!: DialogResponseModel;

  balanceForm: FormGroup;
  balanceActionForm: FormGroup;
  balanceChecking = false;
  balanceAction!: string;
  balanceActionChecked!: BalanceActionModel;
  alias: AutocompleteModel | null = null;
  institution_balance!: BalanceModel[] | null;
  verifying = false;
  balanceActionDoing = false;
  reloading = true;
  institutionPicked!: BalanceModel | null;

  currentPage = 1;
  count = 0;
  pagination: PaginationConfig = {
    filters: {
      limit: 10,
      offset: 0,
    },
  };

  searchInput = new FormControl('');
  isInputFocused = false;

  constructor(
    private fb: FormBuilder,
    private counterService: CounterService,
    private dialogService: DialogService
  ) {
    this.dialog$ = this.dialogService.getDialogState();
    this.balanceForm = this.fb.group({
      external_balance: ['', Validators.required],
      pin: ['', Validators.required],
    });
    this.balanceActionForm = this.fb.group({
      reason: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getTreasuryBalance('');
    this.dialog$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: dialog => {
        this.dialog = dialog;
        if (this.dialog && this.dialog.response) {
          if (this.dialog.response.pin && this.dialog.action === 'add') {
            this.approve_suspectBalance();
          }
        }
      },
    });
    this.searchInput.valueChanges
      .pipe(debounceTime(400), takeUntil(this.onDestroy$))
      .subscribe(value => {
        this.getTreasuryBalance(value ?? '');
      });
  }
  putPassword() {
    this.dialogService.openDialog({
      title: '',
      type: 'password',
      message: 'Put your password to confirm',
      action: 'put',
    });
  }
  getLedgerAlias(alias: AutocompleteModel | null) {
    this.alias = alias;
  }
  getTreasuryBalance(search: string) {
    this.reloading = true;
    this.institution_balance = null;
    this.counterService
      .getTreasuryBalanceList(search, this.pagination)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: balance => {
          this.reloading = false;
          this.institution_balance = balance.objects;
          this.count = balance.count;
        },
        error: () => {
          this.reloading = false;
        },
      });
  }
  refreshPage() {
    this.searchInput.setValue('');
    this.institution_balance = null;
    this.getTreasuryBalance('');
  }

  isSearchInputNotEmpty(): boolean {
    const searchValue = this.searchInput.value;
    return typeof searchValue === 'string' && searchValue.trim() !== '';
  }
  verifyBalance(institution: BalanceModel) {
    this.verifying = true;
    this.institutionPicked = institution;
  }
  closeVerification() {
    this.verifying = false;
    this.institutionPicked = null;
  }
  addBalance() {
    const body = {
      institution: (this.alias as AutocompleteModel).id,
      ext_balance: this.balanceForm.value.external_balance,
      pin_code: this.balanceForm.value.pin,
    };
    this.balanceChecking = true;
    this.balanceForm.disable();
    this.counterService
      .addTreasuryBalanceList(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: balance => {
          console.log('egooooo', balance);
          // if (balance) {
          this.balanceForm.enable();
          this.balanceChecking = false;
          this.checkingBalance.nativeElement.click();
          this.getTreasuryBalance('');
          this.dialogService.openToast({
            title: '',
            type: 'success',
            message: 'Alias added for checking balance',
          });
          // }
        },
        error: (error: BalanceModel) => {
          this.balanceChecking = false;
          this.balanceForm.enable();
          this.checkingBalance.nativeElement.click();
          this.getTreasuryBalance('');
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'failed',
          });
          console.error('Error:', error);
        },
      });
  }
  selectBalanceAction(action: string) {
    this.balanceAction = action;
  }
  approve_suspectBalance() {
    let body;
    if (
      this.balanceAction === 'suspect' &&
      !this.balanceActionForm.value.reason
    ) {
      this.dialogService.openToast({
        title: '',
        type: 'failed',
        message: 'Please put the reason why the balance is suspected',
      });
    } else if (
      this.balanceAction === 'valid' ||
      (this.balanceAction === 'suspect' && this.balanceActionForm.value.reason)
    ) {
      body = {
        confirm_type: this.balanceAction,
        balance_id: (this.institutionPicked as BalanceModel).id,
        password: this.balanceActionForm.value.password,
        reason: this.balanceActionForm.value.reason,
      };

      this.balanceActionDoing = true;
      this.balanceActionForm.disable();
      this.counterService
        .validateOrSuspetBalance(body)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({
          next: action => {
            this.balanceActionDoing = false;
            this.balanceActionForm.enable();
            this.balanceActionChecked = action.object;

            if (this.balanceActionChecked.success) {
              this.dialogService.openToast({
                title: '',
                type: 'success',
                message: this.balanceActionChecked.response_message,
              });
              this.closeAction_Balance.nativeElement.click();
            } else if (!this.balanceActionChecked.success) {
              this.dialogService.openToast({
                title: '',
                type: 'failed',
                message: this.balanceActionChecked.response_message,
              });
            }
            this.refreshPage();
          },
          error: (error: { object: BalanceActionModel }) => {
            this.balanceActionDoing = false;
            this.balanceActionForm.enable();
            let message;
            if (error.object.response_message) {
              message = error.object.response_message;
            } else {
              message = 'Error occured';
            }
            this.dialogService.openToast({
              title: '',
              type: 'failed',
              message: message,
            });
            this.refreshPage();
          },
        });
    }
  }

  clickOnAll(institution: BalanceModel) {
    if (!this.verifying && this.institutionPicked !== institution) {
      this.verifyBalance(institution);
    } else if (this.verifying && this.institutionPicked === institution) {
      this.closeVerification();
    }
  }
  onPaginationChange(pagination: PaginationConfig) {
    this.pagination = pagination;
    this.currentPage = pagination.filters.offset / pagination.filters.limit + 1;
    this.getTreasuryBalance('');
  }

  onSearchEnter(event: Event) {
    event.preventDefault();
    const searchValue = this.searchInput.value;
    this.getTreasuryBalance(searchValue ?? '');
  }
}
