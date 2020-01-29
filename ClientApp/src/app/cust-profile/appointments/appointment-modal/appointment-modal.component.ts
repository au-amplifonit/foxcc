import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService, TypeaheadMatch } from 'ngx-bootstrap';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { CustomerApiService } from 'src/app/core/services/api/customer/customer-api.service';
import { tap, switchMap } from 'rxjs/operators';
import { AppointmentsApiService } from 'src/app/core/services/api/appointments/appointments-api.service';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { CustSearchComponent } from 'src/app/cust-search/cust-search.component';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { ShareCustomerElementService } from 'src/app/shared/share-customer-element-service.service';
import { CustomerListItem } from 'src/app/shared/models/customer.model';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { AddressConfirmModalComponent } from 'src/app/shared/components/address-confirm-modal/address-confirm-modal.component';

@Component({
  selector: 'fcw-appointment-modal',
  templateUrl: './appointment-modal.component.html',
  styleUrls: ['./appointment-modal.component.scss']
})
export class AppointmentModalComponent implements OnInit, OnDestroy {
  appointmentForm: FormGroup;
  customerInfos: FormGroup;
  customerAddress: FormGroup;
  appointmentPayload: any;
  typeaheadLoading: boolean;
  phoneNumber: any;
  typeaheadNoResults: boolean;
  dataSource: Observable<any>;
  customerAddressAccordionToggled = false;
  customerInfosAccordionToggled = false;
  disabled = false;
  clinicalSchedule: boolean;
  contextFlag = true;
  maxDate: Date = new Date();
  subStore$: Array<Subscription> = [];
  customerPayload: any = {};
  bsModalRef2: any;

  constructor(
    public bsModalRef: BsModalRef,
    public bsmodalRefCust: BsModalRef,
    private fb: FormBuilder,
    private customerService: CustomerApiService,
    private commonService: CommonService,
    private appointmentService: AppointmentsApiService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private share: ShareCustomerElementService,
    private bsModalService: BsModalService
  ) {
    if (!this.clinicalSchedule) {
      this.setForm();
    }
  }

  setForm() {
    const phoneNumber =
      this.appointmentPayload
        ? this.getPhoneNumber(this.appointmentPayload)
        : null;
    this.clinicalSchedule = this.router.url.includes('clinical-schedule');
    this.contextFlag = !this.router.url.includes('custProfile');
    this.customerAddress = this.fb.group({
      addressLine1: new FormControl(
        this.appointmentPayload &&
        this.appointmentPayload.customer.addresses.length > 0 &&
        this.appointmentPayload.customer.addresses[0].address[0] !== null
          ? this.appointmentPayload.customer.addresses[0].address[0]
          : '',
        Validators.required
      ),
      addressLine2: new FormControl(
        this.appointmentPayload &&
        this.appointmentPayload.customer.addresses.length > 0 &&
        this.appointmentPayload.customer.addresses[0].address[1] !== null
          ? this.appointmentPayload.customer.addresses[0].address[1]
          : ''
      ),
      stateCode: new FormControl(
        this.appointmentPayload &&
        this.appointmentPayload.customer.addresses.length > 0 &&
        this.appointmentPayload.customer.addresses[0].stateCode !== null
          ? this.appointmentPayload.customer.addresses[0].stateCode
          : '',
        Validators.required
      ),
      city: new FormControl(
        this.appointmentPayload &&
        this.appointmentPayload.customer.addresses.length > 0 &&
        this.appointmentPayload.customer.addresses[0].city !== null
          ? this.appointmentPayload.customer.addresses[0].city
          : '',
        Validators.required
      ),
      zipCode: new FormControl(
        this.appointmentPayload &&
        this.appointmentPayload.customer.addresses.length > 0 &&
        this.appointmentPayload.customer.addresses[0].zipCode !== null
          ? this.appointmentPayload.customer.addresses[0].zipCode
          : '',
        Validators.required
      )
    });
    this.customerInfos = this.fb.group({
      firstname: new FormControl(
        this.appointmentPayload && this.appointmentPayload.customer.firstname
          ? this.appointmentPayload.customer.firstname
          : '',
        Validators.required
      ),
      lastname: new FormControl(
        this.appointmentPayload && this.appointmentPayload.customer.lastname
          ? this.appointmentPayload.customer.lastname
          : '',
        Validators.required
      ),
      phoneNumber: new FormControl(phoneNumber, [Validators.required, Validators.maxLength(10), Validators.pattern('^([0][0-9]{9})$')]),
      birthday: new FormControl(
        this.appointmentPayload && this.appointmentPayload.customer.birthday
          ? moment(this.appointmentPayload.customer.birthday).format(
              'DD-MM-YYYY'
            )
          : '',
        Validators.required
      )
    });

    this.appointmentForm = this.fb.group({
      notes: [
        this.appointmentPayload && this.appointmentPayload.note
          ? this.appointmentPayload.note
          : ''
      ],
      customerAddress: this.customerAddress,
      customerInfos: this.customerInfos
    });
    this.onChanges();
  }

