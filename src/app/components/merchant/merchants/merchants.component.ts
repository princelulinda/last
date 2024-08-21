import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';

import { ModeModel } from '../../../core/services/config/main-config.models';
import {
  ConfigService,
  DialogService,
  MerchantService,
} from '../../../core/services';
import { MerchantCardComponent } from '../global/merchant-card/merchant-card.component';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { BillersModel } from '../../dashboards/dashboard.model';
import {
  MerchantCategoriesModel,
  SectorActivityModel,
} from '../merchant.models';
import { GoogleMapComponent } from '../../../global/components/google-map/google-map.component';
import { MerchantAutocompleteModel } from '../merchant.models';
import { MerchantPaymentDialogModel } from '../../../core/services/dialog/dialogs-models';
import { VariableService } from '../../../core/services/variable/variable.service';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-merchants',
  standalone: true,
  imports: [
    MerchantCardComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkeletonComponent,
    GoogleMapComponent,
  ],
  templateUrl: './merchants.component.html',
  styleUrl: './merchants.component.scss',
})
export class MerchantsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  merchants!: MerchantAutocompleteModel[] | null;
  favoriteMerchants!: MerchantAutocompleteModel[];
  favoriteMerchantsNumber!: number;
  favorite_merchant_making!: BillersModel | null;
  payMerchant!: BillersModel | null;
  merchantId!: string;
  countProductLoader = [1, 2, 3, 4, 5, 6, 7, 8];
  favoriteDisplay = false;
  location!: boolean;
  getting = false;
  searchInput = new FormControl('');
  isLoading = false;
  isSearchExpanded = false;
  theme!: ModeModel;
  theme$: Observable<ModeModel>;
  isInputFocused = false;
  sectorActivity!: SectorActivityModel[];
  selectedSector!: SectorActivityModel | null;
  isSectorListVisible = false;
  sectorId = '';
  categories!: MerchantCategoriesModel[];

  favoriteMerchantLoading = false;

  private refreshFavoriteMerchants$: Observable<boolean>;

  constructor(
    private merchantService: MerchantService,
    private configService: ConfigService,
    private dialogService: DialogService,
    private variableService: VariableService
  ) {
    this.theme$ = this.configService.getMode();
    this.refreshFavoriteMerchants$ = toObservable(
      this.variableService.refreshFavoriteMerchants
    );
  }

  ngOnInit() {
    this.getMerchants('');
    this.getFavoriteMerchants('');
    this.getActivitiesSectors();

    this.theme$.subscribe({
      next: theme => (this.theme = theme),
    });

    // NOTE :: TO CHECK ACTION ON FAVORITE PRODUCTS
    this.refreshFavoriteMerchants$.subscribe({
      next: state => {
        if (state) {
          this.getFavoriteMerchants('');
          this.variableService.refreshFavoriteMerchants.set(false);
        }
      },
    });

    this.searchInput.valueChanges
      .pipe(debounceTime(400), takeUntil(this.onDestroy$))
      .subscribe(value => {
        this.getMerchants(value ?? '');
      });
  }

  toggleSearch(expand: boolean) {
    this.isSearchExpanded = expand;
  }

  displayFavorites() {
    if (!this.favoriteDisplay) {
      this.favoriteDisplay = true;
    } else if (this.favoriteDisplay) {
      this.favoriteDisplay = false;
    }
  }

  getMerchants(search: string) {
    this.isLoading = true;
    this.merchants = null;

    this.merchantService
      .getRecentMerchantsAutocomplete(search)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          const response = data as { objects: MerchantAutocompleteModel[] };
          this.isLoading = false;
          this.merchants = response.objects;
          this.favorite_merchant_making = null;
        },
        error: err => {
          this.isLoading = false;

          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'Something went wrong, please try again',
          });

          return err;
        },
      });
  }

  getFavoriteMerchants(search: string, activeLoading = true) {
    if (activeLoading) {
      this.favoriteMerchantLoading = true;
    }
    this.merchantService
      .getFavoriteMerchantsAutocomplete(search)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          const response = data as {
            objects: MerchantAutocompleteModel[];
            count: number;
          };
          this.favoriteMerchants = response.objects;
          this.favoriteMerchantsNumber = response.count;
          this.favoriteMerchantLoading = false;
          this.favorite_merchant_making = null;
        },
        error: err => {
          this.favoriteMerchantLoading = false;
          return err;
        },
      });
  }

  getMerchant(data: BillersModel, event: MouseEvent) {
    event.stopPropagation();

    const element = event.target as HTMLButtonElement;
    element.setAttribute('data-bs-target', '#myModal');
    element.setAttribute('data-bs-toggle', 'modal');
    this.payMerchant = data;
    this.merchantId = this.payMerchant.id;
  }

  isSearchInputNotEmpty(): boolean {
    const searchValue = this.searchInput.value;
    return typeof searchValue === 'string' && searchValue.trim() !== '';
  }

  closeModal() {
    const modal = document.getElementById('modal');
    if (modal !== null) {
      modal.style.display = 'none';
    }
  }

  getLocation() {
    // Check if geolocation is available in the browser
    if ('geolocation' in navigator) {
      // Get the user's current location
      this.getting = true;
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          this.location = true;
          this.getting = false;
          // The user's latitude and longitude are in position.coords.latitude and position.coords.longitude
          const latitude: number = position.coords.latitude;
          const longitude: number = position.coords.longitude;
          console.log(
            `Latitude: ${latitude}, Longitude: ${longitude}`,
            position
          );

          this.merchantService.getUserCoords(position.coords);
        },
        (error: GeolocationPositionError) => {
          // Handle errors, if any
          this.location = false;
          this.getting = false;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error('User denied the request for geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              console.error('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              console.error('The request to get user location timed out.');
              break;
            // case error.UNKNOWN_ERROR:
            //     console.error("An unknown error occurred.");
            //     break;
          }
        }
      );
    } else {
      console.error('Geolocation is not available in this browser.');
    }
  }

  getActivitiesSectors() {
    this.isLoading = true;
    this.sectorActivity = [];
    this.selectedSector = null;
    this.merchantService
      .getActivitySectors()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.sectorActivity = data.objects;
          if (this.sectorActivity.length > 0) {
            this.selectedSector = this.sectorActivity[0];
            this.getCategoriesPerActivitySectors(
              this.selectedSector.id as string
            );
            this.isLoading = false;
          }
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  toggleSectorList() {
    this.isSectorListVisible = !this.isSectorListVisible;
  }

  showSectorList() {
    this.isSectorListVisible = true;
  }

  hideSectorList() {
    this.isSectorListVisible = false;
  }

  selectSector(sector: SectorActivityModel): void {
    this.selectedSector = sector;
    this.isSectorListVisible = false;
    this.getCategoriesPerActivitySectors(sector.id as string);
  }

  getCategoriesPerActivitySectors(sectorId: string): void {
    this.isLoading = true;
    this.merchantService
      .getCategoriesPerActivitySectors(sectorId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: categories => {
          this.categories = categories.objects;
          this.isLoading = false;
        },
        error: err => {
          console.error('Error fetching categories', err);
          this.isLoading = false;
        },
      });
  }

  dispatchMerchantPayment(payload: MerchantPaymentDialogModel) {
    this.dialogService.openMerchantPaymentDialog(payload);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
