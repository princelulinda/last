import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DbService } from './core/db/db.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  plateform = 'market';

  constructor(private dbService: DbService) {}

  setStoredTheme = (theme: string) => localStorage.setItem('theme', theme);

  ngOnInit() {
    console.log('CALLING FROM APP COMPONENT');
    this.dbService.populate();
  }

  // ngAfterViewInit() {
  // (() => {
  //   'use strict';

  //   const getStoredTheme = () => localStorage.getItem('theme');
  //   const getPreferredTheme = () => {
  //     const storedTheme = getStoredTheme();
  //     if (storedTheme) {
  //       return storedTheme;
  //     }
  //     console.log(
  //       'aaaaaaaaaaaaaaaaaaaaaaa',
  //       window.matchMedia('(prefers-color-scheme: dark)')
  //     );
  //     return window.matchMedia('(prefers-color-scheme: dark)').matches
  //       ? 'dark'
  //       : 'light';
  //   };

  //   const setTheme = (theme: string) => {
  //     if (theme === 'auto') {
  //       document.documentElement.setAttribute(
  //         'data-bs-theme',
  //         window.matchMedia('(prefers-color-scheme: dark)').matches
  //           ? 'dark'
  //           : 'light'
  //       );
  //     } else {
  //       document.documentElement.setAttribute('data-bs-theme', theme);
  //     }
  //   };

  //   setTheme(getPreferredTheme());

  //   const showActiveTheme = (theme: string, focus = false) => {
  //     const themeSwitcher = document.querySelector('#bd-theme');

  //     if (!themeSwitcher) {
  //       return;
  //     }

  //     const themeSwitcherText = document.querySelector('#bd-theme-text');
  //     const activeThemeIcon = document.querySelector(
  //       '.theme-icon-active use'
  //     );
  //     const btnToActive: any = document?.querySelector(
  //       `[data-bs-theme-value="${theme}"]`
  //     );
  //     const svgOfActiveBtn = btnToActive
  //       ?.querySelector('svg use')
  //       ?.getAttribute('href');

  //     document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
  //       element.classList.remove('active');
  //       element.setAttribute('aria-pressed', 'false');
  //     });

  //     console.log('sopadapojf');

  //     btnToActive?.classList.add('active');
  //     btnToActive?.setAttribute('aria-pressed', 'true');
  //     activeThemeIcon?.setAttribute('href', svgOfActiveBtn ?? '');
  //     const themeSwitcherLabel: any = `${themeSwitcherText?.textContent} (${btnToActive?.dataset.bsThemeValue})`;
  //     themeSwitcher.setAttribute('aria-label', themeSwitcherLabel);

  //     if (focus) {
  //       // themeSwitcher.focus();
  //     }
  //   };

  //   window
  //     .matchMedia('(prefers-color-scheme: dark)')
  //     .addEventListener('change', () => {
  //       const storedTheme = getStoredTheme();
  //       if (storedTheme !== 'light' && storedTheme !== 'dark') {
  //         setTheme(getPreferredTheme());
  //       }
  //     });

  //   window.addEventListener('DOMContentLoaded', () => {
  //     showActiveTheme(getPreferredTheme());

  //     document.querySelectorAll('[data-bs-theme-value]').forEach(toggle => {
  //       toggle.addEventListener('click', () => {
  //         const theme = toggle.getAttribute('data-bs-theme-value');
  //         this.setStoredTheme(theme ?? '');
  //         setTheme(theme ?? '');
  //         showActiveTheme(theme ?? '', true);
  //       });
  //     });
  //   });
  // })();
  // }
}
