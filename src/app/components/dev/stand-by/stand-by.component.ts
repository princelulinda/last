import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-stand-by',
  standalone: true,
  imports: [],
  templateUrl: './stand-by.component.html',
  styleUrl: './stand-by.component.scss',
})
export class StandByComponent {
  @HostListener('document:keydown', ['$event'])
  animationStart() {
    // this.toAnimate.nativeElement.classList.add('animation');
    const element = document.getElementById('toAnimate');
    const passInput = document.getElementById('passInput');
    const showElement = document.getElementsByClassName('hidDiv')[0];

    element?.classList.add('animation');

    showElement?.classList.remove('show');
    showElement?.classList.add('show');
    passInput?.focus();
  }
}
