import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import { CustomerListItem } from './models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class ShareCustomerElementService {

  private emitDataSource = new Subject<any>();
  dataEmitted$ = this.emitDataSource.asObservable();

  private appointmentDataSource = new Subject<any>();
  appointmentDataEmitted$ = this.appointmentDataSource.asObservable();

  private searchDataSource = new Subject<any>();
  searchDataEmitted$ = this.searchDataSource.asObservable();

  private confirmedCustomerClinical = new Subject<CustomerListItem>();
  confirmedCustomerClinicalEmitted$ = this.confirmedCustomerClinical.asObservable();

  toggleAppointmentModal: Subject<boolean> = new Subject();
  toggleAppointmentModalEmitted$ = this.toggleAppointmentModal.asObservable();

  reloadAppointments: Subject<boolean> = new Subject();
  reloadAppointments$ = this.reloadAppointments.asObservable();


  constructor() { }

  emitData(data: any) {
    this.emitDataSource.next(data);
  }

  emitAppointmentData(data: any) {
    this.appointmentDataSource.next(data);
  }

  emitConfirmedCustomerClinical(data: CustomerListItem): void {
    this.confirmedCustomerClinical.next(data);
  }

  emitSearchData(data: any) {
    this.searchDataSource.next(data);
  }

  emitReload() {
    this.reloadAppointments.next(true);
  }
}
