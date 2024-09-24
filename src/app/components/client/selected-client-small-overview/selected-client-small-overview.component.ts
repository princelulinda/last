import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-selected-client-small-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selected-client-small-overview.component.html',
  styleUrl: './selected-client-small-overview.component.scss',
})
export class SelectedClientSmallOverviewComponent implements OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  clientId!: number;

  @Input() selectedClient!:
    | {
        id: string;
        client_id: number;
        client_phone_number: number;
        client_code: string;
        client_full_name: string;
        picture_url: string;
        client_is_custom: boolean;
        client_type: string;
      }
    | undefined;
  // @Input() selectedClient = {
  //   id: '',
  //   client_id: 0,
  //   client_phone_number: 0,
  //   client_code: '',
  //   client_full_name: '',
  //   picture_url: '',
  //   client_is_custom: false,
  //   client_type: '',
  // };

  // constructor() {
  //     //comment
  // }

  // ngOnInit(): void {
  //     //comment
  // }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
