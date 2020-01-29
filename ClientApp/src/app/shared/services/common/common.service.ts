import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
//model
import { Common, State } from '../../models/common/common.model';
import { Clinic } from '../../models/common/clinic.model';
import { CityBook} from '../../models/common/city-book.model';
import { Appointment } from '../../models/common/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private path = environment.SRV + environment.commonServiceUrl;
  private genderUrl = 'Gender';
  private clinicUrl = 'Clinic';
  private salutationUrl = 'Salutation';
  private languageUrl = 'Language';
  private sourceUrl = 'Source';
  private subSourceUrl = 'SubSource';
  private referralSourceUrl = 'ReferralSource';
  private customerStatusUrl = 'CustomerStatus';
  private fundingTypeUrl = 'FundingType';
  private customerTypeUrl = 'CustomerType';
  private cityBookUrl = 'CityBook';
  private appointmentType = 'AppointmentType';
  private appointmentStatus = 'AppointmentStatus';
  private clinicianUrl = 'Clinician';
  private relationshipUrl = 'Relationship';
  private preferredTimeOfContactUrl = 'PreferredTimeOfContact';
  private statesUrl = 'State';
  private service = 'Service';
  private clinicAddressUrl = 'GetClinicAddress';
  private clinicByPostCodeUrl = 'GetClinicByPostCode';
  private validateAddressUrl = 'ValidateAddress';


  constructor(private http: HttpClient) { }

  getGender(): Observable<Common[]> {
    return this.http.get<Common[]>(this.path + this.genderUrl);
  }
  getClinic(): Observable<Clinic[]> {
    return this.http.get<Clinic[]>(this.path + this.clinicUrl);
  }
  getClinicAddress(shopCode: string): Observable<any> {
    const params = new HttpParams().set('shopCode', shopCode);
    return this.http.get<any>(this.path + this.clinicAddressUrl, {params});
  }
  getSalutation(): Observable<Common[]> {
    return this.http.get<Common[]>(this.path + this.salutationUrl);
  }
  getLanguage(): Observable<Common[]> {
    return this.http.get<Common[]>(this.path + this.languageUrl);
  }
  getSource(): Observable<Common[]> {
    return this.http.get<Common[]>(this.path + this.sourceUrl);
  }
  getSubSource(): Observable<Common[]> {
    return this.http.get<Common[]>(this.path + this.subSourceUrl);
  }
  getReferralSource(): Observable<Common[]> {
    return this.http.get<Common[]>(this.path + this.referralSourceUrl);
  }
  getCustomerStatus(): Observable<Common[]> {
    return this.http.get<Common[]>(this.path + this.customerStatusUrl);
  }
  getFundingType(): Observable<Common[]> {
    return this.http.get<Common[]>(this.path + this.fundingTypeUrl);
  }
  getCustomerType(): Observable<Common[]> {
    return this.http.get<Common[]>(this.path + this.customerTypeUrl);
  }
  getCityBook(): Observable<CityBook[]> {
    return this.http.get<CityBook[]>(this.path + this.cityBookUrl);
  }
  getAppointmentType(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.path + this.appointmentType);
  }
  getAppointmentStatus(): Observable<Common[]> {
    return this.http.get<Common[]>(this.path + this.appointmentStatus);
  }
  getClinician(): Observable<Common[]> {
    return this.http.get<Common[]>(this.path + this.clinicianUrl);
  }
  getRelationship(): Observable<Common[]> {
    return this.http.get<Common[]>(this.path + this.relationshipUrl);
  }
  getPreferredTimeOfContact(): Observable<Common[]> {
    return this.http.get<Common[]>(this.path + this.preferredTimeOfContactUrl);
  }
  getStates(): Observable<State[]> {
    return this.http.get<State[]>(this.path + this.statesUrl);
  }
  getService(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.path + this.service);
  }

  GetClinicByPostCode(postCode: string): Observable<Clinic> {
    let params: HttpParams;
    params = new HttpParams({
      fromObject: { postCode }
    });
    return this.http.get<Clinic>(this.path + this.clinicByPostCodeUrl, {params});
  }

  getAddressValues(searchString): Observable<any[]> {
    let params: HttpParams;
    params = new HttpParams({
      fromObject: { searchString }
    });
    return this.http.get<any[]>(this.path + this.validateAddressUrl, {params});
  }

}
