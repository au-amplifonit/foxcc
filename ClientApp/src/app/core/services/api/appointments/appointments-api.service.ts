import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { AppointmentParams } from 'src/app/shared/models/appointmentParams.model';
import { Observable, Subject } from 'rxjs';
import { AppointmentSlot } from 'src/app/shared/models/appointmentSlot.model';
import { CustomerAppointment } from 'src/app/shared/models/customerAppointment.model';
import { CustomerAppointmentsParam } from 'src/app/shared/models/customerAppointmentsParam.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsApiService {
  appointmentsAPIPath = 'Diary';
  path =
    environment.SRV +
    environment.appointmentServiceUrl +
    this.appointmentsAPIPath;
  aviableSlots: Subject<AppointmentSlot[]> = new Subject();

  constructor(private http: HttpClient) {}

  getAppointmentsSlots(
    appointmentsParams: AppointmentParams
  ): Observable<AppointmentSlot[]> {
    let params: HttpParams;
    params = new HttpParams({
      fromObject: { ...appointmentsParams }
    });
    return this.http.get<AppointmentSlot[]>(
      `${this.path}/GetDateRangeAvailableSlots`,
      { params }
    );
  }

  getCustomerAppointments(
    customer,
    customerAppointment: CustomerAppointmentsParam
  ): Observable<CustomerAppointment[]> {
    let params: HttpParams;
    params = new HttpParams({
      fromObject: { ...customerAppointment }
    });
    return this.http.get<CustomerAppointment[]>(
      `${this.path}/Customer/` + customer,
      { params }
    );
  }

  getAppointmentsByShop(
    shopCode,
    date: string,
    filters = null
  ): Observable<any> {
    let params: HttpParams;
    if (filters !== null && filters.length > 0) {
      const [empcode, sercode, statuscode] = filters;
      params = new HttpParams()
        .set('serviceCodes', sercode)
        .set('statusCodes', statuscode)
        .set('employeeCodes', empcode)
        .set('appointmentDate', date)
        .set('MaxResultsCount', '5');
    } else {
      params = new HttpParams()
        .set('appointmentDate', date)
        .set('MaxResultsCount', '5');
    }
    return this.http.get(`${this.path}/Shop/` + shopCode, { params });
  }

  createAppointment(
    appointment,
    campaignCode = null,
    mediaTypeCode = null,
    callId = null
  ): Observable<any> {
    const queryParamsMap = new Map()
      .set('mediaTypeCode', mediaTypeCode)
      .set('campaignCode', campaignCode)
      .set('callID', callId);
    let queryParamString: any = [];

    queryParamsMap.forEach((v, k) => {
        if (v !== null && v.length > 0) {
          queryParamString.push(`${k}=${v}`);
        }
      });

    queryParamString = queryParamString.join('&');

    const params = new HttpParams({fromString: queryParamString});

    return this.http.post(`${this.path}`, appointment, {params});
  }

  getAppointment(rowGuid) {
    return this.http.get(`${this.path}/${rowGuid}`);
  }

  getWorkingClinician(shopcode: string, date: Date): Observable<any> {
    const params = new HttpParams()
      .set('shopcode', shopcode)
      .set('date', `${date}`);
    return this.http.get(`${this.path}/GetWorkingClinician`, { params });
  }

  confirmAppointment(rowGuid: string): Observable<any> {
    const params = new HttpParams().set('rowGuid', `${rowGuid}`);
    return this.http.put(`${this.path}/ConfirmAppointment`, {}, { params });
  }

  deleteAppointment(customerData: CustomerAppointment): Observable<any> {
    const params = new HttpParams().set('rowGuid', customerData.rowGuid);
    return this.http.put(`${this.path}/DeleteAppointment`, customerData, {
      params
    });
  }

  rescheduleAppointment(rowGuid, body) {
    return this.http.put(`${this.path}/Reschedule/${rowGuid}`, body);
  }

  canBookAppointment(data, rowGuid = null): any {
    const { customerCode, shopCode, serviceCode, appointmentDate } = data;
    let params;

    if (rowGuid) {
      params = new HttpParams()
        .set('customerCode', customerCode)
        .set('shopCode', shopCode)
        .set('serviceCode', serviceCode)
        .set('appointmentDate', `${appointmentDate}`)
        .set('rescheduledAppointmentRowGuid', rowGuid);
    } else {
      params = new HttpParams()
        .set('customerCode', customerCode)
        .set('shopCode', shopCode)
        .set('serviceCode', serviceCode)
        .set('appointmentDate', `${appointmentDate}`);
    }

    return this.http.get(`${this.path}/CanBookAppointment`, { params });
  }

  updateAppointment(data: CustomerAppointment) {
    return this.http.put(`${this.path}/` + data.rowGuid, data);
  }

  customerNextAppointment(id: string) {
    return this.http.get(`${this.path}/CustomerNextAppointment/` + id);
  }
}
