import { AuthService } from '../services/auth.service';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const authToken = inject(AuthService).getAuthToken();
  // Clone the request to add the authentication header.
  if (authToken) {
    const newReq = req.clone({
      headers: req.headers.set('Authorization', `Token ${authToken}`),
    });
    return next(newReq);
  }

  return next(req);
}
