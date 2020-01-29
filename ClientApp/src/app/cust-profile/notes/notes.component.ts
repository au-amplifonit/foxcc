import { Component, OnInit } from '@angular/core';
import { CustomerApiService } from 'src/app/core/services/api/customer/customer-api.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { NotesModalComponent } from './notes-modal/notes-modal.component';
import { tap, map } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'fcw-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  customerId: string;
  notes: any;
  bsModalRef: BsModalRef;
  customerData;

  constructor(
    private customerApiService: CustomerApiService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinnerService.show('spinner');
    this.loadNotes();
    this.route.queryParams.subscribe(qParams => {
      this.customerApiService
        .getCustomer(qParams['customerId'])
        .subscribe(data => {
          this.customerData = data;
          this.customerApiService.updateCustomer(data);
        });
    });

    this.customerApiService.reloadNotes$.subscribe(() => {
      this.notes = [];
      this.loadNotes();
    });
  }

  openTheModal() {
    this.bsModalRef = this.modalService.show(NotesModalComponent, {
      class: 'modal-dialog modal-dialog-centered modal-lg',
      initialState: {
        modalData: {
          note: {},
          customerData: { ...this.customerData }
        }
      }
    });
  }

  private loadNotes() {
    this.spinnerService.show('spinner');
    this.route.queryParams.subscribe(qParams => {
      if (qParams.customerId) {
        this.customerId = qParams['customerId'];
        this.customerApiService
          .getNotes(this.customerId)
          .pipe(
            tap((data: any) => {
              const groupedAppointmentPayload = data.pageItems.map(element => {
                return {
                  year: parseInt(element.date.split('-')[0], 10),
                  month: parseInt(element.date.split('-')[1], 10),
                  day: element.date.split('-')[2],
                  ...element
                };
              });

              const yearlyGroupedApps = _(groupedAppointmentPayload)
                .groupBy('year')
                .value();

              this.notes = _.values(yearlyGroupedApps).map((e): any => {
                const monthlyGroupedApps = _(e)
                  .groupBy('month')
                  .value();
                return _.values(monthlyGroupedApps);
              });

              this.notes = this.notes.reverse();
              this.notes.forEach(element => {
                element = element.reverse();
              });
            })
          )
          .subscribe(() => this.spinnerService.hide('spinner'));
      }
    });
  }
}
