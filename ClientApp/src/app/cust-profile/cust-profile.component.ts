import { Component, OnInit, OnDestroy } from '@angular/core';
import { Customer } from '../shared/models/customer.model';
import { CustomerApiService } from '../core/services/api/customer/customer-api.service';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'fcw-custprofile',
  template: `
    <div>
      <div class="bg-secondary min-vh-100 h-100" style="background-color: lightgray !important;" >

          <div class="d-flex flex-row m-3 rounded-left main-container" style="padding-bottom: 20px;margin-bottom: 0 !important;">
            <ul class="col-sm-2 nav nav-bar navbar-brand p-0">

                  <li class="py-2 pl-2" [ngClass]="{'disabled': !customerId}" routerLinkActive="active" #accLS="routerLinkActive" routerLink="{{(customerId !== null && customerId !== undefined)?('/main/custProfile/acc-det/'+customerId):('/main/custProfile/acc-det')}}" >
                    <div class="row">
                      <div class="col-sm-2 p-1">
                      <svg-icon class="s" src=
                      "{{ accLS.isActive ? '../../../../assets/img/svg/person_3.svg' : '../../../../assets/img/svg/person_2.svg' }}"></svg-icon>
                      </div>
                      <div class="col-sm-10 pr-0">
                        <div class="mb-0 h6 text-secondary">
                          Account Details
                        </div>
                        <div class="text-muted secondary-text-small">
                          Contact info and preferences
                        </div>
                      </div>
                    </div>
                  </li>

                  <li class="py-2 pl-2" [ngClass]="{'disabled': !customerId}" routerLinkActive="active" #appLS="routerLinkActive" routerLink="/main/custProfile/appointments" [queryParams]="{customerId: customerId}">
                    <div class="row">
                      <div class="col-sm-2 p-1">
                      <svg-icon class="s" src=
                      "{{ appLS.isActive ? '../../../../assets/img/svg/book-appointment-grey_3.svg' : '../../../../assets/img/svg/book-appointment-grey_2.svg' }}"
                      ></svg-icon>
                      </div>
                      <div class="col-sm-10 pr-0">
                        <div class="text-secondary mb-0 h6">
                          Appointments
                        </div>
                        <div class="text-muted secondary-text-small">
                          Planning and recording visits
                        </div>
                      </div>
                    </div>
                  </li>

                  <li class="py-2 pl-2 disabled" routerLinkActive="active" #prodLS="routerLinkActive" routerLink="prod" >
                    <div class="row">
                      <div class="col-sm-2 p-1">
                      <svg-icon class="s" src=
                      "{{ prodLS.isActive ? '../../../../assets/img/svg/ampli-connect-red.svg' : '../../../../assets/img/svg/ampli-connect.svg' }}"></svg-icon>
                      </div>
                      <div class="col-sm-10 pr-0">
                        <div class="text-secondary mb-0 h6">
                          Products
                        </div>
                        <div class="text-muted secondary-text-small">
                          Equipment and services
                        </div>
                      </div>
                    </div>
                  </li>

                  <li class="py-2 pl-2" [ngClass]="{'disabled': !customerId}" routerLinkActive="active" #notLS="routerLinkActive" routerLink="notes"  [queryParams]="{customerId: customerId}">
                  <div class="row">
                    <div class="col-sm-2 p-1">
                    <svg-icon class="s" src=
                    "{{ notLS.isActive ? '../../../../assets/img/svg/clipboard_3.svg' : '../../../../assets/img/svg/clipboard_2.svg' }}"></svg-icon>
                    </div>
                    <div class="col-sm-10 pr-0">
                      <div class="mb-0 h6 text-secondary">
                        Notes
                      </div>
                      <div class="text-muted secondary-text-small">
                        Internal notes
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="d-flex bg-white h-auto rounded-right col-sm-10">
                  <router-outlet></router-outlet>
              </div>
          </div>
      </div>
      <ngx-spinner bdColor="rgba(255,255,255,1)" color="#c5003e" [fullScreen]="false" type="ball-spin-clockwise" size="medium"></ngx-spinner>
<div>
  `,

  styleUrls: ['./cust-profile.component.scss']
})
export class CustProfileComponent implements OnInit, OnDestroy {
  customerId: string;
  customer: Customer;
  substore$: Subscription;
  constructor(
    private customerApiService: CustomerApiService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      if (e.url === '/main/custProfile/acc-det') { this.customerId = null; }
    });
    this.route.queryParams.subscribe(qParams => {
      if (qParams.customerId) {
        this.customerId = qParams['customerId'];
      }
    });
  }

  ngOnInit() {
    this.spinner.show('spinner');
    this.substore$ = this.customerApiService.currentCustomer$.subscribe( res => {
      if (res !== null) { this.customerId = res.id; }
      this.spinner.hide('spinner');
      }
    );
  }

  ngOnDestroy() {
    this.substore$.unsubscribe();
  }

}
