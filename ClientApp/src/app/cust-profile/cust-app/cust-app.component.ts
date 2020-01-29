import { Component, OnInit, OnDestroy } from "@angular/core";
import { AppointmentsApiService } from "src/app/core/services/api/appointments/appointments-api.service";
import { CustomerAppointment } from "src/app/shared/models/customerAppointment.model";
import { CustomerAppointmentsParam } from "src/app/shared/models/customerAppointmentsParam.model";
import { tap } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { CustomerApiService } from "src/app/core/services/api/customer/customer-api.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ShareCustomerElementService } from "src/app/shared/share-customer-element-service.service";
import { Subscription } from "rxjs";
import * as _ from "lodash";

@Component({
  selector: "fcw-cust-app",
  templateUrl: "cust-app.component.html",
  styleUrls: ["./cust-app.component.scss"]
})
export class CustAppComponent implements OnInit, OnDestroy {
  customerAppointmets: any;
  appointments: CustomerAppointment[];
  yearAppointments: any[] = [];
  date: Date;
  month: number;
  year: number;
  currentMonth = 0;
  currentYear = 0;
  customerId: string;
  // test: any;
  // TEST param
  serviceParam: CustomerAppointmentsParam = {
    minDate: "0001-01-01",
    maxResultsCount: "100"
  };
  customerCode = "0000029g";
  subStore$: Subscription;

  constructor(
    private appointmentService: AppointmentsApiService,
    private route: ActivatedRoute,
    private customerService: CustomerApiService,
    private spinner: NgxSpinnerService,
    private share: ShareCustomerElementService
  ) {
    this.route.queryParams.subscribe(qParams => {
      if (qParams.customerId) {
        this.customerId = qParams["customerId"];
        this.customerService
          .getCustomer(this.customerId)
          .subscribe(customer => {
            this.customerService.updateCustomer(customer);
          });
      }
    });
  }

  ngOnInit() {
    this.loadAppointments();
    this.subStore$ = this.share.reloadAppointments$.subscribe(() => {
      this.loadAppointments();
    });
  }

  ngOnDestroy() {
    this.subStore$.unsubscribe();
  }

  private loadAppointments(): void {
    this.spinner.show("spinner");
    this.appointmentService
      .getCustomerAppointments(this.customerId, this.serviceParam)
      .pipe(
        tap((data: CustomerAppointment[]) => {
          const groupedAppointmentPayload = data.map(element => {
            return {
              year: parseInt(element.appointmentDate.split('-')[0], 10),
              month: parseInt(element.appointmentDate.split('-')[1], 10),
              day: element.appointmentDate.split('-')[2],
              ...element
            };
          });
          const yearlyGroupedApps = _(groupedAppointmentPayload)
            .groupBy("year")
            .value();
          this.customerAppointmets = _.values(yearlyGroupedApps).map(
            (e): any => {
              const monthlyGroupedApps = _(e)
                .groupBy("month")
                .value();
              return _.values(monthlyGroupedApps);
            }
          );
          this.customerAppointmets.reverse();
          this.customerAppointmets.forEach(element => element.reverse());
        })
      )
      .subscribe(() => this.spinner.hide("spinner"));
  }
}
