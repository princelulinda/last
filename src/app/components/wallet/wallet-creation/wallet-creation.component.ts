import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService, ConfigService } from '../../../core/services';
import {
  CreatWalletBodyModel,
  creatWalletResponse,
  WalletTypModel,
} from '../wallet.models';
import { DialogService } from '../../../core/services';
import { activeMainConfigModel } from '../../../core/services/config/main-config.models';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-wallet-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './wallet-creation.component.html',
  styleUrl: './wallet-creation.component.scss',
})
export class WalletCreationComponent implements OnInit {
  activePlatform: string | null = null;
  mainConfig$!: Observable<activeMainConfigModel>;
  walletForm!: FormGroup;
  isLoading = false;
  walletsTypeData: WalletTypModel[] | [] | null = null;
  constructor(
    private clientService: ClientService,
    private dialogService: DialogService,
    private configService: ConfigService
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
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
    this.mainConfig$.subscribe({
      next: configs => {
        this.activePlatform = configs.activePlateform;
      },
    });
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
