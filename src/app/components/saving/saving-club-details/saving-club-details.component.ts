import { Component, OnInit } from '@angular/core';
import { SavingDetailService } from '../../../core/services/saving/saving.service';
import { CommonModule } from '@angular/common';
import { TontineDataModele } from '../saving.model';
@Component({
  selector: 'app-saving-club-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saving-club-details.component.html',
  styleUrl: './saving-club-details.component.scss',
})
export class SavingClubDetailsComponent implements OnInit {
  selectedMenu!: string;
  tontineId!: number;
  savingData!: TontineDataModele;
  constructor(private savingDetailService: SavingDetailService) {}
  ngOnInit() {
    this.getSavingData();
  }

  // function which takes as parameter the menu that we wish to select
  switchMenu(name: string) {
    this.selectedMenu = name;
  }

  getSavingData() {
    this.savingDetailService.getSavingData(this.tontineId).subscribe({
      next: (response: { tontine: TontineDataModele }) => {
        this.savingData = response.tontine;
        console.log('Données de tontine:', this.savingData);
      },
      error: (error: Error) =>
        console.error('Erreur lors de la récupération des tontines:', error),
    });
  }
}
