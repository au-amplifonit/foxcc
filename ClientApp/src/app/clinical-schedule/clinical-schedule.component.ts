import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '../shared/services/common/common.service';
import { Clinic } from '../shared/models/clinic.model';
import * as moment from 'moment';
import { AppointmentsApiService } from '../core/services/api/appointments/appointments-api.service';
import { CustomerAppointment } from '../shared/models/customerAppointment.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, forkJoin, observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ShareCustomerElementService } from '../shared/share-customer-element-service.service';
import { CustomerApiService } from '../core/services/api/customer/customer-api.service';

@Component({
  selector: 'fcw-clinical-schedule',
  templateUrl: 'clinical-schedule.component.html',
  styleUrls: ['./clinical-schedule.component.scss'],
})
export class ClinicalScheduleComponent implements OnInit, OnDestroy {
  public dayDate = new Date();
  public minDate: Date = new Date();
  public maxDate: Date = new Date();
  public isPreview = true;
  public clinicWasSelected = false;
  public selectedClinicData: any;
  public selectedDate: any;
  public subStore$: Subscription;
  public clinics: Array<Clinic>;
  public customerAppointments: Array<CustomerAppointment>;
  public clinicAddress;
  public workingClinicians: any;
  public isCollapsed = false;
  public dropdownList;
  public serviceList;
  public audilogistList;
  public typeList;
  public selectedItems;
  public audiologistsDropdownSettings;
  public typeDropdownSettings;
  public audiologistDropdownSetting;
  public statusDropdownSetting;
  public filterStatus = {
    filter1: false,
    filter2: false,
    filter3: false,
  };
  public selectedFilters = {
    audiologist:[],
    type: [],
    status: []
  }
  public filtersArray = [];

  constructor(
    private commonService: CommonService,
    private appointementService: AppointmentsApiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private share: ShareCustomerElementService,
    private customerService: CustomerApiService
  ) {}

  ngOnInit() {
    this.customerService.updateCustomer(null);
    this.maxDate.setDate(this.minDate.getDate() + 35);
    this.commonService
      .getClinic()
      .subscribe((data: Array<Clinic>) => (this.clinics = data));

    this.typeDropdownSettings = {
      singleSelection: false,
      text: 'FILTER: TYPE',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: false,
    };
    this.audiologistDropdownSetting = {
      singleSelection: false,
      text: 'FILTER: AUDIOLOGIST',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: false,
    };
    this.statusDropdownSetting = {
      singleSelection: false,
      text: 'FILTER: STATUS',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: false,
    };
    this.subStore$ = this.share.reloadAppointments$.subscribe(() => {
      this.spinner.show('spinner');
      this.callAppointmentsService(this.filtersArray).subscribe(data => {
        this.customerAppointments = data;
        this.spinner.hide('spinner');
      })
    })
  }
  handleFilterStatus(filter: string) {
    this.filterStatus[filter] = !this.filterStatus[filter];
  }

  handleSetClinic(event: Event): void {
    const selectedClinic = (event.target as HTMLInputElement).value;
    const [clinicCode, clinicName] = selectedClinic.split(',');
    this.selectedClinicData = { name: clinicName, code: clinicCode };
    this.clinicWasSelected = true;
    this.spinner.show('spinner');
    this.spinner.show('spinner2');
    forkJoin([
      this.callAppointmentsService(),
      this.callAddressService(),
      this.callWorkingClinician(),
    ]).subscribe(([resAppointment, resAddress, resClinician]) => {

      this.spinner.hide('spinner');
      this.spinner.hide('spinner2');

      this.dropdownList = resClinician.map((el) => {
        return {id: el.code, itemName: el.description}
      });

      this.serviceList = resAppointment.reduce((acc,el,idx) => {
        if (!!acc.find(elc => elc.id === el.statusCode)) {
          return acc;
        } else {
          return [...acc, {id: el.statusCode, itemName: el.statusDescription}];
        }
      }, []);

      this.audilogistList = resAppointment.reduce((acc,el,idx) => {
        if (!!acc.find(elc => elc.id === el.employeeCode)) {
          return acc;
        } else {
          return [...acc, {id: el.employeeCode, itemName: el.employeeName}];
        }
      }, []);

      this.typeList = resAppointment.reduce((acc,el,idx) => {
        if (!!acc.find(elc => elc.id === el.serviceCode)) {
          return acc;
        } else {
          return [...acc, {id: el.serviceCode, itemName: el.serviceDescription}];
        }
      }, []);

      this.customerAppointments = resAppointment;
      this.clinicAddress = resAddress;
      this.workingClinicians = resClinician;
    });
  }

