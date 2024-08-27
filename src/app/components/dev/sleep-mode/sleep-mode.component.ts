import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-sleep-mode',
  standalone: true,
  imports: [],
  templateUrl: './sleep-mode.component.html',
  styleUrl: './sleep-mode.component.scss',
})
export class SleepModeComponent {
  @HostListener('document:keydown', ['$event'])
  animationStart() {
    // this.toAnimate.nativeElement.classList.add('animation');
    const element = document.getElementById('toAnimate');
    // const passInput = document.getElementById('passInput');
    const showElement = document.getElementsByClassName('hidDiv')[0];

    element?.classList.add('animation');

    showElement?.classList.remove('show');
    showElement?.classList.add('show');
    // passInput?.focus();
  }
}
