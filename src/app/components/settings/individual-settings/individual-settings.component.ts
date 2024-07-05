import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { SettingsService } from '../../../core/services/settings/settings.service';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-individual-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './individual-settings.component.html',
  styleUrls: ['./individual-settings.component.scss'],
})
export class IndividualSettingsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  formPin!: FormGroup;
  formPassword!: FormGroup;
  passwordType = 'password';
  pinType = 'password';
  showPassword = false;
  showPin = false;
  isLoadingNewPin!: boolean;
  isLoadingNewPassword!: boolean;
  selectedsubmenu = '';
  pinMatch = true;
  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    // Initialisez votre composant ici

    this.formPin = new FormGroup({
      oldPin: new FormControl('', Validators.required),
      newPin: new FormControl('', Validators.required),
      confirmNewPin: new FormControl('', Validators.required),
      agreementPin: new FormControl('', Validators.required),
    });
  }

  changePinType() {
    if (!this.showPin) {
      this.showPin = true;
      this.pinType = 'text';
    } else {
      this.showPin = false;
      this.pinType = 'password';
    }
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
  resetPin() {
    this.formPin.reset();
  }

  // modifyPin() {
  //   this.isLoadingNewPin = true;
  //   const data = {
  //       old_pin: this.formPin.value.oldPin,
  //       new_pin: this.formPin.value.newPin,
  //       new_pin2: this.formPin.value.confirmNewPin,
  //   };
  //   this.pinMatch = this.confirmEqualPin(data.new_pin!, data.new_pin2!);
  //   if (!this.pinMatch) {
  //       setTimeout(() => {
  //           this.pinMatch = true;
  //       }, 3000);
  //       this.isLoadingNewPin = false;
  //       return;
  //   }

  //   this.settingsService
  //   .changePin(data)
  //   .pipe(takeUntil(this.onDestroy$))
  //   .subscribe({
  //   next: (response: any) => {
  //   this.isLoadingNewPin = false;
  //   this.formPin.reset();
  //   // Ici, vous pouvez gérer la réponse et ouvrir un dialogue avec votre service de dialogue personnalisé
  //   if (response.object.success) {
  //   // Logique pour le succès
  //   } else {
  //   // Logique pour l'échec
  //   }
  //   },
  //   error: (error) => {
  //   this.isLoadingNewPin = false;
  //   this.formPin.reset();
  //   // Ici, vous pouvez gérer l'erreur et ouvrir un dialogue avec votre service de dialogue personnalisé
  //   },
  //   });
  // }

  // modifyPassword() {
  //   this.isLoadingNewPassword = true;
  //   const data = {
  //     old_password: this.formPassword.value.oldPassword,
  //             new_password: this.formPassword.value.newPassword,
  //             new_password2: this.formPassword.value.confirmNewPassword,
  //   };
  //   this.pinMatch = this.confirmEqualPassword(data.new_password!, data.new_password2!);
  //   if (!this.pinMatch) {
  //       setTimeout(() => {
  //           this.pinMatch = true;
  //       }, 3000);
  //       this.isLoadingNewPassword = false;
  //       return;
  //   }

  //   this.settingsService
  //   .changePassword(data)
  //   .pipe(takeUntil(this.onDestroy$))
  //   .subscribe({
  //   next: (response: any) => {
  //   this.isLoadingNewPassword = false;
  //   this.formPassword.reset();

  //   if (response.object.success) {

  //   } else {

  //   }
  //   },
  //   error: (error) => {
  //   this.isLoadingNewPassword = false;
  //   this.formPassword.reset();

  //   },
  //   });
  // }

  private confirmEqualPin(new_pin: string, new_pin2: string) {
    if (new_pin !== new_pin2) {
      return false;
    }
    return true;
  }

  private confirmEqualPassword(new_password: string, new_password2: string) {
    if (new_password !== new_password2) {
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
