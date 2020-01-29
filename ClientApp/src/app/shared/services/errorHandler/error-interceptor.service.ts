import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CustomToast } from '../../components/atoms/custom-toast/custom-toast.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {
  serviceType: string[];
  constructor(private toastr: ToastrService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      // gestione di una request andata a buon fine
      tap(evt => {
        if (evt instanceof HttpResponse) {
          this.serviceType = req.url.split('/');
          if (this.serviceType.find(el => el === 'Customers') || this.serviceType.find(el => el === 'Diary')) {
            if (req.method === 'PUT' || req.method === 'POST') {
              if (this.serviceType.find(el => el === 'ConfirmAppointment')) {
                this.toastr.show('Appointment confirmed', null, {
                  toastComponent: CustomToast,
                  positionClass: 'toast-bottom-left',
                });
              } else if (this.serviceType.find(el => el === 'DeleteAppointment')) {
                this.toastr.show('Appointment cancelled', null, {
                  toastComponent: CustomToast,
                  positionClass: 'toast-bottom-left',
                });
              } else {
                this.toastr.show('Success', null, {
                  toastComponent: CustomToast,
                  positionClass: 'toast-bottom-left',
                });
              }
            }
          }
        }
      }),
      // gestione di una request non andata a buon fine
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        let errorCode = '';
        if (error.error instanceof ErrorEvent) {
          // server-side error
          errorMessage = `Error: ${error.message}`;
          this.toastr.error(errorMessage, null, {
            positionClass: 'toast-bottom-left',
          });
        } else {
          switch (error.status) {
            case 400:
            case 404:
              errorMessage = `Error: ${error.error.error.replace(/<[^>]*>/g, '')}`;
              errorCode = `Error Code: ${error.status}`;
              this.toastr.error(errorMessage, errorCode, {
                positionClass: 'toast-bottom-left',
                toastClass: 'ngx-toastr custom-error-toastr'
              });
              break;
            case 401:
              errorMessage = `Error: ${error.error.replace(/<[^>]*>/g, '')}`;
              errorCode = `Error Code: ${error.status}`;
              this.toastr.error(errorMessage, errorCode, {
                positionClass: 'toast-bottom-left',
              });
              break;
            default:
              errorMessage = `Error: ${error.message}`;
              errorCode = `Error Code: ${error.status}`;
              this.toastr.error(errorMessage, errorCode, {
                positionClass: 'toast-bottom-left',
              });
              break;
          }
        }
        return throwError(errorMessage);
      })
    );
  }
}
