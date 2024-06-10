import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class HTTPEncryptInterceptor implements HttpInterceptor {
  private key!: CryptoKey;

  constructor() {
    this.generateKey();
  }

  private generateKey(): void {
    // Générer une clé de cryptage aléatoire
    window.crypto.subtle
      .generateKey(
        {
          name: 'AES-GCM', // Spécifie l'algorithme de cryptage AES en mode GCM
          length: 256, // Définit la longueur de la clé en bits
        },
        true, // Indique si la clé peut être exportée (true = oui)
        ['encrypt', 'decrypt'] // Définit les usages possibles de la clé
      )
      .then(key => {
        // La promesse renvoie la clé générée
        this.key = key; // Attribue la clé générée à la propriété 'key' de l'objet
      });
  }

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Vérifiez si la requête a un corps à crypter
    if (req.body && this.key) {
      // Créer un vecteur d'initialisation (IV) aléatoire
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      // Encrypt the body and handle the request
      return this.encrypt(JSON.stringify(req.body), this.key, iv).pipe(
        switchMap(encrypted => {
          // Cloner la requête avec le corps crypté et l'IV
          const clonedReq = req.clone({
            body: encrypted,
            // headers: req.headers.set('X-IV', btoa(String.fromCharCode(...iv))),
          });
          // Pass the cloned request to the next handler
          return next.handle(clonedReq);
        })
      );
    }

    // Si la requête n'a pas de corps, passez-la sans modification
    return next.handle(req);
  }
  private encrypt(
    data: string, // Les données en texte clair à chiffrer
    key: CryptoKey, // La clé cryptographique utilisée pour le chiffrement
    iv: Uint8Array // Le vecteur d'initialisation pour le chiffrement AES-GCM
  ): Observable<string> {
    return new Observable(observer => {
      // Création d'un nouvel Observable
      window.crypto.subtle
        .encrypt(
          // Appel de la méthode encrypt de l'API Web Crypto
          {
            name: 'AES-GCM', // Spécification de l'algorithme AES-GCM pour le chiffrement
            iv: iv, // Utilisation du vecteur d'initialisation fourni
          },
          key, // Utilisation de la clé cryptographique fournie
          new TextEncoder().encode(data) // Encodage des données en texte clair en un ArrayBuffer
        )
        .then(encrypted => {
          // Gestion de la promesse lorsque le chiffrement réussit
          observer.next(
            btoa(String.fromCharCode(...new Uint8Array(encrypted)))
          ); // Conversion des données chiffrées en chaîne base64 et émission via l'Observable
          observer.complete(); // Marquage de la complétion de l'Observable
        })
        .catch(error => {
          // Gestion des erreurs lors du chiffrement
          observer.error(error); // Émission de l'erreur via l'Observable
        });
    });
  }
}