  onChange(event): void {
    this.dayDate = event;
    this.selectedDate = moment(event).format('YYYY-MM-DD[T]HH:mm:ss');
    if (this.clinicWasSelected) {
      this.spinner.show('spinner');
      this.spinner.show('spinner2');
      forkJoin([
        this.callAppointmentsService(this.filtersArray),
        this.callWorkingClinician(),
      ]).subscribe(([resAppointment, resClinician]) => {
        this.customerAppointments = resAppointment;
        this.workingClinicians = resClinician;
        // this.dropdownList = resClinician.map((el) => {
        //   return {id: el.code, itemName: el.description}
        // });

        // this.serviceList = resAppointment.reduce((acc,el,idx) => {
        //   if (!!acc.find(elc => elc.id === el.statusCode)) {
        //     return acc;
        //   } else {
        //     return [...acc, {id: el.statusCode, itemName: el.statusDescription}];
        //   }
        // }, []);

        // this.audilogistList = resAppointment.reduce((acc,el,idx) => {
        //   if (!!acc.find(elc => elc.id === el.employeeCode)) {
        //     return acc;
        //   } else {
        //     return [...acc, {id: el.employeeCode, itemName: el.employeeName}];
        //   }
        // }, []);

        // this.typeList = resAppointment.reduce((acc,el,idx) => {
        //   if (!!acc.find(elc => elc.id === el.serviceCode)) {
        //     return acc;
        //   } else {
        //     return [...acc, {id: el.serviceCode, itemName: el.serviceDescription}];
        //   }
        // }, []);

        this.spinner.hide('spinner');
        this.spinner.hide('spinner2');
      });
    }
  }

  handleClinicChange(): void {
    this.clinicWasSelected = false;
    this.isCollapsed = false;
    this.customerAppointments = [];
    this.filtersArray = [];
    this.selectedFilters.status = [];
    this.selectedFilters.audiologist = [];
    this.selectedFilters.type = [];
  }

  goToNewAppointment(): void {
    const dayDateFmt = moment(this.dayDate).format('YYYY-MM-DD');
    const phoneNumber = this.route.snapshot.queryParamMap.get('phonenumber');
    const queryPrams = this.route.snapshot.queryParams;
    const def = {
      shopCode: this.selectedClinicData.code,
      day: dayDateFmt,
      ...queryPrams
    }
    this.router.navigate(['main', 'clinical-schedule', 'new-appointment'], {
      queryParams: def,
    });
  }

    onItemSelect(item:any){
      this.filtersArray[0] = this.selectedFilters.audiologist.map(el => el.id).join('|');
      this.filtersArray[1] = this.selectedFilters.status.map(el => el.id).join('|');
      this.filtersArray[2] = this.selectedFilters.type.map(el => el.id).join('|');
      this.spinner.show('spinner');
      this.callAppointmentsService(this.filtersArray).subscribe(resAppointment => {

        this.serviceList = resAppointment.reduce((acc,el,idx) => {
          if (!!acc.find(elc => elc.id === el.statusCode)) {
            return acc;
          } else {
            return [...acc, {id: el.statusCode, itemName: el.statusDescription}];
          }
        }, []);

        this.audilogistList = resAppointment.reduce((acc,el,idx) => {
          if (!!acc.find(elc => elc.id === el.employeeCode)) {
            return acc;
          } else {
            return [...acc, {id: el.employeeCode, itemName: el.employeeName}];
          }
        }, []);

        this.typeList = resAppointment.reduce((acc,el,idx) => {
          if (!!acc.find(elc => elc.id === el.serviceCode)) {
            return acc;
          } else {
            return [...acc, {id: el.serviceCode, itemName: el.serviceDescription}];
          }
        }, []);

        this.spinner.hide('spinner');
        this.customerAppointments = resAppointment;
      })
    }

