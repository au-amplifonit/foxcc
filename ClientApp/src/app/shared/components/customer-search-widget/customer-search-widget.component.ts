import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ShareCustomerElementService } from '../../share-customer-element-service.service';
import { CustomerList } from '../../models/customer.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fcw-customer-search-widget',
  templateUrl: './customer-search-widget.component.html',
  styleUrls: ['./customer-search-widget.component.scss']
})
export class CustomerSearchWidgetComponent implements OnInit, OnDestroy {

  clientList: CustomerList;
  subStore$: Subscription;

  constructor(private router: Router, private share: ShareCustomerElementService) { }

  ngOnInit() {
    this.subStore$ = this.share.searchDataEmitted$.subscribe(data => {
      this.clientList = data;
    });
  }

  nav(path) {
    this.router.navigate([path]);
  }

  toggleAppointmentModal() {
    this.share.toggleAppointmentModal.next(false);
  }

  ngOnDestroy() {
    this.subStore$.unsubscribe();
  }

}
