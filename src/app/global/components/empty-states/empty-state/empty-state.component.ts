import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModeModel } from '../../../../core/services/config/main-config.models';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ConfigService } from '../../../../core/services';

export type EmptyStateModel =
  | 'list'
  | 'merchant'
  | 'product'
  | 'service'
  | 'other';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent implements OnInit {
  @Input() searchTerm = '';
  @Input() searchType: EmptyStateModel = 'service';
  @Input() imageClass = '';
  @Input() messageClass = '';

  private onDestroy$: Subject<void> = new Subject<void>();
  theme!: ModeModel;
  theme$: Observable<ModeModel>;

  constructor(private configService: ConfigService) {
    this.theme$ = this.configService.getMode();
  }

  ngOnInit() {
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: response => {
        this.theme = response;
      },
    });
  }
}
