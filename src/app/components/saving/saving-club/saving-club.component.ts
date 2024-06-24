import { Component, OnInit } from '@angular/core';
import { SavingDetailService } from '../../../core/services/saving/saving.service';
import { SuggestedTontinesModel, TontineModel } from '../saving.model';
import { SkeletonComponent } from '../../../global/skeleton/skeleton.component';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-saving-club',
  standalone: true,
  imports: [SkeletonComponent, RouterLink],
  templateUrl: './saving-club.component.html',
  styleUrls: ['./saving-club.component.scss'],
})
export class SavingClubComponent implements OnInit {
  savingClub: TontineModel[] | [] | null = null;
  suggestedTontines: SuggestedTontinesModel[] | [] | null = null;
  selected = '';
  constructor(private savingDetailService: SavingDetailService) {}

  ngOnInit() {
    this.getClientTontines();
    this.getSuggestedTontines();
  }

  getClientTontines() {
    this.savingDetailService.getClientTontines().subscribe({
      next: (response: { objects: TontineModel[] }) => {
        this.savingClub = response.objects.map((tontine: TontineModel) => ({
          name: tontine.name,
          members_count: tontine.members_count,
          short_description: tontine.short_description,
        }));
        console.log('Données sélectionnées', this.savingClub);
      },
      error: (error: Error) =>
        console.error('Erreur lors de la récupération des tontines:', error),
    });
  }

  getSuggestedTontines() {
    this.savingDetailService.getSuggestedTontines().subscribe({
      next: (response: { objects: SuggestedTontinesModel[] }) => {
        this.suggestedTontines = response.objects.map(
          (suggestedTontines: SuggestedTontinesModel) => ({
            id: suggestedTontines.id,
            name: suggestedTontines.name,
            members_count: suggestedTontines.members_count,
            membership_fees: suggestedTontines.membership_fees,
          })
        );
        console.log('suggestedTontines', this.suggestedTontines);
      },
      error: (error: Error) =>
        console.error('Erreur lors de la récupération des tontines:', error),
    });
  }

  switchMenu(name: string) {
    this.selected = name;
  }
}
