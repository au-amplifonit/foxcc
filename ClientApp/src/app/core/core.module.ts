import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {CustomerApiService} from './services/api/customer/customer-api.service';
import { AppointmentsApiService } from './services/api/appointments/appointments-api.service';
import { ErrorInterceptorService } from '../shared/services/errorHandler/error-interceptor.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    CustomerApiService,
    AppointmentsApiService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true }
  ]
})
// @ts-ignore
export class CoreModule { }


