import { Component, OnInit } from '@angular/core';
import { CustomerListItem } from '../../models/customer.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AppointmentsApiService } from 'src/app/core/services/api/appointments/appointments-api.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { CommonService } from '../../services/common/common.service';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {  FormControl } from '@angular/forms';
import * as moment from 'moment';
import { CustomerApiService } from 'src/app/core/services/api/customer/customer-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'fcw-quick-view',
  templateUrl: 'quick-view.component.html',
  styleUrls: ['./quick-view.component.scss']
})
export class QuickViewComponent implements OnInit {
  customer: CustomerListItem;
  customerNetxAppointment: any;
  disabled = false;
  disabledSaveNoteButton = false;
  noteForm: FormControl;
  constructor(
    private appointmentApiService: AppointmentsApiService,
    private common: CommonService,
    private modalService: BsModalService,
    public bsModalRef: BsModalRef,
    public bsModalRefClinic: BsModalRef,
    private customerApi: CustomerApiService,
    private route: Router
  ) {}

  ngOnInit() {
    this.getCustomerNextAppointment();
    this.noteForm = new FormControl('');
  }

  getCustomerNextAppointment() {
    this.appointmentApiService
      .customerNextAppointment(this.customer.id)
      .subscribe(data => {
        this.customerNetxAppointment = data;
      });
  }
  confirmAppointment(rowguid: string) {
    this.disabled = true;
    this.appointmentApiService.confirmAppointment(rowguid).pipe(
      catchError(error => of(this.disabled = false))
    ).subscribe();
  }
  openInfoModal() {
    this.common
      .getClinicAddress(this.customerNetxAppointment.appointmentShopCode)
      .subscribe(data => {
        if (this.modalService.getModalsCount() === 1) {
          const initialState = {
            clinicDetails: {
              addressData: data,
              clinicName: this.customerNetxAppointment
                .appointmentShopDescription
                ? this.customerNetxAppointment.appointmentShopDescription
                : this.customerNetxAppointment.customer.shopDescription
            }
          };
          this.bsModalRefClinic = this.modalService.show(InfoModalComponent, {
            class: 'modal-dialog modal-dialog-centered modal-lg',
            initialState
          });
        }
      });
  }
  saveNote() {
    console.log(this.noteForm.value);
    this.disabledSaveNoteButton = true;
    const note = {
      customerCode: this.customer.id,
      noteCounter: 0,
      date: moment().format(
        'YYYY-MM-DD[T]HH:mm:ss'
      ),
      isReserved: false,
      description: this.noteForm.value,
      employeeDescription: null
    };
    this.customerApi.newNote(note).pipe(
      tap(x => this.disabledSaveNoteButton = false)
    ).subscribe();
  }

  goToProfile() {
    this.bsModalRef.hide();
    this.route.navigate(['/main/custProfile/acc-det/', this.customer.id]);
  }
}
