import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
// import { map } from 'rxjs/operators';

import { ApiService } from '..';
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

  constructor(private apiService: ApiService) {
    // this.search = of('');
    // this.search.next(of(''));
  }

  initPlateforms() {
    this.plateforms = [
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
        plateform: 'onamob',
        title: 'Switch On Onamob',
        image: '',
        icon: 'fa-solid fa-mobile-screen-button',
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
    ];
  }

  setSelectedCrumb(value: string) {
    this.selectedCrumb.next(value);
  }
}
