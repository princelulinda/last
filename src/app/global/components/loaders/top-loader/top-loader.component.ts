import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../../core/services';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-top-loader',
  standalone: true,
  imports: [],
  templateUrl: './top-loader.component.html',
  styleUrl: './top-loader.component.scss',
})
export class TopLoaderComponent implements OnInit {
  loading: {
    active: boolean;
    type: 'spinner' | 'topLoader' | '';
    action: string;
  } = {
    action: '',
    active: false,
    type: '',
  };

  loader$: Observable<{
    active: boolean;
    type: 'spinner' | 'topLoader' | '';
    action: string;
  }>;

  showtopLoader = false;

  constructor(private dialogService: DialogService) {
    this.loader$ = toObservable(this.dialogService.loading);
  }

  ngOnInit() {
    this.loader$.subscribe({
      next: resp => {
        if (resp.active && resp.type === 'topLoader') {
          this.showtopLoader = true;
        } else {
          this.showtopLoader = false;
        }
      },
    });
  }
}
