import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestComponent } from './base-components/test/test.component';

import { DbService } from './core/db/db.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, TestComponent],
})
export class AppComponent {
  plateform = 'market';

  constructor(private dbService: DbService) {}
}