  customerAddressToggler = () => {
    this.customerAddressAccordionToggled = !this
      .customerAddressAccordionToggled;
  }

  handleToggle() {}

  customerContactToggler = () => {
    this.customerInfosAccordionToggled = !this.customerInfosAccordionToggled;
  }

  getPhoneNumber = data => {
    if (
      data &&
      data.customer &&
      data.customer.addresses.length > 0 &&
      data.customer.addresses[0].phones[0] !== null
    ) {
      const hasPhoneFromAddress = data.customer.addresses[0].phones.find(
        phone => phone.length > 0
      );
      const hasMobilePhoneFromAddress = data.customer.addresses[0].mobile;
      if (hasPhoneFromAddress && data.customer.addresses) {
        return hasPhoneFromAddress;
      } else if (hasMobilePhoneFromAddress !== '' && data.customer.addresses) {
        return hasMobilePhoneFromAddress;
      }
      return '';
    } else {
      return '';
    }
  }

  getAppointmentPayload = customer => {
    return {
      statusCode: 'A',
      appointmentDate: moment(this.appointmentPayload.appointmentDate).format(
        'YYYY-MM-DD[T]HH:mm:ss'
      ),
      duration: this.appointmentPayload.duration,
      employeeCode: this.appointmentPayload.roomCode,
      roomCode: this.appointmentPayload.roomCode,
      customerCode: customer.id,
      appointmentShopCode: this.appointmentPayload.appointmentShopCode,
      serviceCode: this.appointmentPayload.appointmentType.code,
      note: this.appointmentForm.get('notes').value,
      rowGuid: this.appointmentPayload.oldRowGuid
        ? this.appointmentPayload.oldRowGuid
        : '00000000-0000-0000-0000-000000000000'
    };
  }

