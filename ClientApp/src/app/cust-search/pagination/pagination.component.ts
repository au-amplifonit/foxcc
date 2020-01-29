import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PageChangedEvent} from 'ngx-bootstrap';
import {CustomerList, CustParam} from 'src/app/shared/models/customer.model';
import {HttpErrorResponse} from '@angular/common/http';
import {CustomerApiService} from 'src/app/core/services/api/customer/customer-api.service';

@Component({
  selector: 'fcw-pagination',
  template: `
  <div class="row pag-wrapper d-flex justify-content-center pt-3 px-4 border-top  ">
      <ngb-pagination
      [(page)] = "custPar === undefined? '0' : custPar.pageNumber"
      [maxSize] = "10"
      [pageSize] = "20"
      [collectionSize] = "custPar === undefined || stringToNumb(custPar.recordCount) < 1 ? '1' : custPar.recordCount"
      [boundaryLinks]="true"
      (pageChange)="pageChanged({itemsPerPage: 20, page: $event})"
      >
      <ng-template ngbPaginationFirst>&laquo; First</ng-template>
      <ng-template ngbPaginationPrevious>&lsaquo; Prev</ng-template>
      <ng-template ngbPaginationNext>Next &rsaquo;</ng-template>
      <ng-template ngbPaginationLast>Last &raquo;</ng-template>
      </ngb-pagination>
  </div>



`,
styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() custPar: CustParam;

  @Output() clientList: EventEmitter<CustomerList> = new EventEmitter<CustomerList>();
  @Output() errorClientList: EventEmitter<HttpErrorResponse> = new EventEmitter<HttpErrorResponse>();
  @Output() custParamOut: EventEmitter<CustParam> = new EventEmitter<CustParam>();

  constructor(private api: CustomerApiService) {
  }

  ngOnInit() {
  }

  pageChanged(event: PageChangedEvent){
    if(this.custPar !== undefined){

      // a copy of this.custPar is used to prevent recursive calls on pageChanged()
      let auxCustPar = {...this.custPar};
      auxCustPar.pageNumber = (parseInt(auxCustPar.pageNumber)-1).toString();
      this.api.search(auxCustPar).subscribe(
        res => {
          this.clientList.emit(res);
          this.custParamOut.emit(auxCustPar);
        },
        err => {
          this.errorClientList.emit(err);
        }
        );
      }
  }

  stringToNumb(s: string): number{
    return parseInt(s, 10);
  }

}