    OnItemDeSelect(item:any){
      this.filtersArray[0] = this.selectedFilters.audiologist.map(el => el.id).join('|');
      this.filtersArray[1] = this.selectedFilters.status.map(el => el.id).join('|');
      this.filtersArray[2] = this.selectedFilters.type.map(el => el.id).join('|');
      this.spinner.show('spinner');
      this.callAppointmentsService(this.filtersArray).subscribe(resAppointment => {
        this.serviceList = resAppointment.reduce((acc,el,idx) => {
          if (!!acc.find(elc => elc.id === el.statusCode)) {
            return acc;
          } else {
            return [...acc, {id: el.statusCode, itemName: el.statusDescription}];
          }
        }, []);

        this.audilogistList = resAppointment.reduce((acc,el,idx) => {
          if (!!acc.find(elc => elc.id === el.employeeCode)) {
            return acc;
          } else {
            return [...acc, {id: el.employeeCode, itemName: el.employeeName}];
          }
        }, []);

        this.typeList = resAppointment.reduce((acc,el,idx) => {
          if (!!acc.find(elc => elc.id === el.serviceCode)) {
            return acc;
          } else {
            return [...acc, {id: el.serviceCode, itemName: el.serviceDescription}];
          }
        }, []);
        this.spinner.hide('spinner');
        this.customerAppointments = resAppointment;
      })
    }

    onSelectAll(event) {
      this.filtersArray[0] = this.selectedFilters.audiologist.map(el => el.id).join('|');
      this.filtersArray[1] = this.selectedFilters.status.map(el => el.id).join('|');
      this.filtersArray[2] = this.selectedFilters.type.map(el => el.id).join('|');
      this.spinner.show('spinner');
      this.callAppointmentsService(this.filtersArray).subscribe(resAppointment => {
        this.serviceList = resAppointment.reduce((acc,el,idx) => {
          if (!!acc.find(elc => elc.id === el.statusCode)) {
            return acc;
          } else {
            return [...acc, {id: el.statusCode, itemName: el.statusDescription}];
          }
        }, []);

        this.audilogistList = resAppointment.reduce((acc,el,idx) => {
          if (!!acc.find(elc => elc.id === el.employeeCode)) {
            return acc;
          } else {
            return [...acc, {id: el.employeeCode, itemName: el.employeeName}];
          }
        }, []);

        this.typeList = resAppointment.reduce((acc,el,idx) => {
          if (!!acc.find(elc => elc.id === el.serviceCode)) {
            return acc;
          } else {
            return [...acc, {id: el.serviceCode, itemName: el.serviceDescription}];
          }
        }, []);

        this.spinner.hide('spinner');
        this.customerAppointments = resAppointment;
      })
    }

    onDeSelectAll(event) {
      this.filtersArray[0] = this.selectedFilters.audiologist.map(el => el.id).join('|');
      this.filtersArray[1] = this.selectedFilters.status.map(el => el.id).join('|');
      this.filtersArray[2] = this.selectedFilters.type.map(el => el.id).join('|');
      this.spinner.show('spinner');
      this.callAppointmentsService(this.filtersArray).subscribe(resAppointment => {
        this.serviceList = resAppointment.reduce((acc,el,idx) => {
          if (!!acc.find(elc => elc.id === el.statusCode)) {
            return acc;
          } else {
            return [...acc, {id: el.statusCode, itemName: el.statusDescription}];
          }
        }, []);

        this.audilogistList = resAppointment.reduce((acc,el,idx) => {
          if (!!acc.find(elc => elc.id === el.employeeCode)) {
            return acc;
          } else {
            return [...acc, {id: el.employeeCode, itemName: el.employeeName}];
          }
        }, []);

        this.typeList = resAppointment.reduce((acc,el,idx) => {
          if (!!acc.find(elc => elc.id === el.serviceCode)) {
            return acc;
          } else {
            return [...acc, {id: el.serviceCode, itemName: el.serviceDescription}];
          }
        }, []);

        this.spinner.hide('spinner');
        this.customerAppointments = resAppointment;
      });
    }

  ngOnDestroy() {
    this.subStore$.unsubscribe();
  }

  private callAppointmentsService(filters?): Observable<any> {
    return this.appointementService.getAppointmentsByShop(
      this.selectedClinicData.code,
      this.selectedDate,
      filters
    );
  }

  private callAddressService(): Observable<any> {
    return this.commonService.getClinicAddress(
      `${this.selectedClinicData.code}`
    );
  }

  private callWorkingClinician(): Observable<any> {
    return this.appointementService.getWorkingClinician(
      this.selectedClinicData.code,
      this.selectedDate
    );
  }
}
