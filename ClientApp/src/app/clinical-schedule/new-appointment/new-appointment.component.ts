import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { AppointmentSlot } from 'src/app/shared/models/appointmentSlot.model';
import { Appointment } from 'src/app/shared/models/common/appointment.model';
import { Clinic } from 'src/app/shared/models/clinic.model';
import { Params, ActivatedRoute } from '@angular/router';
import { Customer } from 'src/app/shared/models/customer.model';
import { AppointmentParams } from 'src/app/shared/models/appointmentParams.model';
import { Subscription, forkJoin } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AppointmentModalComponent } from 'src/app/cust-profile/appointments/appointment-modal/appointment-modal.component';
import { getWeek } from './new-appointment.utils';
import * as moment from 'moment';
import auLocale from '@fullcalendar/core/locales/en-au';
import { AppointmentsApiService } from 'src/app/core/services/api/appointments/appointments-api.service';
import { ShareCustomerElementService } from 'src/app/shared/share-customer-element-service.service';
import { CustomerApiService } from 'src/app/core/services/api/customer/customer-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/shared/services/common/common.service';
import timeGridPlugin from '@fullcalendar/timegrid';
import { InfoModalComponent } from 'src/app/shared/components/info-modal/info-modal.component';

@Component({
  selector: 'fcw-new-appointment',
  templateUrl: 'new-appointment.component.html',
  styleUrls: ['./new-appointment.component.scss']
})
export class NewAppointmentComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calendar', { static: true })
  calendarComponent: FullCalendarComponent;

  showCalendar = false;
  bsValue: Date;
  public minDate: Date = moment(new Date()).toDate();
  public maxDate: Date = moment(new Date()).toDate();
  disablePrev: boolean;
  disableNext: boolean;
  disableToday = true;
  calendarPlugins = [timeGridPlugin];
  events: AppointmentSlot[] = [];
  services: Appointment[];
  clinics: Clinic[];
  qParams: any;
  customerShopCode: string;
  customerId: string = null;
  customer: Customer;
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
  aviableSlots$: Subscription;
  bsModalRef: BsModalRef;
  datePickerValue: Date;
  weekRange: any = {};
  clinic: any;
  weekNumber: number;
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

  ngOnInit() {
    this.weekNumber = moment(this.bsValue).week();
    // necessario settare per la condizione nelle funzioni disableNextButton() edisablePrevButton()
    this.minDate.setHours(0);
    this.minDate.setMinutes(0);
    this.minDate.setSeconds(0.0);
    this.minDate.setMilliseconds(0);
    this.maxDate.setDate(this.minDate.getDate() + 35);
    this.maxDate.setHours(0);
    this.maxDate.setMinutes(0);
    this.maxDate.setSeconds(0.0);
    this.maxDate.setMilliseconds(0);

    this.bsValue = moment(
      this.route.snapshot.queryParamMap.get('day')
    ).toDate();
    this.datePickerValue = moment(
      this.route.snapshot.queryParamMap.get('day')
    ).toDate();
    this.handleInit();
    this.commonService.getService().subscribe(data => (this.services = data));
    this.sub$ = this.share.appointmentDataEmitted$.subscribe(m => {
      this.setShow(m);
    });
    this.commonService.getClinic().subscribe(el => {
      this.clinics = el;
      this.clinic = this.clinics.find(
        el => el.code === this.route.snapshot.queryParamMap.get('shopCode')
      ).description;
    });
    this.showCustomerClinic = true;
    this.aviableSlots$ = this.appointmentService.aviableSlots.subscribe(
      e =>
        (this.events = e.map(el => {
          return { ...el, backgroundColor: 'royalblue', textColor: 'white' };
        }))
    );
    this.disablePrevButton();
    this.disableNextButton();
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
      calendarApi.setOption('views', {
        timeGridWeek: { titleFormat: { weekday: 'short' } }
      });
    }
  }

  getAppointmentService = (serviceCode: string) => {
    return this.services.find(service => service.code === serviceCode)
      .description;
  }

  handleClinicChange = $event => {
    this.showCustomerClinic = false;
  }

  handleSetClinic = $event => {
    this.clinic = this.clinics.find(
      clinic => $event.target.value === clinic.code
    ).description;
    this.appointmentParams.shopCode = $event.target.value;
    this.commonService.getClinicAddress(this.appointmentParams.shopCode)
    .subscribe(clinicData => this.clinicAddress = clinicData);
    this.spinner.show('spinner');
    this.appointmentService
      .getAppointmentsSlots(this.appointmentParams)
      .subscribe(slots => {
        slots.forEach(event => {
          event.backgroundColor = 'royalblue';
          event.textColor = 'white';
        });
        this.events = slots;
        this.spinner.hide('spinner');
        this.showCalendar = true;
      });
    this.showCustomerClinic = true;
  }

  handleToday = () => {
    const calendarApi = this.calendarComponent.getApi();
    this.appointmentParams.shopCode = this.route.snapshot.queryParamMap.get(
      'shopCode'
    );
    this.weekRange = getWeek(new Date());
    this.appointmentParams.startDate = this.weekRange.startOfWeek;
    this.appointmentParams.endDate = this.weekRange.endOfWeek;
    this.spinner.show('spinner');
    this.appointmentService
      .getAppointmentsSlots(this.appointmentParams)
      .subscribe(slots => {
        slots.forEach(event => {
          event.backgroundColor = 'royalblue';
          event.textColor = 'white';
        });
        this.events = slots;
        this.spinner.hide('spinner');
        this.showCalendar = true;
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
        slots.forEach(event => {
          event.backgroundColor = 'royalblue';
          event.textColor = 'white';
        });
        this.events = slots;
        calendarApi.next();
        this.bsValue = moment(this.bsValue)
          .add(7, 'days')
          .toDate();
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
        slots.forEach(event => {
          event.backgroundColor = 'royalblue';
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
        slots.forEach(event => {
          event.backgroundColor = 'royalblue';
          event.textColor = 'white';
        });
        this.events = slots;
        calendarApi.gotoDate($event);
        this.spinner.hide('spinner');
        this.showCalendar = true;
      });
  }

  handleInit() {
    this.disableToday = true;
    this.appointmentParams.shopCode = this.route.snapshot.queryParamMap.get(
      'shopCode'
    );
    this.weekRange = getWeek(
      moment(this.route.snapshot.queryParamMap.get('day')).toDate()
    );
    this.appointmentParams.startDate = this.weekRange.startOfWeek;
    this.appointmentParams.endDate = this.weekRange.endOfWeek;
    this.spinner.show('spinner');
    forkJoin([
      this.appointmentService.getAppointmentsSlots(this.appointmentParams),
      this.commonService.getClinicAddress(this.appointmentParams.shopCode)
    ]).subscribe(([slots, resClinic]) => {
      slots.forEach(event => {
        event.backgroundColor = 'royalblue';
        event.textColor = 'white';
      });
      this.clinicAddress = resClinic;
      this.events = slots;
      this.spinner.hide('spinner');
      this.disableToday = false;
      this.showCalendar = true;
    });
  }

  openModal(data: any) {
    this.bsModalRef = this.modalService.show(AppointmentModalComponent, {
      ignoreBackdropClick: true,
      initialState: {
        appointmentPayload: data
      }
    });
    this.bsModalRef.setClass('modal-fixed-right');
    this.bsModalRef.content.closeBtnName = 'Close';
    // this.bsModalRef.content.data = data;
  }

  setShow(data) {
    this.openModal(data);
  }

  handleEventClick = async $event => {
    this.qParams = this.route.snapshot.queryParams;

    if (this.qParams && this.qParams.callid) {
      this.callid = this.qParams.callid;
    }
    if (this.qParams && this.qParams.source) {
      this.source = this.qParams.source;
    }
    if ( this.qParams && this.qParams.subsource) {
      this.subsource = this.qParams.subsource;
    }
    if ( this.qParams && this.qParams.campaigncode) {
      this.campaigncode = this.qParams.campaigncode;
    }
    if ( this.qParams && this.qParams.mediatypecode) {
      this.mediatypecode = this.qParams.mediatypecode;
    }
    if ( this.qParams && this.qParams.referralsource) {
      this.referralsourcecode = this.qParams.referralsource;
    }

    let modalPayload: any = {};
    if (this.customerId === null) {
      modalPayload = {
        customer: { ...this.customer },
        appointmentDate: $event.event.start,
        xid: this.xid,
        canBook: true,
        referralSourceCode: this.referralsourcecode,
        callId: this.callid,
        mediaTypeCode: this.mediatypecode,
        sourceCode: this.source,
        subSourceCode: this.subsource,
        campaignCode: this.campaigncode,
        appointmentShopDescription: this.clinic,
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
        .canBookAppointment({
          customerCode: this.customer.id,
          shopCode: this.appointmentParams.shopCode,
          serviceCode: 'SCREEN01',
          appointmentDate: moment($event.event.start).format(
            'YYYY-MM-DD[T]HH:mm:ss'
          )
        })
        .toPromise();
      modalPayload = {
        customer: { ...this.customer },
        appointmentDate: $event.event.start,
        xid: this.xid,
        callId: this.callid,
        mediaTypeCode: this.mediatypecode,
        campaignCode: this.campaigncode,
        duration: this.appointmentParams.slotSize,
        appointmentShopDescription: this.clinic,
        roomDescription: $event.event.extendedProps.resourceDescription,
        appointmentShopCode: this.appointmentParams.shopCode,
        roomCode: $event.event.extendedProps.resourceId,
        canBook: res.result,
        canBookMessage: res.message,
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

  openInfoModal() {
  if (this.modalService.getModalsCount() === 0) {
    const initialState = {
      clinicDetails: {
        addressData: this.clinicAddress,
        clinicName: this.clinic
      }
    };
    if (this.clinic && this.clinicAddress) {
      this.bsModalRef = this.modalService.show(InfoModalComponent, {
        class: 'modal-dialog modal-dialog-centered modal-lg',
        initialState
      });
    }
  }
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
    this.aviableSlots$.unsubscribe();
  }
}
