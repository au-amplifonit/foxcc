import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AppointmentsApiService } from 'src/app/core/services/api/appointments/appointments-api.service';
import { AppointmentSlot } from 'src/app/shared/models/appointmentSlot.model';
import { ActivatedRoute, Params } from '@angular/router';
import { AppointmentParams } from 'src/app/shared/models/appointmentParams.model';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Appointment } from 'src/app/shared/models/common/appointment.model';
import { getWeek } from './appointments.utils';
import { combineLatest, of, Subject, Subscription, forkJoin } from 'rxjs';
import { CustomerApiService } from 'src/app/core/services/api/customer/customer-api.service';
import { Customer } from 'src/app/shared/models/customer.model';
import { switchMap, tap, map, take, takeUntil } from 'rxjs/operators';
import { FullCalendarComponent } from '@fullcalendar/angular';
import auLocale from '@fullcalendar/core/locales/en-au';
import { Clinic } from 'src/app/shared/models/common/clinic.model';
import { ShareCustomerElementService } from 'src/app/shared/share-customer-element-service.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AppointmentModalComponent } from './appointment-modal/appointment-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { InfoModalComponent } from 'src/app/shared/components/info-modal/info-modal.component';

@Component({
  selector: 'fcw-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calendar', { static: true })
  calendarComponent: FullCalendarComponent;

  showCalendar = false;
  bsValue: Date = moment(new Date()).toDate();
  minDate: Date = moment(new Date()).toDate();
  maxDate: Date = moment(new Date()).toDate();
  weekNumber: number;
  disablePrev: boolean;
  disableNext: boolean;
  disableToday = true;
  appointmentToReschedule: any;
  calendarPlugins = [timeGridPlugin];
  events: AppointmentSlot[] = [];
  services: Appointment[];
  clinics: Clinic[];
  qParams: Params;
  customerShopCode: string;
  customerId: string = null;
  customer: Customer;
  nullCustomerId = false;
  showCustomerClinic = false;
  customerFromLead: Customer;
  xid: string = null;
  callid: string;
  source: string;
  subsource: string;
  campaigncode: string;
  mediatypecode: string;
  referralsourcecode: string;
  calendarOptions = { weekday: 'short', day: 'numeric', omitCommas: true };
  timeSlots = [
    { time: '15' },
    { time: '20' },
    { time: '25' },
    { time: '30' },
    { time: '35' },
    { time: '40' },
    { time: '45' },
    { time: '50' },
    { time: '55' },
    { time: '60' }
  ];
  appointmentParams: AppointmentParams = {
    shopCode: '010',
    serviceCode: 'SCREEN01',
    slotSize: '20',
    startDate: '2019-10-21',
    endDate: '2019-10-22'
  };
  appointmentSlots = [];
  sub$: Subscription;

  bsModalRef: BsModalRef;
  datePickerValue = new Date();
  weekRange: any = {};
  clinicAddress: any;

  constructor(
    private appointmentService: AppointmentsApiService,
    private share: ShareCustomerElementService,
    private customerService: CustomerApiService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private commonService: CommonService
  ) {}

  getAppointmentService = (serviceCode: string) => {
    return this.services.find(service => service.code === serviceCode)
      .description;
  }

  setShow(data) {
    this.openModal(data);
  }

  openModal(data: any) {
    if (this.modalService.getModalsCount() === 0) {
      this.bsModalRef = this.modalService.show(AppointmentModalComponent, {
        ignoreBackdropClick: true,
        initialState: {
          appointmentPayload: data
        }
      });
      this.bsModalRef.setClass('modal-fixed-right');
    }
    this.bsModalRef.content.closeBtnName = 'Close';
    // this.bsModalRef.content.data = data;
  }

  handleClinicChange = $event => {
    this.showCustomerClinic = false;
  }

  handleSetClinic = $event => {
    this.customer.shopCode = $event.target.value;
    this.customer.shopDescription = this.clinics.find(
      clinic => this.customer.shopCode === clinic.code
    ).description;
    // Roba da spostare
    this.commonService
      .getClinicAddress(this.customer.shopCode)
      .subscribe(clinicData => {
        this.clinicAddress = clinicData;
      });
    this.appointmentParams.shopCode = this.customer.shopCode;
    this.spinner.show('spinner');
    this.appointmentService
      .getAppointmentsSlots(this.appointmentParams)
      .subscribe(slots => {
        const color = this.qParams.appointmentGuid ? 'blueviolet' : 'royalblue';
        slots.forEach(event => {
          event.backgroundColor = color;
          event.borderColor = 'unset';
          event.textColor = 'white';
        });
        this.events = slots;
        this.spinner.hide('spinner');
        this.showCalendar = true;
      });
    this.showCustomerClinic = true;
  }

  handleToday = () => {
    this.weekRange = getWeek(new Date());
    this.datePickerValue = new Date();
    const calendarApi = this.calendarComponent.getApi();
    this.appointmentParams.startDate = this.weekRange.startOfWeek;
    this.appointmentParams.endDate = this.weekRange.endOfWeek;
    this.spinner.show('spinner');
    this.appointmentService
      .getAppointmentsSlots(this.appointmentParams)
      .subscribe(slots => {
        const color = this.qParams.appointmentGuid ? 'blueviolet' : 'royalblue';
        slots.forEach(event => {
          event.backgroundColor = color;
          event.borderColor = 'unset';
          event.textColor = 'white';
        });
        this.events = slots;
        this.showCalendar = true;
        this.spinner.hide('spinner');
        this.bsValue = new Date();
        calendarApi.today();
        this.disableNextButton();
        this.disablePrevButton();
      });
  }

  handleNext = () => {
    const calendarApi = this.calendarComponent.getApi();
    this.weekRange.startOfWeek = moment(this.weekRange.startOfWeek)
      .add(7, 'days')
      .format('YYYY-MM-DD');
    this.weekRange.endOfWeek = moment(this.weekRange.endOfWeek)
      .add(7, 'days')
      .format('YYYY-MM-DD');
    this.appointmentParams.startDate = this.weekRange.startOfWeek;
    this.appointmentParams.endDate = this.weekRange.endOfWeek;
    this.spinner.show('spinner');
    this.appointmentService
      .getAppointmentsSlots(this.appointmentParams)
      .subscribe(slots => {
        const color = this.qParams.appointmentGuid ? 'blueviolet' : 'royalblue';
        slots.forEach(event => {
          event.backgroundColor = color;
          event.borderColor = 'unset';
          event.textColor = 'white';
        });
        this.events = slots;
        this.bsValue = moment(this.bsValue)
          .add(7, 'days')
          .toDate();
        calendarApi.next();
        this.spinner.hide('spinner');
        this.showCalendar = true;
        this.disableNextButton();
        this.disablePrevButton();
      });
  }

  handlePrev = () => {
    const calendarApi = this.calendarComponent.getApi();
    this.weekRange.startOfWeek = moment(this.weekRange.startOfWeek)
      .subtract(7, 'days')
      .format('YYYY-MM-DD');
    this.weekRange.endOfWeek = moment(this.weekRange.endOfWeek)
      .subtract(7, 'days')
      .format('YYYY-MM-DD');
    this.appointmentParams.startDate = this.weekRange.startOfWeek;
    this.appointmentParams.endDate = this.weekRange.endOfWeek;
    this.spinner.show('spinner');
    this.appointmentService
      .getAppointmentsSlots(this.appointmentParams)
      .subscribe(slots => {
        const color = this.qParams.appointmentGuid ? 'blueviolet' : 'royalblue';
        slots.forEach(event => {
          event.backgroundColor = color;
          event.borderColor = 'unset';
          event.textColor = 'white';
        });
        this.events = slots;
        calendarApi.prev();
        this.bsValue = moment(this.bsValue)
          .subtract(7, 'days')
          .toDate();
        this.spinner.hide('spinner'), (this.showCalendar = true);
        this.disablePrevButton();
        this.disableNextButton();
      });
  }

  handleEventClick = async $event => {

    let modalPayload: any = {};
    if (this.customerId === null) {
      modalPayload = {
        customer: { ...this.customer },
        appointmentDate: $event.event.start,
        xid: this.xid,
        canBook: true,
        referralSourceCode: this.referralsourcecode,
        callId: this.qParams.callid ? this.qParams.callid : '',
        mediaTypeCode: this.mediatypecode,
        sourceCode: this.source,
        appointmentShopDescription: this.customer.shopDescription,
        subSourceCode: this.subsource,
        campaignCode: this.campaigncode,
        duration: this.appointmentParams.slotSize,
        roomDescription: $event.event.extendedProps.resourceDescription,
        appointmentShopCode: this.appointmentParams.shopCode,
        roomCode: $event.event.extendedProps.resourceId,
        appointmentType: {
          description: this.getAppointmentService(
            this.appointmentParams.serviceCode
          ),
          code: this.appointmentParams.serviceCode
        }
      };
    } else {
      const res = await this.appointmentService
        .canBookAppointment(
          {
            customerCode: this.customer.id,
            shopCode: this.appointmentParams.shopCode,
            serviceCode: 'SCREEN01',
            appointmentDate: moment($event.event.start).format(
              'YYYY-MM-DD[T]HH:mm:ss'
            )
          },
          this.qParams.appointmentGuid
        )
        .toPromise();
      let resAppointment: any;

      if (this.qParams.appointmentGuid) {
        resAppointment = await this.appointmentService
          .getAppointment(this.qParams.appointmentGuid)
          .toPromise();
      }

      modalPayload = {
        customer: { ...this.customer },
        appointmentDate: $event.event.start,
        xid: this.xid,
        callId: this.qParams.callid ? this.qParams.callid : '',
        mediaTypeCode: this.mediatypecode,
        campaignCode: this.campaigncode,
        duration: this.appointmentParams.slotSize,
        appointmentShopDescription: this.customer.shopDescription,
        roomDescription: $event.event.extendedProps.resourceDescription,
        appointmentShopCode: this.appointmentParams.shopCode,
        roomCode: $event.event.extendedProps.resourceId,
        canBook: res.result,
        note: resAppointment && resAppointment.note ? resAppointment.note : '',
        reschedule: this.qParams.reschedule ? true : false,
        canBookMessage: res.message,
        oldRowGuid: this.qParams.appointmentGuid
          ? this.qParams.appointmentGuid
          : null,
        appointmentType: {
          description: this.getAppointmentService(
            this.appointmentParams.serviceCode
          ),
          code: this.appointmentParams.serviceCode
        }
      };
    }
    if (this.xid === null) {
      delete modalPayload.xid;
    }
    this.share.emitAppointmentData(modalPayload);
  }

  getShopCodeByPostalCode = async (postCode: string) => {
    const updatedPostCode = postCode === null ? '' : postCode;
    const res = await this.commonService
      .GetClinicByPostCode(updatedPostCode)
      .toPromise();
    this.customer.shopCode = res.code;
    this.customer.shopDescription = res.description;
    if (this.xid) {
      this.showCustomerClinic = true;
    }
    return res.code;
  }

  getAppointmentsSlots = () => {
    if (this.qParams.callid) {
      this.callid = this.qParams.callid;
    }
    if (this.qParams.source) {
      this.source = this.qParams.source;
    }
    if (this.qParams.subsource) {
      this.subsource = this.qParams.subsource;
    }
    if (this.qParams.campaigncode) {
      this.campaigncode = this.qParams.campaigncode;
    }
    if (this.qParams.mediatypecode) {
      this.mediatypecode = this.qParams.mediatypecode;
    }
    if (this.qParams.referralsource) {
      this.referralsourcecode = this.qParams.referralsource;
    }

    if (this.qParams.xid) {
      this.xid = this.qParams.xid;
      this.disableToday = true;
      this.customerService
        .getCustomerFromLead(this.qParams.xid)
        .pipe(
          tap(customer => {
            if (customer.shopCode === null) {
              this.showCustomerClinic = false;
            } else {
              this.showCustomerClinic = true;
            }
            this.customer = customer;
            this.customerService.updateCustomer(this.customer);
          }),
          switchMap(async customer => {
            this.appointmentParams.shopCode =
              customer.shopCode !== '000' && customer.shopCode !== null
                ? customer.shopCode
                : await this.getShopCodeByPostalCode(
                    customer.addresses[0].zipCode
                  );
            return of(this.appointmentParams.shopCode);
          }),
          switchMap(() =>
            forkJoin([
              this.appointmentService.getAppointmentsSlots(
                this.appointmentParams
              ),
              this.commonService.getClinicAddress(
                this.appointmentParams.shopCode
              )
            ])
          ),
          map(([data, resClinic]) => {
            const color = this.qParams.appointmentGuid
              ? 'blueviolet'
              : 'royalblue';
            data.forEach(event => {
              event.backgroundColor = color;
              event.textColor = 'white';
            });
            this.events = data;
            this.disableToday = false;
            this.clinicAddress = resClinic;
          })
        )
        .subscribe(() => {
          this.spinner.hide('spinner'), (this.showCalendar = true);
        });
    }
    if (this.qParams.customerId) {
      this.customerId = this.qParams.customerId;
      this.customerService
        .getCustomer(this.qParams.customerId)
        .pipe(
          tap(customer => {
            if (customer.shopCode === null) {
              this.showCustomerClinic = false;
            } else {
              this.showCustomerClinic = true;
            }
            this.customer = customer;
            this.customerService.updateCustomer(this.customer);
          }),
          switchMap(async customer => {
            this.appointmentParams.shopCode =
              customer.shopCode !== '000' && customer.shopCode !== null
                ? customer.shopCode
                : (customer.addresses.length > 0
                ? await this.getShopCodeByPostalCode(
                    customer.addresses[0].zipCode
                  )
                : null);
            return of(this.appointmentParams.shopCode);
          }),
          switchMap(() => {

            if (this.appointmentParams.shopCode === null) {
              return this.appointmentService.getAppointmentsSlots(
                this.appointmentParams
              );
            } else {
              return forkJoin([
                this.appointmentService.getAppointmentsSlots(
                  this.appointmentParams
                ),
                this.commonService.getClinicAddress(
                  this.appointmentParams.shopCode
                )
              ]);
            }

          }
          ),
          map((_data: any) => {
            const color = this.qParams.appointmentGuid ? 'blueviolet' : 'royalblue';
            if (Array.isArray(_data) && _data.length > 0) {
              const [data, resClinic] = _data;
              ( data as Array<AppointmentSlot>).forEach(event => {
                  event.backgroundColor = color;
                  event.borderColor = 'unset';
                  event.textColor = 'white';
                });
              this.clinicAddress = resClinic;
              this.disableToday = false;
              this.events = data;
            }
          })
        )
        .subscribe(() => {
          this.spinner.hide('spinner'), (this.showCalendar = true);
        });
    }
  }

  pickerChanged = $event => {
    this.bsValue = $event;
    this.weekRange = getWeek($event);
    this.weekNumber = moment(this.bsValue).week();
    const calendarApi = this.calendarComponent.getApi();
    this.appointmentParams.startDate = this.weekRange.startOfWeek;
    this.appointmentParams.endDate = this.weekRange.endOfWeek;
    this.spinner.show('spinner');
    this.appointmentService
      .getAppointmentsSlots(this.appointmentParams)
      .subscribe(slots => {
        const color = this.qParams.appointmentGuid ? 'blueviolet' : 'royalblue';
        slots.forEach(event => {
          event.backgroundColor = color;
          event.borderColor = 'unset';
          event.textColor = 'white';
        });
        this.events = slots;
        calendarApi.gotoDate($event);
        this.spinner.hide('spinner');
        this.showCalendar = true;
      });
  }

  ngOnInit() {
    // necessario settare per la condizione nelle funzioni disableNextButton() edisablePrevButton()
    this.weekNumber = moment(this.bsValue).week();
    this.minDate.setHours(0);
    this.minDate.setMinutes(0);
    this.minDate.setSeconds(0.0);
    this.minDate.setMilliseconds(0);
    this.maxDate.setDate(this.minDate.getDate() + 35);
    this.maxDate.setHours(0);
    this.maxDate.setMinutes(0);
    this.maxDate.setSeconds(0.0);
    this.maxDate.setMilliseconds(0);
    this.bsValue.setHours(0);
    this.bsValue.setMinutes(0);
    this.bsValue.setSeconds(0.0);
    this.bsValue.setMilliseconds(0);
    this.disablePrevButton();
    this.disableNextButton();
    this.weekRange = getWeek(new Date());
    this.sub$ = this.share.appointmentDataEmitted$.subscribe(m => {
      this.setShow(m);
    });

    const combinedCoreServices = combineLatest([
      this.commonService.getService(),
      this.route.queryParams,
      this.commonService.getClinic()
    ]);
    combinedCoreServices
      .pipe(tap(e => this.spinner.show('spinner')))
      .subscribe(responses => {
        this.services = responses[0];
        this.qParams = responses[1];
        this.clinics = responses[2];
        /* DEFAULT VALUES */
        this.appointmentParams.serviceCode = this.services.find(
          service => service.code === 'SCREEN01'
        ).code;
        this.appointmentParams.slotSize = this.services
          .find(service => service.code === 'SCREEN01')
          .defaultDuration.toString();
        this.appointmentParams.startDate = getWeek(new Date()).startOfWeek;
        this.appointmentParams.endDate = getWeek(new Date()).endOfWeek;
        /* GET APPOINTMENTS SLOTS*/
        if (this.qParams.appointmentGuid) {
          this.appointmentService
            .getAppointment(this.qParams.appointmentGuid)
            .subscribe(data => {
              this.appointmentToReschedule = data;
            });
        }
        const hasXid = this.qParams.xid && this.qParams.xid.length > 0 ? true : false;
        const hasCustomerId = this.qParams.customerId && this.qParams.customerId.length > 0 ? true : false;
        if ( hasCustomerId || hasXid ) {
          this.getAppointmentsSlots();
        } else {
          this.spinner.hide('spinner');
          this.nullCustomerId = true;
        }
      });
  }

  ngAfterViewInit() {
    this.calendarOpt();
  }

  calendarOpt() {
    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.setOption('locales', [auLocale]);
      calendarApi.setOption('validRange', {
        start: this.minDate,
        end: this.maxDate
      });
    }
  }

  openInfoModal() {
    if (this.modalService.getModalsCount() === 0) {
      const initialState = {
        clinicDetails: {
          addressData: this.clinicAddress,
          clinicName: this.customer.shopDescription
        }
      };
      if (this.clinicAddress && this.customer.shopDescription) {
        this.bsModalRef = this.modalService.show(InfoModalComponent, {
          class: 'modal-dialog modal-dialog-centered modal-lg',
          initialState
        });
      }
    }
  }

  disablePrevButton() {
    this.weekNumber = moment(this.bsValue).week();
    let testDateMin: Date = new Date();
    // testDate.setDate(this.bsValue.getDate() - 7);
    testDateMin = moment(this.bsValue)
      .subtract(7, 'days')
      .toDate();
    if (testDateMin < this.minDate) {
      this.disablePrev = true;
    } else {
      this.disablePrev = false;
    }
  }

  disableNextButton() {
    this.weekNumber = moment(this.bsValue).week();
    let testDate: Date = new Date();
    testDate = moment(this.bsValue)
      .add(7, 'days')
      .toDate();
    if (testDate > this.maxDate) {
      this.disableNext = true;
    } else {
      this.disableNext = false;
    }
  }
  ngOnDestroy() {
    this.sub$.unsubscribe();
  }
}
