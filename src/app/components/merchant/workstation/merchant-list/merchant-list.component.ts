import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { MerchantService } from '../../../../core/services/merchant/merchant.service';
import { VariableService } from '../../../../core/services/variable/variable.service';
import { NgClass } from '@angular/common';
import { ListComponent } from '../../../../global/components/list/list/list.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-merchant-list',
  standalone: true,
  imports: [NgClass, ListComponent, ReactiveFormsModule],
  templateUrl: './merchant-list.component.html',
  styleUrl: './merchant-list.component.scss',
})
export class MerchantListComponent implements OnInit, AfterViewInit, OnDestroy {
  headers = [
    {
      name: 'Name',
      field: ['merchant_title'],
      size: '',
      detail: {
        link: '/w/workstation/d/desk/merchant/detail/',
        field: 'id',
      },
    },
    { name: 'Merchant code', field: ['merchant_code'], size: '' },

    { name: 'Client code', field: ['client.client_code'], size: '' },
    {
      name: 'Balance',
      field: ['available_balance'],
      format: 'currency',
      size: '',
    },
    {
      name: 'Reference Person',
      field: ['reference_client.client_full_name'],
      size: '',
    },
    {
      name: 'Reference code',
      field: ['reference_client.client_code'],
      size: '',
    },
    {
      name: 'Transactions',
      field: ['payment_bills'],
      size: '',
    },
    {
      name: 'Active',
      field: ['merchant_category.is_active'],
      size: '',
      boolean: true,
    },
  ];

  crumbs = [
    {
      label: 'Merchants',
    },
    {
      label: 'List',
      active: true,
    },
  ];
  selectedMenu = 'list';

  client!: null;
  category!: null;
  isLoading = false;
  // newMerchant$: any;

  private onDestroy$: Subject<void> = new Subject<void>();
  // dialog: any;
  // dialog$: Observable<any>;
  // newMerchantForm: any;
  // merchantLocations: any[] = [];

  constructor(
    private merchantService: MerchantService,
    // private store: Store,
    private variableService: VariableService
  ) {
    // (this.dialog$ = this.store.select(DialogState.GetDialog)),
    //     (this.newMerchantForm = new FormGroup({
    //         title: new FormControl('', Validators.required),
    //     }));
    //}
  }

  ngOnInit() {
    // this.dialog$.pipe(takeUntil(this.onDestroy$)).subscribe({
    //     next: (dialog: any) => {
    //         if (dialog) {
    //             this.dialog = dialog;
    //             if (this.dialog && this.dialog.response) {
    //                 if (
    //                     this.dialog.response === 'pin submitted' &&
    //                     this.dialog.action === 'create merchant'
    //                 ) {
    //                     this.createNewMerchant();
    //                 }
    //             }
    //         }
    //     },
    // });

    this.getMerchantsLocations();
  }

  getMerchantsLocations() {
    // const data = {
    //     limit: 40,
    //     offset: 0,
    // };
    // this.merchantService.getMerchants(data).subscribe({
    //     next: (merchants) => {
    //         this.merchantLocations = merchants.objects.map(
    //             (merchant: any) => merchant.merchant_location
    //         );
    //         // console.log('mm', this.merchantLocations);
    //     },
    // });
  }

  ngAfterViewInit() {
    console.log('clientId', this.client);
  }

  // getClientId(event:Event) {
  //     this.client = event;
  // }
  // getCategory(event: Event) {
  //     this.category = event;
  // }
  // createNewMerchant() {
  //     const response = {
  //         title: '',
  //         type: 'loading',
  //         message: 'wait while we are creating the merchant...',
  //     };
  //     this.store.dispatch(new OpenDialog(response));
  //     this.isLoading = true;
  //     const body = {
  //         merchant_title: this.newMerchantForm.value.title,
  //         merchant_category: this.category.id,
  //         client: this.client.id,
  //         access_bank_id: 1,
  //         pin_code: this.variableService.pin,
  //     };
  //     this.merchantService
  //         .createNewMerchant(body)
  //         .pipe(takeUntil(this.onDestroy$))
  //         .subscribe({
  //             next: (datas: any) => {
  //                 this.store.dispatch(new CloseDialog({ response: 'close' }));

  //                 if (datas.object.success === true) {
  //                     const data = {
  //                         title: '',
  //                         type: 'success',
  //                         message: 'Success',
  //                     };
  //                     this.store.dispatch(new OpenDialog(data));
  //                 } else if (datas.object.success === false) {
  //                     const data = {
  //                         title: '',
  //                         type: 'failed',
  //                         message: datas.object.response_message,
  //                     };
  //                     this.store.dispatch(new OpenDialog(data));
  //                 } else {
  //                     const data = {
  //                         title: '',
  //                         type: 'success',
  //                         message: 'Success',
  //                     };
  //                     this.store.dispatch(new OpenDialog(data));
  //                 }

  //                 this.isLoading = false;
  //             },
  //             error: (data: any) => {
  //                 this.store.dispatch(new CloseDialog({ response: 'close' }));

  //                 const failure = {
  //                     title: 'failure',
  //                     type: 'failed',
  //                     message: 'Failed',
  //                 };

  //                 this.store.dispatch(new OpenDialog(failure));
  //                 this.isLoading = false;
  //             },
  //         });
  // }

  // showModal() {
  //     const data = {
  //         title: 'pin',
  //         type: 'pin',
  //         message: 'Please enter your pin to confirm this action',
  //         action: 'create merchant',
  //     };
  //     this.store.dispatch(new OpenActionDialog(data));
  // }
  cancelCreation() {
    this.selectedMenu = 'list';
    this.client = null;
    this.category = null;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  selectMenu(menu: string) {
    this.selectedMenu = menu;
  }
}
