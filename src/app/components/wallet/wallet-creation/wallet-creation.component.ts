import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../core/services';
import {
  CreatWalletBodyModel,
  creatWalletResponse,
  WalletTypModel,
} from '../wallet.models';
import { DialogService } from '../../../core/services';
@Component({
  selector: 'app-wallet-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './wallet-creation.component.html',
  styleUrl: './wallet-creation.component.scss',
})
export class WalletCreationComponent implements OnInit {
  walletForm!: FormGroup;
  isLoading = false;
  walletsTypeData: WalletTypModel[] | [] | null = null;
  constructor(
    private clientService: ClientService,
    private dialogService: DialogService
  ) {
    this.walletForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      category: new FormControl('', Validators.required),
      pin: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.maxLength(4),
      ]),
    });
  }

  ngOnInit(): void {
    this.getWalletType();
  }

  getWalletType() {
    this.isLoading = true;
    this.clientService.getWalletType().subscribe({
      next: response => {
        this.walletsTypeData = response.objects;
        this.isLoading = false;
      },
      error: err => {
        console.error('Erreur :', err);
        this.isLoading = false;
      },
    });
  }

  onSubmit() {
    if (this.walletForm.valid) {
      console.log(this.walletForm.value);
      this.creatWallet();
    } else {
      console.log('Form is invalid');
    }
  }

  creatWallet() {
    this.dialogService.dispatchLoading();
    const selectedCategoryId = this.walletForm.get('category')?.value;
    // this.loading = true;

    const body: CreatWalletBodyModel = {
      wallet_type: selectedCategoryId,
      title: this.walletForm.get('name')?.value,
    };

    this.clientService.creatWallet(body).subscribe({
      next: (response: creatWalletResponse) => {
        //this.loading = false;
        this.dialogService.closeLoading();
        if (response.object.success) {
          this.dialogService.openToast({
            type: 'success',
            title: 'Succès',
            message: response.object.response_message,
          });
          this.walletForm.reset();
        } else {
          this.dialogService.openToast({
            type: 'failed',
            title: 'Échec',
            message: response.object.response_message,
          });
        }
      },
      error: error => {
        console.error('creation  failed', error);
        this.dialogService.closeLoading();
        this.dialogService.openToast({
          type: 'failed',
          title: 'Échec',
          message: 'failed please try again',
        });
      },
    });
  }
}
