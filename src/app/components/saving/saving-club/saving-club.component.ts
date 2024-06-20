import { Component, OnInit } from '@angular/core';
import { SavingDetailService } from '../../../core/services/saving/saving.service';
import { TontineModel } from '../saving.model';

@Component({
  selector: 'app-saving-club',
  standalone: true,
  imports: [],
  templateUrl: './saving-club.component.html',
  styleUrls: ['./saving-club.component.scss'],
})
export class SavingClubComponent implements OnInit {
  selectedData: TontineModel[] | [] | null = null;

  constructor(private savingDetailService: SavingDetailService) {}

  ngOnInit() {
    this.getClientTontines();
  }

  getClientTontines() {
    this.savingDetailService.getClientTontines().subscribe({
      next: (response: { objects: TontineModel[] }) => {
        this.selectedData = response.objects.map((tontine: TontineModel) => ({
          name: tontine.name,
          members_count: tontine.members_count,
          short_description: tontine.short_description,
        }));
        console.log('Données sélectionnées', this.selectedData);
      },
      error: (error: Error) =>
        console.error('Erreur lors de la récupération des tontines:', error),
    });
  }
}
