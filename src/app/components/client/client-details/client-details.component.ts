import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ClientService,
  ConfigService,
  SettingsService,
} from '../../../core/services';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { ModeModel } from '../../../core/services/config/main-config.models';
import {
  ClientCorporateModel,
  ClientLanguageWorkstationModel,
  ClientWorkstationModel,
  IndividualClientModel,
  LanguageWorkstationModel,
} from '../client.model';
import { AccountsListModel } from '../../account/models';
import { WalletList } from '../../wallet/wallet.models';
import { MailModel } from '../../settings/settings.models';
import { ClientProfileInfoComponent } from '../client-profile-info/client-profile-info.component';
import { ClientGeneralInformationsComponent } from '../client-general-informations/client-general-informations.component';
import { ClientSensitiveInfoComponent } from '../client-sensitive-info/client-sensitive-info.component';
import { ClientContactsComponent } from '../client-contacts/client-contacts.component';

import { SelectedClientSmallOverviewComponent } from '../selected-client-small-overview/selected-client-small-overview.component';
import { ClientAccountListComponent } from '../client-account-list/client-account-list.component';
import { RouterOutlet } from '@angular/router';
import { ClientWalletListComponent } from '../client-wallet-list/client-wallet-list.component';

import { SignaturesComponent } from '../signatures/signatures.component';
import { ClientTaxInfoComponent } from '../client-tax-info/client-tax-info.component';
@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [
    NgClass,
    CommonModule,
    ClientProfileInfoComponent,
    ClientGeneralInformationsComponent,
    ClientSensitiveInfoComponent,
    SelectedClientSmallOverviewComponent,
    ClientContactsComponent,
    ClientAccountListComponent,
    ClientWalletListComponent,
    RouterOutlet,
    SignaturesComponent,
    ClientTaxInfoComponent,
  ],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.scss',
})
export class ClientDetailsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  @Input() walletOnly = false;
  @Input() walletClientId = '';

  theme$: Observable<ModeModel>;
  theme!: ModeModel;

  selectedMenu = 'details';
  selectedSetting = 'history';
  errorMessage = '';
  clientId: number | string = '';
  accountId = '';
  walletId = '';
  languageInput = new FormControl('');

  selectedAccount!: AccountsListModel[] | null;
  selectedWallet!: string | null;
  selectedClient!: ClientWorkstationModel | null;
  accounts!: AccountsListModel[];
  wallets!: WalletList[];
  selectedCategoryTypeId!: number;
  clientIndiv!: IndividualClientModel | null;
  clientEntreprise!: ClientCorporateModel | null;
  clientDetails!: ClientWorkstationModel;
  language!: { code: string; title: string };
  clientLanguage!: { language: string };
  id!: number | string;
  emails!: MailModel[];
  phoneNumbers!: MailModel[];

  hasAccountList = false;
  selectedGeneralInfo = true;
  selectedSensitiveInfo = false;
  selectedContactInfo = false;
  selectedTaxInfo = false;
  showUpdateForm = false;
  loadingData = true;
  isLoading = false;
  isLoadingInfo = false;
  loadingCategory = false;
  loadingLanguage = false;
  isSensitiveInfoFormShown = false;
  isGeneralInfoFormShown = false;
  isTaxAdditionShown = false;
  choosenAccount: AccountsListModel | AccountsListModel[] | null = null;
  choosenWallet: WalletList | WalletList[] | null = null;
  inputActive = false;
  loadingSector = false;
  showLanguageCheckBox = false;
  loading = false;
  selectedPersonalForm = false;
  selectedOtherInfoForm = false;
  selectedCreditSetting = false;
  selectedLanguage = false;
  selectedSect = false;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private configService: ConfigService,
    private router: Router,
    private settingService: SettingsService
  ) {
    this.theme$ = this.configService.getMode();
  }

  ngOnInit(): void {
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: theme => {
        this.theme = theme;
      },
    });

    if (this.walletOnly === false) {
      if (this.route.params) {
        this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe({
          next: data => {
            this.clientId = data['client_id'];
            this.getClientDetails(this.clientId as string);
            this.getClientAccounts();
            this.getWallets();
            this.getLanguage();
            this.getClientLanguage();
          },
        });
      }
    } else if (this.walletOnly === true) {
      this.getIndividualClientDetails(this.walletClientId);
    }
  }

  selectdAccount(account: AccountsListModel) {
    this.choosenAccount = account;

    //console.log('Compte sélectionné :', account);
  }
  handleAccountSelected(account: AccountsListModel) {
    this.choosenAccount = account;

    console.log('Compte sélectionné :', account);
  }

  handleWalletSelected(wallet: WalletList) {
    this.choosenWallet = wallet;

    console.log('Compte sélectionné :', wallet);
  }

  selectMenu(menu: string) {
    this.selectedMenu = menu;
    if (menu === 'accounts' && this.accounts) {
      this.router.navigate([
        '/w/workstation/d/desk/details/' +
          this.clientId +
          '/account/' +
          this.accounts[0]?.id,
      ]);
    }
    if (menu === 'wallets' && this.wallets) {
      this.router.navigate([
        '/w/workstation/d/desk/details/' +
          this.clientId +
          '/wallet/' +
          this.wallets[0]?.id,
      ]);
    }

    if (menu === 'settings') {
      this.router.navigate([
        '/w/workstation/d/desk/details/' + this.clientId + '/settings',
      ]);
    }
    if (
      menu === 'accounts' ||
      menu === 'details' ||
      menu === 'wallets' ||
      menu === 'settings'
    ) {
      this.selectedCreditSetting = false;
    }
  }

  walletEvent(wallets: WalletList[]) {
    this.wallets = wallets;
  }

  selectLanguage() {
    this.selectedLanguage = !this.selectedLanguage;
  }

  selectCreditSetting() {
    this.selectedCreditSetting = !this.selectedCreditSetting;
  }

  selectSetting(setting: string) {
    this.selectedSetting = setting;
    this.selectedWallet = null;
  }
  showGeneralInfoForm() {
    this.isGeneralInfoFormShown = !this.isGeneralInfoFormShown;
  }
  showSensitiveInfoForm() {
    this.isSensitiveInfoFormShown = !this.isSensitiveInfoFormShown;
  }
  showTaxAdditionForm() {
    this.isTaxAdditionShown = !this.isTaxAdditionShown;
  }

  selectAccount(account: AccountsListModel[]) {
    this.isLoading = true;
    this.selectedAccount = account;
    this.selectedSetting = '';
  }

  selectWallet(wallet: string) {
    this.isLoading = true;
    this.selectedWallet = wallet;
    this.selectedSetting = '';
  }

  closeDetails(isClosed: boolean) {
    if (isClosed) {
      this.selectedAccount = null;
      this.selectedWallet = null;
    }
  }
  selectGeneralInfo() {
    this.selectedGeneralInfo = !this.selectedGeneralInfo;
    if (this.selectedGeneralInfo) {
      this.selectedSensitiveInfo = false;
      this.selectedContactInfo = false;
      this.selectedTaxInfo = false;
      this.isSensitiveInfoFormShown = false;
      this.isTaxAdditionShown = false;
    }
  }
  selectSensitiveInfo() {
    this.selectedSensitiveInfo = !this.selectedSensitiveInfo;

    if (this.selectedSensitiveInfo) {
      this.selectedGeneralInfo = false;
      this.selectedContactInfo = false;
      this.selectedTaxInfo = false;
      this.isGeneralInfoFormShown = false;
      this.isTaxAdditionShown = false;
    }
  }

  selectContactInfo() {
    this.selectedContactInfo = !this.selectedContactInfo;
    if (this.selectedContactInfo) {
      this.selectedGeneralInfo = false;
      this.selectedSensitiveInfo = false;
      this.selectedTaxInfo = false;
      this.isGeneralInfoFormShown = false;
      this.isTaxAdditionShown = false;
      this.isSensitiveInfoFormShown = false;
    }
  }
  selectTaxInfo() {
    this.selectedTaxInfo = !this.selectedTaxInfo;
    if (this.selectedTaxInfo) {
      this.selectedGeneralInfo = false;
      this.selectedSensitiveInfo = false;
      this.selectedContactInfo = false;
      this.isGeneralInfoFormShown = false;
      this.isSensitiveInfoFormShown = false;
    }
  }

  toggleLanguage() {
    this.showLanguageCheckBox = !this.showLanguageCheckBox;
  }

  getSelectedClientDetails(client: ClientWorkstationModel) {
    this.selectedClient = client;

    if (
      client &&
      client?.client_type === 'I' &&
      client?.client_is_custom === false
    ) {
      this.getIndividualClientDetails(this.clientId as string);
    } else if (
      client &&
      client?.client_type === 'C' &&
      client?.client_is_custom === false
    ) {
      this.getCorporateClientDetails();
    }
  }

  getCorporateClientDetails() {
    this.clientService
      .getClientCorporateDetails(this.clientId as string)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (clientEntreprise: { object: ClientCorporateModel }) => {
          this.clientEntreprise = clientEntreprise.object;
        },
        error: error => {
          error = 'Data not Found';
          return error;
        },
      });
  }

  getIndividualClientDetails(client: string) {
    this.clientService
      .getClientIndividualDetails(client)

      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: clientIndiv => {
          this.clientIndiv = clientIndiv.object;
        },
        error: error => {
          error = 'Data not Found';
          return error;
        },
      });
  }

  changeClientLanguage() {
    this.loadingLanguage = true;
    const data = {
      language: this.languageInput.value,
    };

    this.clientService
      .modifyClientLanguage(
        this.clientId as string,
        this.languageInput.value as string,
        data
      )

      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: () => {
          this.getClientLanguage();
          this.loadingLanguage = false;
          this.showLanguageCheckBox = false;
        },
        error: error => {
          this.loadingLanguage = false;
          error = 'Data not Found';
          return error;
        },
      });
  }

  getLanguage() {
    this.clientService
      .getLanguages()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: { object: LanguageWorkstationModel }) => {
          this.language = data.object.response_data;
        },
      });
  }

  getClientLanguage() {
    this.clientService
      .getClientLanguage(this.clientId as string)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (clientLanguage: { object: ClientLanguageWorkstationModel }) => {
          this.clientLanguage = clientLanguage.object.response_data;
        },
      });
  }
  seeUpdates(updates: string) {
    if (updates === 'updated') {
      this.refresh();
    }
  }

  refresh() {
    this.isGeneralInfoFormShown = false;
    this.isSensitiveInfoFormShown = false;
    this.isTaxAdditionShown = false;

    this.selectedClient = null;
    this.getClientDetails(this.clientId as string);
    if (this.selectedMenu !== 'details') {
      this.selectedMenu = 'details';
    }

    if (this.clientIndiv) {
      this.clientIndiv = null;
      this.getIndividualClientDetails(this.clientId as string);
    }
    if (this.clientEntreprise) {
      this.clientEntreprise = null;
      this.getCorporateClientDetails();
    }
  }

  getClientDetails(client: ClientWorkstationModel | string) {
    this.clientService
      .getClientDetails(this.clientId as string)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: clientDetails => {
          this.clientDetails = clientDetails.object;
          this.selectedClient = client as ClientWorkstationModel;
          this.id = this.clientDetails.id;
          this.getSelectedClientDetails(this.clientDetails);
          this.getPhoneNumbers();
          this.getEmails();

          this.isLoading = false;
        },
        error: error => {
          this.isLoading = false;
          error = 'Data not found';
          return error;
        },
      });
  }

  getClientAccounts() {
    this.clientService
      .getClientAccounts(this.clientId as number)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: accounts => {
          this.isLoading = false;
          this.accounts = accounts.objects;
        },
        error: error => {
          this.isLoading = false;
          error = 'Error, please try again';
          return error;
        },
      });
  }

  getWallets() {
    this.clientService
      .getWallets(this.clientId as number)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: wallets => {
          this.wallets = wallets.objects;
        },
        error: error => {
          this.isLoading = false;
          error = 'No wallet Available';
          return error;
        },
      });
  }

  showUpdates(event: boolean) {
    this.inputActive = event;
    if (this.selectedMenu !== 'details') {
      this.selectMenu('details');
    }
  }

  setSelectedCategoryType(id: number) {
    this.selectedCategoryTypeId = id;
  }

  getEmails() {
    this.settingService
      .getClientContact(this.id as number, 'email')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.emails = response.objects;
        },
      });
  }

  getPhoneNumbers() {
    this.settingService
      .getClientContact(this.id as number, 'phoneNumber')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.phoneNumbers = response.objects;
        },
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
// function output(): (
//     target: ClientDetailsComponent,
//     propertyKey: 'updateOption'
// ) => void {
//     throw new Error('Function not implemented.');
// }
