import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CustomerList, CustomerListItem, CustParam} from '../shared/models/customer.model';
import {HttpErrorResponse} from '@angular/common/http';
import {Router, ActivatedRoute} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShareCustomerElementService } from '../shared/share-customer-element-service.service';
import { TypeaheadOptions } from 'ngx-bootstrap';
import { CustomerApiService } from '../core/services/api/customer/customer-api.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'fcw-cust-search',
  templateUrl: './cust-search.component.html',
  styleUrls: ['./cust-search.component.scss'],
})
export class CustSearchComponent implements OnInit {
  @Output() selectedItem: EventEmitter<CustomerListItem> = new EventEmitter();
  srcFormOn = true;
  clientList: CustomerList;
  error: string;
  custParam: CustParam;
  contextClinical: boolean;
  customerSelectedClinical: CustomerListItem;
  phoneNumber: string;
  qParams: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private share: ShareCustomerElementService,
    private customerApi: CustomerApiService
    ) {}

  ngOnInit() {
    this.contextClinical = this.router.url.includes('clinical-schedule');
    this.phoneNumber = this.route.snapshot.queryParamMap.get('phonenumber');
    this.qParams = this.route.snapshot.queryParams;
    if (this.phoneNumber !== null && this.phoneNumber.length > 0) {
      this.spinner.show();
      this.customerApi.search({ phoneNumber: this.phoneNumber }).subscribe((data) => {

        const custParam = {
          SortAscending: 'true',
          birthdate: '',
          customerCode: '',
          firstname: '',
          lastname: '',
          pageCount: data.pageCount,
          pageNumber: '0',
          pageRequested: '0',
          pageSize: '20',
          phoneNumber: this.phoneNumber,
          recordCount: data.recordCount,
          voucherID: '',
        };
        this.custParam = {
          ...custParam,
          ...{
            pageCount: data.pageCount.toString(),
            pageRequested: data.pageRequested.toString(),
            recordCount: data.recordCount.toString()
          }
        };
        this.clientList = data;
        this.fillSearchResult(data);
        this.spinner.hide();
      });
    }
  }

  confirmCustomer() {
     this.share.emitConfirmedCustomerClinical(this.customerSelectedClinical);
  }

  test() {
    this.router.navigate([`/main/clinical-schedule`], { queryParams: this.qParams })
  }

  toggleAppointmentModal() {
    this.share.toggleAppointmentModal.next(false);
  }

  fillSearchResult($event: CustomerList) {
    if (this.error) {
      this.error = null;
    }
    this.share.emitSearchData($event);
    this.clientList = $event;
  }

  fillSearchResultError($event: HttpErrorResponse) {
    if (this.clientList) {
      this.share.emitSearchData(null);
      this.clientList = null;
    }
    this.custParam.recordCount = '0';
    this.error = $event.message;
  }

  setCustParam($event: CustParam) {
    this.custParam = $event;
  }

  passSelectedItem($event: CustomerListItem) {
    this.selectedItem.emit($event);
  }

  nav(path) {
    this.router.navigate([path]);
  }

  handleLoader($event) {
    $event ? this.spinner.show() : this.spinner.hide();
  }
}
