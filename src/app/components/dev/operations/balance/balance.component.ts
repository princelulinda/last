import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LookupComponent } from '../../../../global/components/lookups/lookup/lookup.component';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { PaginationConfig } from '../../../../global/models/pagination.models';
import { CounterService } from '../../../../core/services/counter/counter.service';
import { DialogService } from '../../../../core/services';
import { DialogResponseModel } from '../../../../core/services/dialog/dialogs-models';
import { BalanceActionModel, BalanceModel } from './balance.model';
import { ItemModel } from '../../../../global/components/lookups/lookup/lookup.model';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LookupComponent,
    SkeletonComponent,
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
  alias!: ItemModel | null;
  institution_balance!: BalanceModel[] | null;
  verifying = false;
  balanceActionDoing = false;
  reloading = true;
  institutionPicked!: BalanceModel | null;

  search = new FormControl('');
  pagination = new PaginationConfig();
  canMoveToPrev = false;
  canMoveToNext = true;
  currentPage = 0;
  count!: number;

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
    this.getTreasuryBalance();
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
  }
  putPassword() {
    this.dialogService.openDialog({
      title: '',
      type: 'password',
      message: 'Put your password to confirm',
      action: 'put',
    });
  }
  getLedgerAlias(alias: ItemModel | null) {
    this.alias = alias;
  }
  getTreasuryBalance() {
    this.reloading = true;
    this.institution_balance = null;

    this.pagination.filters.limit = 15;
    const searchValue = this.search.value ?? '';
    if (searchValue !== '') {
      // reset offset when we search
      if (this.pagination?.filters.offset ?? 0 >= 1) {
        this.pagination.filters.offset = 0;
        this.currentPage = 0;
      }
    }

    this.counterService
      .getTreasuryBalanceList(searchValue, this.pagination)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: balance => {
          this.reloading = false;
          this.institution_balance = balance.objects;
          this.count = balance.count;
        },
      });
  }
  refreshPage() {
    this.search.setValue('');
    this.institution_balance = null;
    this.getTreasuryBalance();
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
      institution: (this.alias as ItemModel).id,
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
          this.getTreasuryBalance();
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
          this.getTreasuryBalance();
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

  doListMove(action: string) {
    if (action === 'next') {
      this.currentPage += 1;
    } else {
      this.currentPage -= 1;
    }

    // condition just for typescript
    if (this.pagination.filters.limit) {
      this.pagination.filters.offset =
        this.pagination.filters.limit * this.currentPage;
      this.getTreasuryBalance();
    }
  }
  clickOnAll(institution: BalanceModel) {
    if (!this.verifying && this.institutionPicked !== institution) {
      this.verifyBalance(institution);
    } else if (this.verifying && this.institutionPicked === institution) {
      this.closeVerification();
    }
  }
}
