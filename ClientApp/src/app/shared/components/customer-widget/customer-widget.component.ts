import { Component, OnInit } from '@angular/core';
import { CustomerApiService } from 'src/app/core/services/api/customer/customer-api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'fcw-customer-widget',
  templateUrl: './customer-widget.component.html',
  styleUrls: ['./customer-widget.component.scss']
})
export class CustomerWidgetComponent implements OnInit {

  public customer$: Observable<any>;

  constructor(private customerApiService: CustomerApiService) { }

  ngOnInit() {
        this.customer$ = this.customerApiService.currentCustomer$;
  }

}
