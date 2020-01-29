import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import {
  Customer,
  CustomerList,
  CustParam
} from '../../../../shared/models/customer.model';
import { Note } from 'src/app/shared/models/note.model';

// tslint:disable-next-line:max-line-length
// http://sau02ap02foxsit.d09.root.sys/Fox.Microservices.Customers/api/v1/Customers/Search?lastname=pippo&customerCode=12&voucherID=12341&phoneNumber=3200625543&birthdate=1963-06-03&pageSize=20&pageNumber=1

@Injectable({
  providedIn: 'root'
})
export class CustomerApiService {
  customersAPIPath = 'Customers';
  addressAPIPath = 'Address';
  path =
    environment.SRV + environment.customerServiceUrl + this.customersAPIPath;
  private _customer$ = new BehaviorSubject<Customer>(null);
  currentCustomer$ = this._customer$.asObservable();
  private _reloadNotes$ = new Subject<boolean>();
  public reloadNotes$ = this._reloadNotes$.asObservable();
  private _shareAddress$ = new Subject();
  public shareAddress$ = this._shareAddress$.asObservable();
  customer: Customer;

  constructor(private httpC: HttpClient) {}

  search(clientPar: CustParam): Observable<CustomerList> {
    let params: HttpParams;
    params = new HttpParams({
      fromObject: { ...clientPar }
    });
    return this.httpC.get<CustomerList>(
      `${this.path}/SearchCustomersAndLeads`,
      { params }
    );
  }

  reloadNotes() {
    this._reloadNotes$.next(true);
  }

  getCustomer(id: string) {
    return this.httpC.get<any>(`${this.path}/${id}`);
  }

  postCustomer(
    objCustomer,
    xid = null,
    campaignCode = null,
    mediaTypeCode = null
  ) {
    let url = xid !== null ? `${this.path}?xid=${xid}` : `${this.path}`;
    url = campaignCode !== null ? `${url}?campaignCode=${campaignCode}` : url;
    url =
      mediaTypeCode !== null ? `${url}?mediaTypeCode=${mediaTypeCode}` : url;
    return this.httpC.post(url, objCustomer);
  }

  putCustomer(objCustomer, id) {
    return this.httpC.put(`${this.path}/${id}`, objCustomer);
  }

  postAddress(objAddress) {
    return this.httpC.post(`${this.path}/${this.addressAPIPath}`, objAddress);
  }

  putAddress(objAddress, rowId) {
    return this.httpC.put(
      `${this.path}/${this.addressAPIPath}/${rowId}`,
      objAddress
    );
  }

  getCustomerFromLead(xid: string) {
    return this.httpC.get<any>(`${this.path}/convertfromlead/${xid}`);
  }

  updateCustomer(customer: Customer) {
    this._customer$.next(customer);
  }

  getNotes(id: string): Observable<Note> {
    return this.httpC.get<Note>(`${this.path}/Notes/${id}`);
  }
  newNote(note) {
    return this.httpC.post(`${this.path}/Note`, note);
  }
  editNote(rowGuid, note) {
    return this.httpC.put(`${this.path}/Note/${rowGuid}`, note);
  }

  addressShare(data) {
    this._shareAddress$.next(data);
  }
  
  getAddressValidity(queryParams): Observable<boolean> {
    const params = new HttpParams({fromObject: queryParams})
    return this.httpC.get<boolean>(`${this.path}/IsAddressCityValid`, {params});
  }

  addNewAddress(payload): Observable<any> {
    return this.httpC.post(`${this.path}/City`, payload);
  }
}
