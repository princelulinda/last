import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services';
import { Observable } from 'rxjs';
import { UserInfoModel } from '../../../../core/db/models/auth';
@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [],
  templateUrl: './general-settings.component.html',
  styleUrl: './general-settings.component.scss',
})
export class GeneralSettingsComponent implements OnInit {
  clientInfo$!: Observable<UserInfoModel>;
  clientInfo!: UserInfoModel;

  constructor(private authService: AuthService) {
    this.clientInfo$ = this.authService.getUserInfo();
  }

  ngOnInit(): void {
    this.clientInfo$.subscribe({
      next: clientInfo => {
        this.clientInfo = clientInfo;
        console.log('Client Info:', this.clientInfo);
      },
    });
  }
}
