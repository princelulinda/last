import { Component, OnInit } from '@angular/core';
import { ConfigService, ModeModel } from '../../../core/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-switch-mode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './switch-mode.component.html',
  styleUrls: ['./switch-mode.component.scss'],
})
export class SwitchModeComponent implements OnInit {
  isDarkModetheme: boolean;

  constructor(private configService: ConfigService) {
    this.isDarkModetheme = false;
  }

  ngOnInit() {
    // Récupération de la valeur de isDarkModetheme depuis le Local Storage
    this.isDarkModetheme = localStorage.getItem('isDarkModetheme') === 'true';

    // Récupération du mode depuis le service
    this.configService.getMode().subscribe((mode: ModeModel) => {
      // Mise à jour du mode dans le Local Storage
      localStorage.setItem(
        'isDarkModetheme',
        mode === 'dark' ? 'true' : 'false'
      );
    });
  }

  onThemeSwitchChange() {
    this.isDarkModetheme = !this.isDarkModetheme;
    this.configService.switchMode();

    // Enregistrement de la nouvelle valeur de isDarkModetheme dans le Local Storage
    localStorage.setItem('isDarkModetheme', this.isDarkModetheme.toString());
  }
}
