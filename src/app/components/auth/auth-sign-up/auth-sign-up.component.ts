import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PasswordFieldComponent } from '../../../global/components/custom-field/password-field/password-field.component';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services';
import { DialogService } from '../../../core/services';
import { Subject, Observable } from 'rxjs';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { LookupComponent } from '../../dev/lookup/lookup.component';
import {
  EmailVerificationResponse,
  phoneNumberVerificaitonResponse,
  createAccountResponse,
  bankListResponse,
  cardIdData,
} from '../auth.model';
import { FileComponent } from '../../../global/components/file/file.component';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';
import { UploadedFileModel } from '../auth.model';
import { BankService } from '../../../core/services/bank/bank.service';
import { DbService } from '../../../core/db/db.service';
import { ItemModel } from '../../dev/lookup/lookup.model';

@Component({
  selector: 'app-auth-sign-up',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    PasswordFieldComponent,
    ReactiveFormsModule,
    FileComponent,
    SkeletonComponent,
    LookupComponent,
  ],
  templateUrl: './auth-sign-up.component.html',
  styleUrl: './auth-sign-up.component.scss',
})
export class AuthSignUpComponent implements OnInit {
  onDestroy$: Subject<void> = new Subject<void>();
  step = 0;
  submitted = false;
  isLoadingCreation!: boolean;
  firstName!: string;
  lastName!: string;
  Email!: string;
  Profile!: string;
  EmailVerificationloader = false;
  phoneNumberVerificationLoader = false;
  isLoadingBank = false;
  // file: bankListResponse[] | [] | null = null;
  getBanksList: bankListResponse[] | [] | null = null;
  emailToVerify!: EmailVerificationResponse;
  phoneNumberToVerify!: phoneNumberVerificaitonResponse;
  showPassword = false;
  passwordType = 'password';
  arePasswordsMatch = false;
  isMatchNumber!: boolean;
  isMatchEmail!: boolean;
  isMatchConfirmPassword!: boolean;
  isNotMatchPassword!: boolean;
  inputNumber!: string;
  inputconfirmPassword!: string;
  inputEmail!: string;
  inputPassword!: string;
  bankId: number | null = null;
  selectedBankIndex: number | null = null;
  i!: number;
  dialog$: Observable<DialogResponseModel>;
  uuid!: string;
  docFile!: string;
  id!: number;

  // event!: referenceNumberModel[];

  ngOnInit(): void {
    this.dialog$.subscribe({
      next: (status: DialogResponseModel) => {
        if (
          status.action === 'confirmation' &&
          status.response.confirmation === 'YES'
        ) {
          this.createAccount();
        } else {
          this.selectedBankIndex = null;
          this.bankId = null;
        }
      },
    });
  }

  submit() {
    this.submitted = true;
    if (this.step === 5) {
      this.createAccount();
    }
    this.step = this.step + 1;
  }

