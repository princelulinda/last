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
  tontines: TontineModel[] = []; // Cette variable contiendra les données récupérées
  // clientTontines: TontineModel | [] | null = null;

  constructor(private savingDetailService: SavingDetailService) {}

  ngOnInit() {
    this.getTontines();
  }

  getTontines() {
    this.savingDetailService.getTontines().subscribe({
      next: (response: { objects: TontineModel[]; count: number }) => {
        this.tontines = response.objects;
      },
    });
  }
}
