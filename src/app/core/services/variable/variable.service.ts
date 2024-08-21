import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

import { ApiService, MerchantService } from '..';
import { ProductAutocompleteModel } from '../../../components/merchant/products/products.model';
import { MerchantAutocompleteModel } from '../../../components/merchant/merchant.models';
// import { AuthState } from '../../shared';

@Injectable({
  providedIn: 'root',
})
export class VariableService {
  // password: Observable<string> = new Observable<string>;
  password!: string;
  clientId = '';
  selectedClient!: string;
  selectedFilt = '';
  accountId = '';
  selectedAccount!: string;
  pin = '';
  menuGroups = [
    { name: 'Reporting', value: 'R' },
    { name: 'Desk', value: 'W' },
    { name: 'Intranet', value: 'I' },
  ];
  plateforms = [
    {
      plateform: 'home',
      title: 'Switch On Home',
      image: '',
      icon: 'fa-solid fa-house-chimney-user',
      is_selected: false,
    },
    {
      plateform: 'onlineBanking',
      title: 'Switch On Banking',
      icon: '',
      image: '/assets/images/ihela-b.svg',
      is_selected: false,
    },
    {
      plateform: 'market',
      title: 'Switch On My market',
      image: '',
      icon: 'fa-solid fa-cart-shopping',
      is_selected: false,
    },
    {
      plateform: 'workStation',
      title: 'Switch On WorkStation',
      image: '',
      icon: 'fa-solid fa-desktop',
      is_selected: false,
    },
    {
      plateform: 'onamob',
      title: 'Switch On Onamob',
      image: '',
      icon: 'fa-solid fa-mobile-screen-button',
      is_selected: false,
    },
  ];

  selectedCrumb = new BehaviorSubject<string>('');

  // search: Observable<string>;
  search = new BehaviorSubject<string>('');
  isPopulatingOperator = new BehaviorSubject<boolean>(false);

  private favoriteProductsSubject: BehaviorSubject<ProductAutocompleteModel[]> =
    new BehaviorSubject<ProductAutocompleteModel[]>([]);
  public favoriteProducts$: Observable<ProductAutocompleteModel[]> =
    this.favoriteProductsSubject.asObservable();

  private favoriteMerchantsSubject: BehaviorSubject<
    MerchantAutocompleteModel[]
  > = new BehaviorSubject<MerchantAutocompleteModel[]>([]);
  public favoriteMerchants$: Observable<MerchantAutocompleteModel[]> =
    this.favoriteMerchantsSubject.asObservable();
  constructor(
    private apiService: ApiService,
    private merchantService: MerchantService
  ) {
    // this.search = of('');
    // this.search.next(of(''));
  }

  updateFavoriteProducts(
    product: ProductAutocompleteModel,
    isFavorite: boolean
  ) {
    const currentFavorites = this.favoriteProductsSubject.value;
    if (isFavorite) {
      this.favoriteProductsSubject.next([...currentFavorites, product]);
    } else {
      this.favoriteProductsSubject.next(
        currentFavorites.filter(p => p.id !== product.id)
      );
    }
  }

  fetchFavoriteProducts(search: string) {
    this.merchantService
      .getFavoriteProductAutocomplete(search)
      .subscribe(data => {
        this.favoriteProductsSubject.next(data.objects);
      });
  }

  updateFavoriteMerchants(
    merchant: MerchantAutocompleteModel,
    isFavorite: boolean
  ) {
    const currentFavorites = this.favoriteMerchantsSubject.value;
    if (isFavorite) {
      this.favoriteMerchantsSubject.next([...currentFavorites, merchant]);
    } else {
      this.favoriteMerchantsSubject.next(
        currentFavorites.filter(p => p.id !== merchant.id)
      );
    }
  }

  fetchFavoriteMerchants(search: string) {
    this.merchantService
      .getFavoriteMerchantsAutocomplete(search)
      .subscribe(data => {
        const response = data as {
          objects: MerchantAutocompleteModel[];
          count: number;
        };
        this.favoriteMerchantsSubject.next(response.objects);
      });
  }
}
