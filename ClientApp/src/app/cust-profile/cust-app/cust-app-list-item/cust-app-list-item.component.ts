import { Component, OnInit, Input } from '@angular/core';
import { CustomerAppointment } from 'src/app/shared/models/customerAppointment.model';
import * as moment from 'moment';
import { ButtonMenuItemsList } from 'src/app/shared/models/utility/button-menu-items-list';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { AppointmentModalComponent } from '../../appointments/appointment-modal/appointment-modal.component';
import { AppointmentsApiService } from 'src/app/core/services/api/appointments/appointments-api.service';
import { CustAppModalComponent } from '../cust-app-modal/cust-app-modal.component';
import { ShareCustomerElementService } from 'src/app/shared/share-customer-element-service.service';
import {
  Router,
  ActivatedRouteSnapshot,
  ActivatedRoute
} from '@angular/router';
import { NotesModalComponent } from '../../notes/notes-modal/notes-modal.component';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { TouchSequence } from 'selenium-webdriver';
import { InfoModalComponent } from 'src/app/shared/components/info-modal/info-modal.component';

@Component({
  selector: 'fcw-cust-app-list-item',
  templateUrl: 'cust-app-list-item.component.html',
  styleUrls: ['./cust-app-list-item.component.scss']
})
export class CustAppListItemComponent implements OnInit {
  @Input() appointment: any;
  @Input() isPreview: boolean;
  @Input() isClinic: boolean;
  @Input() clientActions: ButtonMenuItemsList[];
  @Input() hasElipsis: boolean;
  @Input() reschedule: boolean;
  @Input() clinicSchedule: boolean;
  @Input() isAppointment: boolean;
  public appointmentEnd;
  public bsModalRef: BsModalRef;
  public menuItems = [];
  public ellippsisToggle = false;
  constructor(
    private modalService: BsModalService,
    private appointmentApiService: AppointmentsApiService,
    private share: ShareCustomerElementService,
    private router: Router,
    private common: CommonService
  ) {}

  ngOnInit() {
    this.appointmentEnd = moment(this.appointment.appointmentDate)
      .add(`${this.appointment.duration}`, 'm')
      .toDate();
    if (this.appointment.statusCode === 'A') {
      this.hasElipsis = true;
      this.menuItems.push(
        {
          id: 'confirm-event',
          url: 'null',
          icon: '../../../../assets/img/svg/checkmark-circle-outline_2.svg',
          text: 'Confirm',
          eventName: 'confirm-event'
        },
        {
          id: 'edit-event',
          url: 'null',
          icon: '../../../../assets/img/svg/create_2.svg',
          text: 'Edit Notes',
          eventName: 'edit-event'
        },
        {
          id: 'reschedule-event',
          url: 'null',
          icon: '../../../../assets/img/svg/book-appointment-grey_2.svg',
          text: 'Reschedule',
          eventName: 'reschedule-event'
        },
        {
          id: 'cancel-event',
          url: 'null',
          icon: '../../../../assets/img/svg/close-black.svg',
          text: 'Cancel',
          eventName: 'cancel-event'
        }
      );
    } else if(this.appointment.statusCode === 'D') {
      this.hasElipsis = true;
      this.menuItems.push(
        {
          id: 'edit-event',
          url: 'null',
          icon: '../../../../assets/img/svg/create_2.svg',
          text: 'Edit Notes',
          eventName: 'edit-event'
        },
        {
          id: 'reschedule-event',
          url: 'null',
          icon: '../../../../assets/img/svg/book-appointment-grey_2.svg',
          text: 'Reschedule',
          eventName: 'reschedule-event'
        },
        {
          id: 'delete-event',
          url: 'null',
          icon: '../../../../assets/img/svg/close-black.svg',
          text: 'Cancel',
          eventName: 'cancel-event'
        }
      );
    } else if (
      this.appointment.statusCode === 'C' ||
      this.appointment.statusCode === 'CP'
    ) {
      this.hasElipsis = true;
      this.menuItems.push(
        {
          id: 'edit-event',
          url: 'null',
          icon: '../../../../assets/img/svg/create_2.svg',
          text: 'Edit Notes',
          eventName: 'edit-event'
        },
        {
          id: 'delete-event',
          url: 'null',
          icon: '../../../../assets/img/svg/close-black.svg',
          text: 'Cancel',
          eventName: 'cancel-event'
        }
      );
    } else {
      this.hasElipsis = false;
    }
  }

  doAction(event: string): void {
    if (event === 'cancel-event') {
      this.bsModalRef = this.modalService.show(CustAppModalComponent, {
        initialState: {
          appointmentData: this.appointment
        }
      });
      this.bsModalRef.setClass('modal-dialog-centered');
      this.bsModalRef.content.closeBtnName = 'Close';
    }
    if (event === 'confirm-event') {
      this.appointmentApiService
        .confirmAppointment(this.appointment.rowGuid)
        .subscribe(data => this.share.emitReload());
    }
    if (event === 'reschedule-event') {
      this.router.navigate(
        ['main', 'custProfile', 'appointments', 'newAppointment'],
        {
          queryParams: {
            customerId: this.appointment.customerCode,
            appointmentGuid: this.appointment.rowGuid,
            reschedule: true
          }
        }
      );
    }
    if (event === 'edit-event') {
      this.bsModalRef = this.modalService.show(NotesModalComponent, {
        class: 'modal-dialog modal-dialog-centered modal-lg',
        initialState: {
          type: 'edit-appointment-note',
          appointmentData: this.appointment
        }
      });
    }
  }
  setEllipsisToggle(ellipsisToggle) {
    this.ellippsisToggle = ellipsisToggle;
  }
  openInfoModal() {
    this.common.getClinicAddress(this.appointment.appointmentShopCode).subscribe(
      data => {
        if (this.modalService.getModalsCount() <= 2) {
          const initialState = {
            clinicDetails: {
              addressData: data,
              clinicName: this.appointment.appointmentShopDescription ? this.appointment.appointmentShopDescription : this.appointment.customer.shopDescription
            }
          };
          if (data.address[0]) {
            this.bsModalRef = this.modalService.show(InfoModalComponent, {
              class: 'modal-dialog modal-dialog-centered modal-lg',
              initialState
            });
          }
        }
      }
    );
  }
}
