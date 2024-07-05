import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  uploadSingleFile!: string;
  downloadFile!: string;
  deleteFiles!: number;
  progress!: number;
  thumbnails: SafeUrl[] = [];

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  uploadFiles() {
    const formData = new FormData();
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/octet-stream');
    const path = '/documents/';
    return this.http
      .post(environment.apiUrl + path, formData, {
        headers,
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        catchError(err => {
          console.error('An error occurred while sending the file:', err);
          return throwError(err);
        })
      );
  }

  uploadFile() {
    const formData = new FormData();
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/octet-stream');
    const path = '/documents/';
    return this.http.post(environment.apiUrl + path, formData, {
      headers,
      reportProgress: true,
      observe: 'events',
    });
  }

  deleteImage(id: number) {
    const path = '/documents/' + id;
    return this.http.delete(environment.apiUrl + path).pipe(
      catchError(err => {
        console.error('An error occurred while deleting the image:', err);
        return throwError(err);
      })
    );
  }
}
