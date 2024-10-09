import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  OnDestroy,
  Input,
} from '@angular/core';

import { ClientService } from '../../../core/services';
import { Observable, Subject, takeUntil } from 'rxjs';

import { AccountsListModel } from '../../account/models';

import { DialogService } from '../../../core/services';
import { CommonModule } from '@angular/common';
import { AmountVisibilityComponent } from '../../../global/components/custom-field/amount-visibility/amount-visibility.component';

import { LookupComponent } from '../../../global/components/lookups/lookup/lookup.component';

import { ItemModel } from '../../../global/components/lookups/lookup/lookup.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
} from '@angular/forms';

import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-client-account-list',
  standalone: true,
  imports: [
    CommonModule,
    AmountVisibilityComponent,
    LookupComponent,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './client-account-list.component.html',
  styleUrl: './client-account-list.component.scss',
})
export class ClientAccountListComponent implements OnInit, OnDestroy {
  isLoading = false;
  clientId!: number | null;
  accountsWorkStation: AccountsListModel[] | null = null;
  showAmounts = false;
  showAmounts$: Observable<boolean>; // Observable for the visibility state
  subAccountForm!: FormGroup;
  selectedAccount: AccountsListModel | null = null;
  selectedAccountTypeId: number | null = null;
  selectedAgencyId: number | null = null;
  selectedLoneAccount!: AccountsListModel;
  showAccount = false;
  isLoadingCreation = false;
  private onDestroy$ = new Subject<void>();
  @ViewChild('accountCreated') accountCreated!: ElementRef;

  @Output() accountSelected = new EventEmitter<AccountsListModel>();
  @Input() SelectedclientId: number | string = '';
  constructor(
    private clientService: ClientService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.showAmounts$ = this.dialogService.getAmountState();

    this.subAccountForm = this.fb.group({
      title: new FormControl(''),
      sync: new FormControl(false),
    });
  }

  ngOnInit(): void {
    this.getClientAccounts();

    this.showAmounts$.subscribe(state => {
      this.showAmounts = state;
    });

    this.route.params.subscribe({
      next: data => {
        this.clientId = data['clientId'];
      },
    });
  }

  getClientAccounts() {
    this.isLoading = true;
    this.clientService
      .getClientAccounts(this.SelectedclientId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.accountsWorkStation = response.objects;
          this.isLoading = false;

          if (this.accountsWorkStation && this.accountsWorkStation.length > 0) {
            this.selectedLoneAccount = this.accountsWorkStation[0];
            this.accountSelected.emit(this.selectedLoneAccount);
          }
        },
        error: err => {
          console.error('Erreur :', err);
          this.isLoading = false;
        },
      });
  }

  selectLoneAccount(account: AccountsListModel) {
    this.selectedLoneAccount = account;

    this.accountSelected.emit(account);
  }

  toggleAmountVisibility() {
    this.dialogService.displayAmount();
  }

  closeDialog() {
    this.selectedAccountTypeId = null;
    this.selectedAgencyId = null;
    // this.subAccountForm.reset();
  }
  setSelectedAccountType($event: ItemModel | null) {
    this.selectedAccountTypeId = $event ? $event.id : null;
  }
  setSelectedAgency($event: ItemModel | null) {
    this.selectedAgencyId = $event ? $event.id : null;
  }

  createAccount() {
    this.dialogService.dispatchLoading();

    this.isLoadingCreation = true;
    const branch = this.selectedAgencyId;
    const client = this.SelectedclientId;
    const account_type = this.selectedAccountTypeId;
    const sync = this.subAccountForm.value.sync;
    const acc_title = this.subAccountForm.value.title;
    this.clientService
      .createAccount(branch, client, account_type, sync, acc_title)
      .subscribe({
        next: response => {
          this.isLoadingCreation = false;
          this.dialogService.closeLoading();
          if (response.object.success) {
            this.isLoadingCreation = false;
            this.dialogService.openToast({
              type: 'success',
              title: 'Succès',
              message: response.object.response_message ?? 'Success',
            });

            this.selectedAccountTypeId = null;
            this.selectedAgencyId = null;
            this.subAccountForm.reset();
            this.clientId = null;
            this.closeDialog();
            this.accountCreated.nativeElement.click();
            this.accountsWorkStation = null;
            this.getClientAccounts();
          } else {
            this.dialogService.openToast({
              type: 'failed',
              title: 'Échec',
              message: response.object.response_message ?? 'Failed',
            });
          }
        },
        error: () => {
          this.isLoadingCreation = false;
          //  console.error('creation  failed');
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            type: 'failed',
            title: 'Échec',
            message: 'failed please try again',
          });
        },
      });
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
