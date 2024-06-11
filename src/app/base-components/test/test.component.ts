import { Component, OnInit } from '@angular/core';
import { Observable, of, takeUntil } from 'rxjs';
import { AutoUnsubscribe } from '../base-classes/auto-unsubscribe';

@Component({
  selector: 'app-test',
  standalone: true,
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent extends AutoUnsubscribe implements OnInit {
  observable$: Observable<number> = of(1, 2, 3);

  ngOnInit() {
    this.observable$
      .pipe(this.autoUnsubscribe(), takeUntil(this.destroyed))
      .subscribe(value => {
        console.log(value);
      });
  }
}
