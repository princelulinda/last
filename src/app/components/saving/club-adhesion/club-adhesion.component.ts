import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { SavingDetailService } from '../../../core/services/saving/saving.service';
import { TontineDataModele } from '../saving.models';
import { Observable } from 'rxjs';

import { ReactiveFormsModule } from '@angular/forms';
import { activeMainConfigModel } from '../../../core/services/config/main-config.models';
@Component({
  selector: 'app-club-adhesion',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './club-adhesion.component.html',
  styleUrl: './club-adhesion.component.scss',
})
export class ClubAdhesionComponent implements OnInit {
  mainConfig$!: Observable<activeMainConfigModel>;
  mainConfig!: activeMainConfigModel;
  tontineId!: number;
  myForm!: FormGroup;
  isChecked = false;
  savingData!: TontineDataModele;
  part!: number;
  contribution!: number;
  showInfo = false;
  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private savingDetailService: SavingDetailService
  ) {
    this.myForm = new FormGroup({
      contribution: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/),
      ]),
      isRenewable: new FormControl<boolean>(
        this.isChecked,
        Validators.required
      ),
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params: Params) => {
        // Assurez-vous que 'tontineId' est un nombre en utilisant l'opérateur '+'
        this.tontineId = params['tontineId'];
        if (this.tontineId) {
          this.getSavingData();
          //  this.getSavingDat();
        }
        console.log('Tontine ID:', this.tontineId);
      },
    });

    this.myForm.get('contribution')?.valueChanges.subscribe(() => {
      this.calculateValue();
    });
  }

  getSavingData() {
    this.savingDetailService.getSavingData(this.tontineId).subscribe({
      next: (response: { tontine: TontineDataModele }) => {
        // Puisque 'response.tontine' est un objet, vous pouvez l'assigner directement
        // à 'this.savingData' si 'this.savingData' est de type 'TontineDataModele | null'
        this.savingData = response.tontine;
        console.log('Données de tontine:', this.savingData);
      },
      error: (error: Error) =>
        console.error('Erreur lors de la récupération des tontines:', error),
    });
  }

  // getSavingDat() {
  //   this.savingDetailService.getSavingData(this.tontineId).subscribe({
  //     next: (response: { tontine: TontineDataModele }) => {
  //       // Puisque 'response.tontine' est un objet, vous pouvez l'assigner directement
  //       this.savingData = {
  //         name: response.tontine.name,
  //         members_count: response.tontine.members_count,
  //         penalities: response.tontine.penalities,
  //         mise_perso: response.tontine.mise_perso,
  //         contribution: response.tontine.contribution,
  //       };
  //       console.log('Données sélectionnées', this.savingData);
  //     },
  //     error: (error: Error) =>
  //       console.error('Erreur lors de la récupération des tontines:', error),
  //   });
  // }

  //function to calculate contributions amd shares
  calculateValue() {
    const contribution = parseFloat(
      this.myForm.get('contribution')?.value || '0'
    );
    if (!isNaN(contribution)) {
      // const calculatedValue =  this.savingData.mise_perso;
      // const contr = contribution * this.savingData.contribution;
    } else {
      this.part = 0;
      this.contribution = 0;
    }
  }

  toggleCheckbox() {
    this.isChecked = !this.isChecked;
    this.cdr.detectChanges();
    this.myForm.patchValue({
      isRenewable: this.isChecked,
    });
    // console.log(this.myForm.value);
  }
}
