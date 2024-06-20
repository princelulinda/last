import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

import { map } from 'rxjs/operators';
import { Tontine } from '../../../components/saving/tontine.model';

@Injectable({
  providedIn: 'root',
})
export class SavingDetailService {
  constructor(private apiService: ApiService) {}
  tontines: Tontine[] = [];
  getDonnees() {
    const url = '/tontines/list/?registered=true';
    return this.apiService.get(url).pipe(
      map(data => {
        // Vérifier si 'data' est un objet et non un tableau
        {
          // Transformer l'objet en tableau
          return Object.values(data).map(item => {
            return {
              id: item.id,

              members_count: item.members_count,
              short_description: item.short_description,
            } as Tontine;
          });
        }
      })
    );
  }
}
