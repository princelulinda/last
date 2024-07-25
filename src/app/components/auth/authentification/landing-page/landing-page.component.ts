import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClipboardDirective } from '../../../dev/clipboard.directive';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, ClipboardDirective],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  title = 'copy';

  updateTitle() {
    this.title = 'copied';
    console.log('valeur title:', this.title);
  }
}