  handleSaveAppointment = (redirect: boolean = true) => {
    this.disabled = true;
    const customerAddress = {
      addresses: [
        {
          address: [
            this.customerAddress.get('addressLine1').value,
            this.customerAddress.get('addressLine2').value
          ],
          phones: [this.customerInfos.get('phoneNumber').value],
          stateCode: this.customerAddress.get('stateCode').value,
          zipCode: this.customerAddress.get('zipCode').value,
          city: this.customerAddress.get('city').value,
          isHomeAddress: true,
          isMailingDefault: true,
          isInvoiceDefault: true,
          rowGuid: '00000000-0000-0000-0000-000000000000'
        }
      ]
    };
    const updatedAppointment: any = {};
    Object.assign(this.customerPayload, {
      ...customerAddress,
      ...this.customerInfos.value,
      fundingType: 'PVT',
      sourceCode: this.appointmentPayload.sourceCode,
      subSourceCode: this.appointmentPayload.subSourceCode,
      referralSourceCode: this.appointmentPayload.referralSourceCode,
      callId: this.appointmentPayload.callid
    });
    delete this.customerPayload.phoneNumber;
    const zipCode = this.customerAddress.get('zipCode').value;
    const city = this.customerAddress.get('city').value;
    this.customerService.getAddressValidity({city, zipCode}).subscribe(
      ( flag: boolean) => {
        if (flag) {
          if (
            this.appointmentPayload.customer.id === null ||
            !this.appointmentPayload.customer.id
          ) {
            this.customerService
              .postCustomer(
                this.customerPayload,
                this.appointmentPayload.xid,
                this.appointmentPayload.campaignCode,
                this.appointmentPayload.mediaTypeCode
              )
              .pipe(
                tap(customer => {
                  Object.assign(
                    updatedAppointment,
                    this.getAppointmentPayload(customer)
                  );
                }),
                switchMap(() => {
                  return this.appointmentService.createAppointment(
                    updatedAppointment,
                    this.appointmentPayload.campaignCode,
                    this.appointmentPayload.mediaTypeCode,
                    this.appointmentPayload.callId
                  );
                })
              )
              .subscribe(
                () => {
                  this.bsModalRef.hide();
                  if (redirect) {
                    this.router.navigate(['./main/custProfile/appointments'], {
                      queryParams: { customerId: updatedAppointment.customerCode }
                    });
                  } else {
                    if (this.clinicalSchedule) {
                      const appointmentsParams = {
                        slotSize: this.appointmentPayload.duration,
                        shopCode: this.appointmentPayload.appointmentShopCode,
                        serviceCode: this.appointmentPayload.appointmentType.code,
                        startDate: this.appointmentPayload.startDate,
                        endDate: this.appointmentPayload.endDate
                      };
                      this.appointmentService
                        .getAppointmentsSlots(appointmentsParams)
                        .subscribe(e => {
                          this.appointmentService.aviableSlots.next(e);
                        });
                    } else {
                      this.router.navigate(
                        ['./main/clinical-schedule/new-appointment'],
                        {
                          queryParams: {
                            shopCode: this.appointmentPayload.appointmentShopCode,
                            day: moment(
                              this.appointmentPayload.appointmentDate
                            ).format('YYYY-MM-DD')
                          }
                        }
                      );
                    }
                  }
                  this.disabled = false;
                },
                err => (this.disabled = false)
              );
          } else {
            Object.assign(this.customerPayload, {
              ...customerAddress,
              ...this.appointmentPayload.customer,
              ...this.customerInfos.value
            });
            this.customerPayload.birthday = moment(
              this.customerPayload.birthday,
              'DD-MM-YYYY'
            ).format('YYYY-MM-DD[T]HH:mm:ss');
            this.customerPayload.addresses[0] = {
              address: [
                this.customerAddress.get('addressLine1').value,
                this.customerAddress.get('addressLine2').value
              ],
              phones: [this.customerInfos.get('phoneNumber').value],
              stateCode: this.customerAddress.get('stateCode').value,
              zipCode: this.customerAddress.get('zipCode').value,
              city: this.customerAddress.get('city').value,
              isHomeAddress: true,
              eMail: this.customerPayload.addresses[0].eMail,
              mobile:
                this.customerPayload.addresses[0].mobile ||
                this.customerPayload.addresses[0].phones.find(el => el !== ''),
              isMailingDefault: this.customerPayload.addresses[0].isMailingDefault,
              isInvoiceDefault: this.customerPayload.addresses[0].isInvoiceDefault,
              rowGuid: this.customerPayload.addresses[0].rowGuid
            };
            this.customerService
              .putCustomer(this.customerPayload, this.appointmentPayload.customer.id)
              .pipe(
                tap(customer =>
                  Object.assign(
                    updatedAppointment,
                    this.getAppointmentPayload(this.appointmentPayload.customer)
                  )
                ),
                switchMap(() => {
                  if (
                    updatedAppointment.rowGuid !==
                    '00000000-0000-0000-0000-000000000000'
                  ) {
                    return this.appointmentService.rescheduleAppointment(
                      updatedAppointment.rowGuid,
                      updatedAppointment
                    );
                  } else {
                    return this.appointmentService.createAppointment(
                      updatedAppointment,
                      this.appointmentPayload.campaignCode,
                      this.appointmentPayload.mediaTypeCode,
                      this.appointmentPayload.callId
                    );
                  }
                })
              )
              .subscribe(
                () => {
                  this.bsModalRef.hide();
                  if (redirect) {
                    this.router.navigate(['./main/custProfile/appointments'], {
                      queryParams: { customerId: this.appointmentPayload.customer.id }
                    });
                  } else {
                    if (this.clinicalSchedule) {
                      const appointmentsParams = {
                        slotSize: this.appointmentPayload.duration,
                        shopCode: this.appointmentPayload.appointmentShopCode,
                        serviceCode: this.appointmentPayload.appointmentType.code,
                        startDate: this.appointmentPayload.startDate,
                        endDate: this.appointmentPayload.endDate
                      };
                      this.appointmentService
                        .getAppointmentsSlots(appointmentsParams)
                        .subscribe(e => {
                          this.appointmentService.aviableSlots.next(e);
                        });
                    } else {
                      this.router.navigate(
                        ['./main/clinical-schedule/new-appointment'],
                        {
                          queryParams: {
                            shopCode: this.appointmentPayload.appointmentShopCode,
                            day: moment(
                              this.appointmentPayload.appointmentDate
                            ).format('YYYY-MM-DD')
                          }
                        }
                      );
                    }
                  }
                  this.disabled = false;
                },
                err => (this.disabled = false)
              );
          }
        } else {
          this.bsModalRef2 = this.bsModalService.show(AddressConfirmModalComponent, {ignoreBackdropClick: true, initialState: {data: this.customerAddress.value}});
          this.disabled = false;
        }
      }
    );
    //segnaposto

  }

  openModal2() {
    this.bsmodalRefCust = this.modalService.show(CustSearchComponent, {
      class: 'modal-xl mt-1 backdrop strong-backdrop'
    });
  }
  hideModal() {
    this.bsModalRef.hide();
  }

