import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Observable } from 'rxjs';

import { ProductModel } from '../../../dashboards/dashboard.model';
import { ModeModel } from '../../../../core/services/config/main-config.models';
import { ConfigService } from '../../../../core/services';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit {
  @Input({ required: true }) product: ProductModel = {
    id: 0,
    lookup_description: '',
    lookup_icon: '',
    lookup_image: '',
    lookup_subtitle: '',
    lookup_title: '',
    price: 0,
  };
  currentMode$: Observable<ModeModel>;
  currentMode!: ModeModel;

  constructor(private configService: ConfigService) {
    this.currentMode$ = this.configService.getMode();
  }

  ngOnInit(): void {
    this.currentMode$.subscribe({
      next: theme => {
        this.currentMode = theme;
      },
    });
  }
}