  previous() {
    this.step = this.step - 1;
  }
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private bankService: BankService,
    private dialogService: DialogService,
    private dbService: DbService
  ) {
    this.dialog$ = this.dialogService.getDialogState();
  }

  multiStepForm = this.fb.group({
    authentificationInformation: this.fb.group({
      write_picture: ['', Validators.required],
      number: [''],
      username: ['', Validators.required],
      email: [''],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }),

    personalInformation: this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      gender: ['', Validators.required],
      martialStatus: ['', Validators.required],
      birthday: ['', Validators.required],
      // birthPlace: ['', Validators.required],
    }),

    cardInformation: this.fb.group({
      cardIdNumber: ['', Validators.required],
      deliveryPlace: ['', Validators.required],
      deliveryDate: ['', Validators.required],
      cardType: ['', Validators.required],
      expiryDate: [''],
    }),
  });
  userInfo!: createAccountResponse;
  // expiry_date!:string | null | undefined;
  createAccount() {
    this.isLoadingCreation = true;
    const data = {
      creation_client: this.id,
      organization: this.bankId,
      picture: '',
      write_picture:
        this.multiStepForm.controls.authentificationInformation.value
          .write_picture,
      email:
        this.multiStepForm.controls.authentificationInformation.value.email,
      username:
        this.multiStepForm.controls.authentificationInformation.value.username,
      password:
        this.multiStepForm.controls.authentificationInformation.value.password,
      password2:
        this.multiStepForm.controls.authentificationInformation.value
          .confirmPassword,
      firstname: this.multiStepForm.controls.personalInformation.value.fname,
      lastname: this.multiStepForm.controls.personalInformation.value.lname,
      birthday: this.multiStepForm.controls.personalInformation.value.birthday,
      // birth_place:
      //     this.multistep.controls.personalInformation.value.birthPlace,
      sex: this.multiStepForm.controls.personalInformation.value.gender,
      marital_status:
        this.multiStepForm.controls.personalInformation.value.martialStatus,
      telephones:
        this.multiStepForm.controls.authentificationInformation.value.number,
      card_id: {
        card_id_type:
          this.multiStepForm.controls.cardInformation.value.cardType,
        other_card_type: '',
        reference_number:
          this.multiStepForm.controls.cardInformation.value.cardIdNumber,
        place_of_issue:
          this.multiStepForm.controls.cardInformation.value.deliveryPlace,
        date_of_issue:
          this.multiStepForm.controls.cardInformation.value.deliveryDate,
      },
      card_id_picture_recto: '',
      card_id_picture_verso: '',
      father_name: '',
      mother_name: '',
    };
    if (this.multiStepForm.controls.cardInformation.value.expiryDate !== '') {
      (data.card_id as unknown as cardIdData).expiry_date =
        this.multiStepForm.controls.cardInformation.value.expiryDate;
    }

    this.dialogService.dispatchLoading();
    this.authService.createAccount(data).subscribe({
      next: (response: createAccountResponse) => {
        this.isLoadingCreation = false;
        this.userInfo = response;
        const userData = {
          // username: response.object.user.username,
          // email: response.object.user.email,
          token: response.object.user.token,
          clientId: response.object.client.client_id,
        };
        this.dbService.setLocalStorageUserToken(userData.token);
        this.dbService.setLocalStorageClientId(userData.clientId);
        this.step = this.step = 5;
        this.dialogService.closeLoading();
      },
      error: error => {
        this.isLoadingCreation = false;
        this.dialogService.closeLoading();
        this.dialogService.openToast({
          type: 'failed',
          title: 'Échec',
          message:
            error?.object?.response_message ??
            $localize`Something went wrong please retry again !`,
        });
      },
    });
  }

  getClientInfo() {
    this.firstName =
      this.multiStepForm.controls.personalInformation.value.fname || '';
    this.lastName =
      this.multiStepForm.controls.personalInformation.value.lname || '';
    this.Email =
      this.multiStepForm.controls.authentificationInformation.value.email || '';
    this.Profile =
      this.multiStepForm.controls.authentificationInformation.value
        .write_picture || '';
  }

  EmailVerification() {
    this.EmailVerificationloader = true;
    const email =
      this.multiStepForm.controls.authentificationInformation?.value?.email ||
      '';
    this.authService.verifyEmail(email).subscribe({
      next: (response: EmailVerificationResponse) => {
        this.EmailVerificationloader = false;
        this.emailToVerify = response;
      },
      error: (error: Error) =>
        console.error('Erreur lors de la récupération de email:', error),
    });
  }

  phoneNumverVerification() {
    this.phoneNumberVerificationLoader = true;
    const tel =
      this.multiStepForm.controls.authentificationInformation?.value?.number ||
      '';
    this.authService.verifyPhoneNumber(tel).subscribe({
      next: (response: phoneNumberVerificaitonResponse) => {
        this.phoneNumberVerificationLoader = false;
        this.phoneNumberToVerify = response;
        console.log('Données sélectionnées', this.phoneNumberToVerify);
      },
      error: (error: Error) =>
        console.error('Erreur lors de la récupération de email:', error),
    });
  }
  getBankList() {
    this.isLoadingBank = true;
    this.bankService.getAllBanks().subscribe({
      next: (response: { objects: bankListResponse[] }) => {
        this.getBanksList = response.objects;
        this.isLoadingBank = false;
      },
      error: (error: Error) =>
        console.error('Erreur lors de la récupération des banks:', error),
    });
  }

  changePasswordType() {
    if (!this.showPassword) {
      this.showPassword = true;
      this.passwordType = 'text';
    } else {
      this.showPassword = false;
      this.passwordType = 'password';
    }
  }
  checkPasswordSimilarity() {
    if (
      this.multiStepForm.controls.authentificationInformation.value.password !==
      this.multiStepForm.controls.authentificationInformation.value
        .confirmPassword
    ) {
      this.arePasswordsMatch = false;
    } else {
      this.arePasswordsMatch = true;
    }
  }
  checkNumber() {
    const pattern = /[0-9]+/;
    this.isMatchNumber = !pattern.test(this.inputNumber);
  }
  checkEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isMatchEmail = !emailPattern.test(this.inputEmail);
  }
  isAllInputValueUndefined(): boolean {
    return this.inputEmail === undefined && this.inputNumber === undefined;
  }
  selectedBankId(bank: { organization_id: number }) {
    this.bankId = bank.organization_id;
    console.log(this.bankId);
  }
  onPasswordChange(password: string) {
    this.multiStepForm.controls.authentificationInformation.patchValue({
      password,
    });
  }

  onPictureChange(write_picture: UploadedFileModel[]) {
    this.uuid = write_picture[0]?.object.uuid;
    this.docFile = write_picture[0]?.object.docfile;
    this.multiStepForm.controls.authentificationInformation.patchValue({
      write_picture: this.uuid,
    });
  }

  openPinPopup() {
    this.dialogService.openDialog({
      action: 'confirmation',
      message: 'Do you want to create an account in this organization ?',
      title: '',
      type: 'confirm',
    });
  }
  selectClient(event: ItemModel | null) {
    if (event) {
      this.id = event.id;
    }
  }
  logout() {
    this.authService.logout();
  }
}
