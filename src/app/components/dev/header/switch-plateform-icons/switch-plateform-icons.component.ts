import { Component, Input, inject } from '@angular/core';
// import { Router } from 'express';
import { Subject, Observable } from 'rxjs';
import { ThemeService } from '../../../../core/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-switch-plateform-icons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './switch-plateform-icons.component.html',
  styleUrl: './switch-plateform-icons.component.scss',
})
export class SwitchPlateformIconsComponent {
  private onDestroy$: Subject<void> = new Subject<void>();
  // public variableService = inject(VariableService);
  public themeService = inject(ThemeService);
  plateform$!: Observable<string>;
  plateform = '';
  // theme$!: Observable<any>;
  // theme = '';
  plateforms = [
    {
      plateform: 'home',
      title: 'Switch On Home',
      image: '',
      icon: 'fa-solid fa-house-chimney-user',
      showit: true,
      is_selected: false,
    },
    {
      plateform: 'onlineBanking',
      title: 'Switch On Banking',
      icon: '',
      showit: false,
      image: '/assets/images/ihela-b.svg',
      is_selected: false,
    },
    {
      plateform: 'market',
      title: 'Switch On My market',
      image: '',
      showit: true,
      icon: 'fa-solid fa-cart-shopping',
      is_selected: false,
    },
    {
      plateform: 'workStation',
      title: 'Switch On WorkStation',
      image: '',
      showit: true,
      icon: 'fa-solid fa-desktop',
      is_selected: false,
    },
    {
      plateform: 'onamob',
      title: 'Switch On Onamob',
      image: '',
      showit: true,
      icon: 'fa-solid fa-mobile-screen-button',
      is_selected: false,
    },
  ];
  @Input() organization = '';

  // constructor(private store: Store, private router: Router) {
  //     this.plateform$ = this.store.select(SwitchState.GetPlateform);
  //     this.theme$ = this.store.select(SwitchThemeState.GetTheme);
  // }

  // ngOnInit() {
  //     this.plateform$
  //         .pipe(takeUntil(this.onDestroy$))
  //         .subscribe((plateform: string) => {
  //             this.plateform = plateform;
  //             this.variableService.initPlateforms();
  //             this.variableService.plateforms.find(
  //                 (plateF: any) => plateF.plateform === plateform
  //             )!.is_selected = true;
  //         });

  //     this.theme$
  //         .pipe(takeUntil(this.onDestroy$))
  //         .pipe(takeUntil(this.onDestroy$))
  //         .subscribe((theme) => {
  //             this.theme = theme;
  //         });
  // }

  // public ngOnDestroy(): void {
  //     this.onDestroy$.next();
  //     this.onDestroy$.complete();
  // }

  // switchPlateform(plateform: string) {
  //     if (this.plateform !== plateform) {
  //         if (plateform === 'onamob') {
  //             if (
  //                 this.theme === 'light-mode' ||
  //                 this.theme === 'magis-light'
  //             ) {
  //                 // this.themeService.switchPlateform(
  //                 //     plateform,
  //                 //     'light-mode',
  //                 //     this.organization
  //                 // );
  //             }
  //             if (this.theme === 'dark-mode' || this.theme === 'magis-dark') {
  //                 // this.themeService.switchPlateform(
  //                 //     plateform,
  //                 //     'dark-mode',
  //                 //     this.organization
  //                 // );
  //             }
  //         } else if (plateform !== 'onamob') {
  //             // this.themeService.switchPlateform(
  //             //     plateform,
  //             //     this.theme,
  //             //     this.organization
  //             // );
  //         }

  //         if (plateform === 'market') {
  //             this.toggleMarket();
  //         }
  //     }
  // }

  // toggleMarket() {
  //     this.store.dispatch(new SelectMarket({ marketName: 'market' }));
  // }
}
