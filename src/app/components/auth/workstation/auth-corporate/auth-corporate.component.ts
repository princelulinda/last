import { Component, OnInit } from '@angular/core';
import {
  AuthService,
  ConfigService,
  DialogService,
} from '../../../../core/services';
import { connectedOperatorModel } from '../../auth.model';

@Component({
  selector: 'app-auth-corporate',
  standalone: true,
  imports: [],
  templateUrl: './auth-corporate.component.html',
  styleUrl: './auth-corporate.component.scss',
})
export class AuthCorporateComponent implements OnInit {
  organization: connectedOperatorModel | null = null;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    // this.dialogService.dispatchSplashScreen();
    this.getConnectedOperator();
  }

  getConnectedOperator() {
    this.authService.getConnectedOperator().subscribe({
      next: response => {
        console.log(response);
        // this.organization = response
      },
      error: err => {
        console.log('Salut les gens', err);
      },
    });
  }
}
