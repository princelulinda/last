// import { Injectable } from '@angular/core';
// import { ApiService } from '../api/api.service';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { Tontine } from '../../../components/saving/tontine.model';

// @Injectable({
// providedIn: 'root',
// })
// export class SavingDetailService {
// constructor(private apiService: ApiService) {}
// tontines: Tontine[] = [];
// getDonnees(): Observable<Tontine[]> {
// const url = '/tontines/list/?registered=true';
// return this.apiService.get(url).pipe(
// map((data: any) => {
// // Vérifier si 'data' est un objet et non un tableau
// if (typeof data === 'object' && !Array.isArray(data)) {
// // Transformer l'objet en tableau
// return Object.values(data.objects).map((item: any) => {
// return {
// id: item.id,

// members_count: item.members_count,
// short_description: item.short_description
// } as Tontine;
// });
// } else {
// // Si data est déjà un tableau, on le renvoie tel quel
// return data;
// }
// })
// );
// }
// }
