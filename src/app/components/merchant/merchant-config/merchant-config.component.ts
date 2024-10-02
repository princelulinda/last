import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Observable, Subject, takeUntil } from 'rxjs';

import {
  MerchantModel,
  tellerModel,
  tellerObjectModel,
  tellersModel,
} from '../merchant.models';
import { ItemModel } from '../../../global/components/lookups/lookup/lookup.model';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';
import { MerchantService } from '../../../core/services/merchant/merchant.service';
import { DialogService } from '../../../core/services';
import { LookupComponent } from '../../../global/components/lookups/lookup/lookup.component';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { MerchantTellerDetailsComponent } from './merchant-teller-details/merchant-teller-details.component';

@Component({
  selector: 'app-merchant-config',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonComponent,
    ReactiveFormsModule,
    LookupComponent,
    MerchantTellerDetailsComponent,
    RouterModule,
  ],
  templateUrl: './merchant-config.component.html',
  styleUrl: './merchant-config.component.scss',
})
export class MerchantConfigComponent implements OnInit {
  merchantInfo!: MerchantModel;
  tellers: tellerObjectModel[] = [];
  get_tellers!: boolean;
  dialogState$!: Observable<DialogResponseModel>;
  dialog!: DialogResponseModel;
  isActionDone = false;
  selectedTeller!: tellerObjectModel;
  get_selectedTeller!: boolean;
  tellerId = '';
  isLoading = false;
  isTellerLoading = false;
  tellerCreationDone = false;
  selected = '';
  acceptSimplePayment = false;
  acceptCart = false;
  incognito = false;
  onDestroy$: Subject<void> = new Subject<void>();
  search = new FormControl('');

  @ViewChild('closeModal', { static: false })
  closeModal!: ElementRef<HTMLElement>;

  client: ItemModel | null = null;
  isCheck = true;
  merchantConfigForm: FormGroup;
  newTellerForm: FormGroup;
  action: string[] = [];
  selecteMerchant!: string;
  isTellersSearch = false;
  plateform = '';
  plateform$: Observable<string> = new Observable<string>();
  merchantLogo!: string;
  previewImage!: string | ArrayBuffer | null | undefined;
  category!: string;
  pin!: string;
  get_merchantDetails = false;
  constructor(
    private merchantService: MerchantService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.dialogState$ = this.dialogService.getDialogState();
    this.merchantConfigForm = new FormGroup({
      name: new FormControl(''),
      slug: new FormControl(''),
      plug: new FormControl(''),
      simplePayment: new FormControl(false),
      cart: new FormControl(false),
      incognito: new FormControl(false),
      category: new FormControl(''),
    });

    this.newTellerForm = new FormGroup({
      isChecked: new FormControl(false),
      client: new FormControl('', Validators.required),
      alias: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.getConnectedMerchantInfo();
    this.cdr.detectChanges();

    this.dialogState$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (dialogResponse: DialogResponseModel) => {
        if (dialogResponse.action === 'update' && dialogResponse.response.pin) {
          this.pin = dialogResponse.response.pin;
          this.updateMerchantDetails();
        }
      },
    });

    this.merchantConfigForm.patchValue({
      name: this.merchantInfo?.merchant_title,
      simplePayment: this.merchantInfo?.accepts_simple_payment,
      cart: this.merchantInfo?.accepts_cart,
      incognito: this.merchantInfo?.visible,
      slug: this.merchantInfo?.slug,
      plug: this.merchantInfo?.api_plug_name,
    });

    this.plateform$.subscribe((plateform: string) => {
      this.plateform = plateform;
    });
  }

  getConnectedMerchantInfo() {
    this.get_merchantDetails = false;
    this.merchantService.getConnectedMerchantInfo().subscribe({
      next: response => {
        this.merchantInfo = response.object.response_data;

        this.getTellersByMerchant();

        this.merchantConfigForm.patchValue({
          name: this.merchantInfo.merchant_title,
          simplePayment: this.merchantInfo.accepts_simple_payment,
          slug: this.merchantInfo.slug,
          cart: this.merchantInfo.accepts_cart,
          incognito: this.merchantInfo.client_visibility_activated,
        });
        this.get_merchantDetails = true;
      },
      error: () => {
        // TODO :: CODE
        this.dialogService.openToast({
          type: 'failed',
          title: '',
          message: 'failed to get a merchant details',
        });
      },
    });
  }

  getTellersByMerchant() {
    this.get_tellers = false;
    this.merchantService.getTellersByMerchant(this.merchantInfo.id).subscribe({
      next: (tellers: tellersModel) => {
        this.get_tellers = true;
        this.tellers = tellers.objects;
      },
      error: () => {
        // TODO :: CODE
        this.dialogService.openToast({
          type: 'failed',
          title: '',
          message: 'failed to get a teller',
        });
      },
    });
  }

  displayTellerInfo(teller: tellerObjectModel) {
    this.get_selectedTeller = false;
    this.tellerId = teller.id;
    this.getTellerDetails();
  }

  getTellerDetails() {
    this.isActionDone = false;
    this.get_selectedTeller = false;
    this.merchantService
      .getMerchantsTellersDetails(this.tellerId)
      .subscribe((data: tellerModel) => {
        this.get_selectedTeller = true;
        this.selectedTeller = data.object;
      });
  }

  getClientInfo(event: ItemModel | null = null) {
    this.client = event;

    this.newTellerForm.patchValue({
      client: this.client?.id,
    });
  }

