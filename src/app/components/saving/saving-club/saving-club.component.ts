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
  isloading = false;
  suggestedTontines: SuggestedTontinesModel[] | [] | null = null;

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
      next: response => {
        this.savingClub = response.objects;
      },
    });
  }

  getSuggestedTontines() {
    this.savingDetailService.getSuggestedTontines().subscribe({
      next: response => {
        this.suggestedTontines = response.objects;
      },
    });
  }
  switchMenu(name: string) {
    this.selected = name;
  }
}
