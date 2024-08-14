import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PublicationService {
  constructor(private apiService: ApiService) {}

  getPublicationType() {
    const url = '/socialnetwork/publication-type/';
    return this.apiService.get(url).pipe(map(data => data));
  }

  getPublication() {
    const url = '/socialnetwork/publication/';
    return this.apiService.get(url).pipe(map(data => data));
  }

  getPublicationCategory() {
    const url = '/socialnetwork/publication-category/';
    return this.apiService.get(url).pipe(map(data => data));
  }

  pubicationComments() {
    const url = '/socialnetwork/publication-comments/';
    return this.apiService.get(url).pipe(map(data => data));
  }
}
