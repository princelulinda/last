import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestComponent } from './base-components/test/test.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, TestComponent],
})
export class AppComponent {
  title = 'ng-magis-erp';
}
