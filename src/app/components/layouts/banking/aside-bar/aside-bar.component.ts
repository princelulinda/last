import { Component } from '@angular/core';

@Component({
  selector: 'app-aside-bar',
  standalone: true,
  templateUrl: './aside-bar.component.html',
  styleUrl: './aside-bar.component.scss',
  imports: [],
})
export class AsideBarComponent {
  isLoading = true;
}
