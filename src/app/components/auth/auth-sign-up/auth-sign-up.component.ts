import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PasswordFieldComponent } from '../../../global/password-field/password-field.component';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services';
// interface EmailVerificationResponse {
//     success: boolean;
//     message: string;
//     // Add any other relevant properties
//   }
@Component({
  selector: 'app-auth-sign-up',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    PasswordFieldComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './auth-sign-up.component.html',
  styleUrl: './auth-sign-up.component.scss',
})
export class AuthSignUpComponent {
  step = 0;
  submitted = false;
  isLoadingCreation = false;

  //   firstName!: string;
  //   lastName!: string;
  //   Email!: string;
  //   Profile!: string;

  //   EmailVerificationloader=false;
  //   phoneNumberVerificationLoader=false;

  //   userInfo: any = [];
  //   phoneNumberData:any;
  //   emailData:any;

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
    private authService: AuthService
  ) {}

  multiStepForm = this.fb.group({
    authentificationInformation: this.fb.group({
      picture: ['', Validators.required],
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
  createAccount() {
    this.isLoadingCreation = true;

    //   const data: any = {
    //       // creation_client: this.id,
    //       // organization: this.bankId,

    //       // picture: this.selectedImage,
    //       email: this.multiStepForm.controls.authentificationInformation.value
    //           .email,
    //       username:
    //           this.multiStepForm.controls.authentificationInformation.value
    //               .username,
    //       password:
    //           this.multiStepForm.controls.authentificationInformation.value
    //               .password,
    //       password2:
    //           this.multiStepForm.controls.authentificationInformation.value
    //               .confirmPassword,
    //       firstname: this.multiStepForm.controls.personalInformation.value.fname,
    //       lastname: this.multiStepForm.controls.personalInformation.value.lname,
    //       birthday:
    //           this.multiStepForm.controls.personalInformation.value.birthday,
    //       // birth_place:
    //       //     this.multistep.controls.personalInformation.value.birthPlace,
    //       sex: this.multiStepForm.controls.personalInformation.value.gender,
    //       marital_status:
    //           this.multiStepForm.controls.personalInformation.value.martialStatus,
    //       telephones:
    //           this.multiStepForm.controls.authentificationInformation.value
    //               .number,
    //       card_id: {
    //           card_id_type:
    //               this.multiStepForm.controls.cardInformation.value.cardType,
    //           other_card_type: '',
    //           reference_number:
    //               this.multiStepForm.controls.cardInformation.value.cardIdNumber,
    //           place_of_issue:
    //               this.multiStepForm.controls.cardInformation.value.deliveryPlace,
    //           date_of_issue:
    //               this.multiStepForm.controls.cardInformation.value.deliveryDate,
    //       },
    //       card_id_picture_recto: '',
    //       card_id_picture_verso: '',
    //       father_name: '',
    //       mother_name: '',
    //   };
    //   if (this.multiStepForm.controls.cardInformation.value.expiryDate !== '') {
    //       data.card_id['expiry_date'] =
    //           this.multiStepForm.controls.cardInformation.value.expiryDate;
    //   }

    //   this.authService.createAccount(data).subscribe({
    //       next: (response) => {
    //           this.isLoadingCreation = false;
    //           this.userInfo = response;
    //           this.step = this.step = 5;
    //       },
    //       error: (error) => {
    //           this.isLoadingCreation = false;
    //           const data = {
    //               title: '',
    //               type: 'failed',
    //               message: 'Something went wrong, please retry again!',
    //           };

    //       },
    //   });
  }

  // getClientInfo() {
  //   this.firstName = this.multiStepForm.controls.personalInformation?.value?.fname || '';
  //   this.lastName = this.multiStepForm.controls.personalInformation?.value?.lname || '';
  //   this.Email = this.multiStepForm.controls.authentificationInformation?.value?.email || '';
  //   this.Profile = this.multiStepForm.controls.authentificationInformation?.value?.picture || '';
  // }

  // PhoneNumberVerification() {
  //     this.phoneNumberVerificationLoader = true;
  //     const tel =
  //         this.multiStepForm.controls.authentificationInformation?.value?.number || '';
  //     this.authService.verifyPhoneNumber(tel).subscribe({
  //         next: (data) => {
  //             this.phoneNumberData = data;
  //             this.phoneNumberVerificationLoader = false;
  //         },
  //         error: (error) => {
  //             error;
  //         },
  //     });
  // }

  // emailData: EmailVerificationResponse | null = null;

  // EmailVerification() {
  //   this.EmailVerificationloader = true;
  //   const email =
  //     this.multiStepForm.controls.authentificationInformation?.value?.email || '';
  //   this.authService.verifyEmail(email).subscribe({
  //     next: (data: EmailVerificationResponse) => {
  //       this.emailData = data;
  //       this.EmailVerificationloader = false;
  //     },
  //     error: (error) => {
  //       this.EmailVerificationloader = false;
  //       console.error(error);
  //     },
  //   });
  // }
}
