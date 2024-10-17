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

import { DialogService } from '../../../core/services';
import { CommonModule } from '@angular/common';
import { AmountVisibilityComponent } from '../../../global/components/custom-field/amount-visibility/amount-visibility.component';

import { LookupComponent } from '../../../global/components/lookups/lookup/lookup.component';
import { WalletModel } from '../../wallet/wallet.models';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
} from '@angular/forms';

import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-client-wallet-list',
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
  templateUrl: './client-wallet-list.component.html',
  styleUrl: './client-wallet-list.component.scss',
})
export class ClientWalletListComponent implements OnInit, OnDestroy {
  isLoading = false;
  clientId!: number | null;
  walletsWorkStation: WalletModel[] | null = null;
  showAmounts = false;
  showAmounts$: Observable<boolean>; // Observable for the visibility state
  subAccountForm!: FormGroup;
  selectedWllet: WalletModel | null = null;
  selectedWalletTypeId: number | null = null;
  selectedAgencyId: number | null = null;
  selectedLoneWallet: WalletModel | null = null;
  showWallet = false;
  isLoadingCreation = false;
  private onDestroy$ = new Subject<void>();
  @ViewChild('walletCreated') walletCreated!: ElementRef;

  @Output() walletSelected = new EventEmitter<WalletModel>();
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
    this.getClientWallets();

    this.showAmounts$.subscribe(state => {
      this.showAmounts = state;
    });

    this.route.params.subscribe({
      next: data => {
        this.clientId = data['clientId'];
      },
    });
  }

  selectLoneAccount(wallets: WalletModel) {
    this.selectedLoneWallet = wallets;

    this.walletSelected.emit(wallets);
  }

  toggleAmountVisibility() {
    this.dialogService.displayAmount();
  }

  getClientWallets() {
    this.isLoading = true;
    this.clientService
      .getWallets(this.SelectedclientId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.walletsWorkStation = response.objects;
          this.isLoading = false;

          if (this.walletsWorkStation && this.walletsWorkStation.length > 0) {
            this.selectedLoneWallet = this.walletsWorkStation[0];
            this.walletSelected.emit(this.selectedLoneWallet);
            console.log('Selected Wallet:', this.selectedLoneWallet);
          }
        },
        error: err => {
          console.error('Erreur :', err);
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.selectedWllet = null;
  }
}
