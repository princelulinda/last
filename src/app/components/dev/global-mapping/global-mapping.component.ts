import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services';
import { UserInfoModel } from '../../../core/db/models/auth';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-global-mapping',
  standalone: true,
  imports: [],
  templateUrl: './global-mapping.component.html',
  styleUrl: './global-mapping.component.scss',
})
export class GlobalMappingComponent implements OnInit {
  userInfo!: UserInfoModel;
  userInfo$: Observable<UserInfoModel>;
  @Input() contact!: string;

  constructor(private authService: AuthService) {
    this.userInfo$ = this.authService.getUserInfo();
  }

  ngOnInit() {
    this.userInfo$.subscribe({
      next: user => {
        this.userInfo = user;
      },
    });
  }
}
