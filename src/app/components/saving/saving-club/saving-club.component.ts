import { Component, OnInit } from '@angular/core';
// import { SavingDetailService } from '../../../core/services/saving/saving.service';
// import { Tontine } from '../tontine.model';

@Component({
  selector: 'app-saving-club',
  standalone: true,
  imports: [],
  templateUrl: './saving-club.component.html',
  styleUrls: ['./saving-club.component.scss'],
})
export class SavingClubComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  //   tontines: Tontine[] = []; // Cette variable contiendra les données récupérées

  //   constructor(
  //     private savingDetailService: SavingDetailService
  //   ) {}
  //   clientTontines: Tontine | [] | null = null

  //   ngOnInit() {
  //     this.getClientTontines();
  //   }

  //   getClientTontines() {
  //     this.savingDetailService.getDonnees().subscribe(
  //     (donnees: Tontine[]) => {
  //     this.tontines = donnees; // Assigner les données récupérées à la variable
  //     console.log('Éléments récupérés:', this.tontines);
  //     },
  //     (erreur) => {
  //     console.error('Erreur lors de la récupération des tontines:', erreur);
  //     }
  //     );
  //     }
}