  generateStateCode(cityAndStateCode) {
    let stateCode = '';
    cityAndStateCode.forEach((element, index) => {
      if (index + 1 === cityAndStateCode.length) {
        stateCode = `${stateCode} ${element}`;
      }
    });
    return stateCode.trim();
  }

  generateCity(cityAndStateCode) {
    let city = '';
    cityAndStateCode.forEach((element, index) => {
      if (index + 1 !== cityAndStateCode.length) {
        city = `${city} ${element}`;
      }
    });
    return city.trim();
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    const addressLine1 = e.value.split(',')[0];
    const cityAndStateCode = e.value.split(',')[1].split(' ');
    const city =
      cityAndStateCode.length <= 2 ? null : this.generateCity(cityAndStateCode);
    const stateCode =
      cityAndStateCode.length <= 2
        ? null
        : this.generateStateCode(cityAndStateCode);
    this.customerAddress.patchValue({
      addressLine1,
      stateCode,
      city
    });
  }

  onChanges() {
    this.dataSource = new Observable<any>();
    this.customerAddress.controls['addressLine1'].valueChanges.subscribe(
      val => {
        if (val !== '') {
          this.dataSource = Observable.create((observer: any) => {
            this.commonService
              .getAddressValues(val)
              .subscribe((places: any) => {
                const placesDescription = places.map(
                  place => place.description
                );
                observer.next(placesDescription);
              });
          });
        }
      }
    );
  }

  ngOnInit() {
    this.customerService.shareAddress$.subscribe(data => {
      this.customerAddress.patchValue(data);
    });
    console.log('PHONNE', this.route.snapshot.queryParamMap.get('phonenumber'));
    console.log(this.appointmentPayload);
    if (!this.clinicalSchedule) {
      this.setForm();
    }
    if (this.route.snapshot.queryParamMap.get('phonenumber')) {
      this.phoneNumber = this.route.snapshot.queryParamMap.get('phonenumber');
      this.customerInfos.controls['phoneNumber'].setValue(this.phoneNumber);
      this.customerInfos.controls['phoneNumber'].disable();
      this.customerInfos.controls['phoneNumber'].updateValueAndValidity({emitEvent: false, onlySelf: true});
    }
    this.subStore$.push(
      this.share.toggleAppointmentModalEmitted$
        .pipe(tap(e => this.bsmodalRefCust.hide()))
        .subscribe()
    );

    const params = {
      customerCode: this.appointmentPayload.customer.id,
      shopCode: this.appointmentPayload.appointmentShopCode,
      serviceCode: 'SCREEN01',
      appointmentDate: moment(this.appointmentPayload.appointmentDate).format(
        'YYYY-MM-DD[T]HH:mm:ss'
      )
    };

    this.subStore$.push(
      this.share.confirmedCustomerClinicalEmitted$.subscribe(
        (x: CustomerListItem) => {
          this.appointmentForm.controls.customerInfos.patchValue({
            firstname: x.firstname,
            lastname: x.lastname,
            birthday: x.birthday
              ? moment(x.birthday).format('DD-MM-YYYY')
              : null,
            phoneNumber:
              x.mainAddress.mobile || x.mainAddress.phones.find(el => el !== '')
          });
          this.appointmentForm.controls.customerAddress.patchValue({
            addressLine1: x.mainAddress.address[0],
            addressLine2: x.mainAddress.address[1],
            stateCode: x.mainAddress.stateCode,
            city: x.mainAddress.city,
            zipCode: x.mainAddress.zipCode
          });
          this.appointmentPayload.customer.id = x.id;
          if (x.id !== null) {
            this.customerPayload = { ...x };
            this.customerPayload.addresses = [];
            this.customerPayload.addresses[0] = x.mainAddress;
            delete this.customerPayload.age;
            delete this.customerPayload.mainAddress;
          }

          const params = {
            customerCode: this.appointmentPayload.customer.id,
            shopCode: this.appointmentPayload.appointmentShopCode,
            serviceCode: 'SCREEN01',
            appointmentDate: moment(
              this.appointmentPayload.appointmentDate
            ).format('YYYY-MM-DD[T]HH:mm:ss')
          };

          this.appointmentService.canBookAppointment(params).subscribe(data => {
            this.appointmentPayload.canBook = data.result;
            this.appointmentPayload.canBookMessage = data.message;
          });
          this.bsmodalRefCust.hide();
        }
      )
    );
  }
  ngOnDestroy() {
    this.subStore$.forEach(el => el.unsubscribe());
  }
}
