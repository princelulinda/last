import { Component, OnInit } from '@angular/core';
import { SavingDetailService } from '../../../core/services/saving/saving.service';
import { CommonModule } from '@angular/common';
import { TontineDataModele } from '../saving.models';
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
    this.getTontineDetails();
  }

  // function which takes as parameter the menu that we wish to select
  switchMenu(name: string) {
    this.selectedMenu = name;
  }

  getTontineDetails() {
    this.savingDetailService.getTontineDetails(this.tontineId).subscribe({
      next: (response: { object: TontineDataModele }) => {
        this.savingData = response.object;
      },
    });
  }
}
