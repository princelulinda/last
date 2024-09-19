import { Component, OnInit } from '@angular/core';
import { ConnectedOperatorModel } from '../../auth/auth.model';
import { ConfigService } from '../../../core/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-desk-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './desk-dashboard.component.html',
  styleUrl: './desk-dashboard.component.scss',
})
export class DeskDashboardComponent implements OnInit {
  operator: ConnectedOperatorModel | null = null;
  operator$: Observable<ConnectedOperatorModel>;

  constructor(private configService: ConfigService) {
    this.operator$ = this.configService.getConnectedOperator();
  }

  ngOnInit() {
    this.operator$.subscribe({
      next: operator => {
        this.operator = operator;
      },
    });
  }
}
