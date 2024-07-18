import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { SubHeaderComponent } from './sub-header/sub-header.component';

@Component({
  selector: 'app-auth-corporate-layout',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    SubHeaderComponent,
    RouterOutlet,
  ],
  templateUrl: './auth-corporate-layout.component.html',
  styleUrl: './auth-corporate-layout.component.scss',
})
export class AuthCorporateLayoutComponent {}
