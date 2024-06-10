import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [LoginComponent, FooterComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {}
