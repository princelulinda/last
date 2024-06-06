import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DbService } from './core/db/db.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  plateform = 'market';

  constructor(private dbService: DbService) {}
}
