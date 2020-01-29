import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Customer} from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class ClientSelectedService {


  private customerEmitter = new Subject<Customer>();
  customerEmitted$ = this.customerEmitter.asObservable();

  constructor() { }


  setSelectedCustomer(data: Customer) {
    this.customerEmitter.next(data);
  }

}
