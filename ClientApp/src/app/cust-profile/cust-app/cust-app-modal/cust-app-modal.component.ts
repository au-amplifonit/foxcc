import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { CustomerAppointment } from 'src/app/shared/models/customerAppointment.model';
import { AppointmentsApiService } from 'src/app/core/services/api/appointments/appointments-api.service';
import { ShareCustomerElementService } from 'src/app/shared/share-customer-element-service.service';

@Component({
  selector: 'fcw-cust-app-modal',
  templateUrl: './cust-app-modal.component.html',
  styleUrls: ['./cust-app-modal.component.scss'],
})
export class CustAppModalComponent implements OnInit {
  public appointmentData: CustomerAppointment;

  constructor(
    public bsModalRef: BsModalRef,
    private appointmentService: AppointmentsApiService,
    private share: ShareCustomerElementService
  ) {}

  ngOnInit() {}

  cancelAppointment() {
    this.bsModalRef.hide();
    this.appointmentService
      .deleteAppointment(this.appointmentData)
      .subscribe(e => {
        this.share.emitReload();
      });
  }
}
