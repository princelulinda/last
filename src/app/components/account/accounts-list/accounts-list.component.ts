import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { activeMainConfigModel } from '../../../core/services';

@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [],
  templateUrl: './accounts-list.component.html',
  styleUrl: './accounts-list.component.scss',
})
export class AccountsListComponent implements OnInit {
  mainConfig$!: Observable<activeMainConfigModel>;
  mainConfig!: activeMainConfigModel;

  ngOnInit(): void {
    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });
  }
}
