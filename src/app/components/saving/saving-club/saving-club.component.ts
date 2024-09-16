import { Component, OnInit } from '@angular/core';
import { SavingDetailService } from '../../../core/services/saving/saving.service';
import { SuggestedTontinesModel, TontineModel } from '../saving.models';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-saving-club',
  standalone: true,
  imports: [SkeletonComponent, RouterLink, CommonModule],
  templateUrl: './saving-club.component.html',
  styleUrls: ['./saving-club.component.scss'],
})
export class SavingClubComponent implements OnInit {
  savingClub: TontineModel[] | [] | null = null;
  suggestedTontines: SuggestedTontinesModel[] | [] | null = null;
  thirdSuggestedTontines: SuggestedTontinesModel[] | [] | null = null;
  selected = '';
  constructor(
    private savingDetailService: SavingDetailService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getClientTontines();
    this.getSuggestedTontines();
  }

  goBack(): void {
    this.location.back();
  }
  getClientTontines() {
    this.savingDetailService.getClientTontines().subscribe({
      next: (response: { objects: TontineModel[] }) => {
        this.savingClub = response.objects.map((tontine: TontineModel) => ({
          name: tontine.name,
          members_count: tontine.members_count,
          short_description: tontine.short_description,
        }));
      },
    });
  }

  getthirdSuggestedTontines() {
    this.savingDetailService.getSuggestedTontines().subscribe({
      next: (response: { objects: SuggestedTontinesModel[] }) => {
        this.thirdSuggestedTontines = response.objects
          .slice(0, 3)
          .map((thirdSuggestedTontines: SuggestedTontinesModel) => ({
            id: thirdSuggestedTontines.id,
            name: thirdSuggestedTontines.name,
            members_count: thirdSuggestedTontines.members_count,
            membership_fees: thirdSuggestedTontines.membership_fees,
          }));
      },
    });
  }

  getSuggestedTontines() {
    this.savingDetailService.getSuggestedTontines().subscribe({
      next: (response: { objects: SuggestedTontinesModel[] }) => {
        // Utilisez 'slice' pour obtenir les trois premiers éléments
        this.suggestedTontines = response.objects
          .slice(0, 4)
          .map((suggestedTontines: SuggestedTontinesModel) => ({
            id: suggestedTontines.id,
            name: suggestedTontines.name,
            members_count: suggestedTontines.members_count,
            membership_fees: suggestedTontines.membership_fees,
            // Assurez-vous d'ajouter ici toutes les propriétés nécessaires
          }));
      },
    });
  }
  switchMenu(name: string) {
    this.selected = name;
  }
}