  createNewTeller() {
    this.isTellerLoading = true;

    const body = {
      client: this.client?.id,
      merchant: this.merchantInfo.id,
      can_receive_notifications: this.newTellerForm.value.isChecked,
      alias: this.newTellerForm.value.alias,
    };
    this.merchantService.createNewTeller(body).subscribe({
      next: (response: tellerModel) => {
        this.isTellerLoading = false;
        this.dialogService.closeLoading();
        if (response.object.success === false) {
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message:
              response.object.response_message ?? 'Failed to create a Teller',
          });
        } else {
          this.getTellersByMerchant();

          this.dialogService.openToast({
            title: '',
            type: 'success',
            message: response.object.response_message ?? 'Teller created',
          });

          this.closeModal.nativeElement.click();
        }
      },

      error: err => {
        this.isTellerLoading = false;
        this.dialogService.closeLoading();
        this.dialogService.openToast({
          type: 'failed',
          title: '',
          message:
            err.error.object.response_message ??
            'failed to create a new teller',
        });
      },
    });
  }

  toggleModal() {
    this.tellerCreationDone = false;

    setTimeout(() => {
      this.tellerCreationDone = true;
      this.newTellerForm.patchValue({
        client: '',
        isChecked: false,
        alias: '',
      });
    }, 50);
  }

  getTellerOptions(event: boolean) {
    this.isActionDone = event;

    this.getTellerDetails();
  }

  updateMerchantDetails() {
    this.dialogService.dispatchLoading();

    const body = {
      merchant: this.merchantInfo.id,
      merchant_title: this.merchantConfigForm.value.name,
      slug: this.merchantConfigForm.value.slug,
      action: this.action,
      pin_code: this.pin,
      merchant_category: this.category,
      merchant_logo: this.merchantLogo,
    };
    this.action = [];

    this.merchantService.updateMerchantDetails(body).subscribe({
      next: response => {
        this.isLoading = false;
        this.dialogService.closeLoading();
        this.get_merchantDetails = false;
        if (response.object.success) {
          this.dialogService.openToast({
            title: '',
            type: 'success',
            message: response.object.response_message,
          });
          this.get_merchantDetails = true;
          this.getConnectedMerchantInfo();
          this.selected = '';
        } else {
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: response.object.response_message,
          });
        }
      },

      error: err => {
        this.dialogService.closeLoading();
        const errorMessage = err.error.object.response_message;
        this.dialogService.openToast({
          type: 'failed',
          title: '',
          message: errorMessage || 'failed to update merchant details',
        });
      },
    });
  }

  switchMenu(name: string) {
    this.selected = name;
  }

  openModal() {
    this.dialogService.openDialog({
      title: 'Enter your pin to update merchant information',
      type: 'pin',
      message: 'Enter your pin to update merchant information',
      action: 'update',
    });
  }

  toggleProductSwitchBox(box: string, action: string): void {
    this.merchantConfigForm.markAsDirty();

    if (box === 'cart') {
      if (action === 'accepts_cart' && !this.action.includes('accepts_cart')) {
        this.merchantConfigForm.patchValue({
          cart: true,
        });

        this.action = this.action.filter(
          (act: string) => act !== 'not_accepts_cart'
        );
        this.action.push(action);
      } else if (
        action === 'not_accepts_cart' &&
        !this.action.includes('not_accepts_cart')
      ) {
        this.merchantConfigForm.patchValue({
          cart: false,
        });

        this.action = this.action.filter(
          (act: string) => act !== 'accepts_cart'
        );
        this.action.push(action);
      }
    } else if (box === 'simple_payment') {
      if (
        action === 'accepts_simple_payment' &&
        !this.action.includes('accepts_simple_payment')
      ) {
        this.merchantConfigForm.patchValue({
          simplePayment: true,
        });

        this.action = this.action.filter(
          (act: string) => act !== 'not_accepts_simple_payment'
        );
        this.action.push(action);
      } else if (
        action === 'not_accepts_simple_payment' &&
        !this.action.includes('not_accepts_simple_payment')
      ) {
        this.merchantConfigForm.patchValue({
          simplePayment: false,
        });

        this.action = this.action.filter(
          (act: string) => act !== 'accepts_simple_payment'
        );
        this.action.push(action);
      }
    } else if (box === 'incognito') {
      if (action === 'visible' && !this.action.includes('visible')) {
        this.merchantConfigForm.patchValue({
          incognito: true,
        });

        this.action = this.action.filter((act: string) => act !== 'invisible');
        this.action.push(action);
      } else if (action === 'invisible' && !this.action.includes('invisible')) {
        this.merchantConfigForm.patchValue({
          incognito: false,
        });

        this.action = this.action.filter((act: string) => act !== 'visible');
        this.action.push(action);
      }
    }
  }

  getConfigOptions(event: string) {
    this.selected = event;
    // this.merchantInfo = null;
    this.getConnectedMerchantInfo();
  }

  goBack() {
    if (!this.selected) {
      this.router.navigateByUrl('/m/mymarket');
    } else if (this.selected === 'detail') {
      this.selected = '';
    }
  }

  searchTellers(search: string) {
    this.isTellersSearch = true;
    this.isLoading = true;

    const data = {
      search: search,
      merchant: this.merchantInfo.id,
    };
    this.get_tellers = false;
    if (search) {
      this.merchantService
        .searchTellersByMerchant(data)
        .subscribe((tellers: tellersModel) => {
          this.isLoading = false;
          this.tellers = tellers.objects;
        });
    } else {
      this.getTellersByMerchant();
    }
  }
  handleEnter(event: Event) {
    if (this.newTellerForm.valid) {
      this.createNewTeller();
    } else {
      event.preventDefault();
    }
  }

  handleEnter2(event: Event) {
    event.preventDefault();
  }
}
