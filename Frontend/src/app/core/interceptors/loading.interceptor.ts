import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, finalize } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isApiRequest = req.url.includes('/api/');
    // Solo mostrar loading global para mutaciones (POST/PUT/DELETE/PATCH)
    // Los GET (listados, paginación) usan skeleton loaders en la tabla
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
    const shouldShowGlobalLoading = isApiRequest && isMutation;

    if (shouldShowGlobalLoading) {
      this.loadingService.show();
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrido un error inesperado';
        
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error de red: ${error.error.message}`;
        } else {
          switch (error.status) {
            case 0:
              errorMessage = 'No se puede conectar al servidor. Verifique que la API esté ejecutándose.';
              break;
            case 400:
              errorMessage = error.error?.message || error.error?.title || 'Datos inválidos. Verifique los campos.';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado.';
              break;
            case 409:
              errorMessage = error.error?.message || 'Conflicto: el recurso ya existe.';
              break;
            case 500:
              errorMessage = error.error?.message || 'Error interno del servidor.';
              break;
            default:
              errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
          }
        }
        
        this.toastService.error(errorMessage);
        return throwError(() => error);
      }),
      finalize(() => {
        if (shouldShowGlobalLoading) {
          this.loadingService.hide();
        }
      })
    );
  }
}