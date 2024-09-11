import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NotificationDetailsService } from '../../../../core/services/notification/notification-details.service';
import { CommonModule } from '@angular/common';
import { NotificationModel } from '../notification.models';

@Component({
  selector: 'app-notification-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-details.component.html',
  styleUrl: './notification-details.component.scss',
})
export class NotificationDetailsComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  notificationDetails!: NotificationModel | null;
  notificationId!: string;
  errorMessage = '';
  notificationSelectedId!: number;
  loadingNotificationDetails = false;

  constructor(
    private route: ActivatedRoute,
    private NotificationDetailsService: NotificationDetailsService
  ) {}
  ngOnInit(): void {
    if (this.route.params) {
      this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe({
        next: data => {
          this.notificationId = data['id'];
          this.getNotificationDetails();
        },
      });
    }
  }

  getNotificationDetails() {
    this.loadingNotificationDetails = true;
    this.NotificationDetailsService.getNotificationDetails(this.notificationId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: { object: NotificationModel }) => {
          this.loadingNotificationDetails = false;
          this.notificationDetails = data.object;
          this.notificationSelectedId = this.notificationDetails.id;
        },
        error: () => {
          this.loadingNotificationDetails = false;
          this.errorMessage = 'Data not Found';
        },
      });
  }

  refresh() {
    this.notificationDetails = null;
    this.getNotificationDetails();
  }
}
