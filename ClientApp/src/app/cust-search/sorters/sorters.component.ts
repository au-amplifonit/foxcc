import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerList, CustParam} from 'src/app/shared/models/customer.model';
import {HttpErrorResponse} from '@angular/common/http';
import {CustomerApiService} from 'src/app/core/services/api/customer/customer-api.service';

@Component({
  selector: 'fcw-sorters',
  template: `

    <div *ngIf="custPar">
      <svg-icon class="xs mx-2" src="../../../../assets/img/svg/filter.svg"></svg-icon>
      <a (click)="switchSortAz()"> SORT: A-Z
        <svg-icon class="xs mx-1 arrow" [ngClass]=" this.custPar.SortAscending === 'true' ? '' : 'rotate' " src="../../../../assets/img/svg/chevron-arrow-dx.svg" [applyCss]="true"></svg-icon>
      </a>
    </div>


  `,
  styleUrls: ['./sorters.component.scss']
})
export class SortersComponent implements OnInit {
azSorted = true;
sortDisabled = false;
@Input() custPar: CustParam;

@Output() clientList: EventEmitter<CustomerList> = new EventEmitter<CustomerList>();
@Output() errorClientList: EventEmitter<HttpErrorResponse> = new EventEmitter<HttpErrorResponse>();
@Output() custParamOut: EventEmitter<CustParam> = new EventEmitter<CustParam>();
@Output() loadingStatus: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(private api: CustomerApiService) { }

  ngOnInit() {
  }

  switchSortAz(): void {
    this.azSorted = !this.azSorted;
    this.custPar.pageNumber = '0';
    this.custPar.SortAscending = this.azSorted.toString();
    this.loadingStatus.emit(true);
    this.api.search(this.custPar).subscribe(
      res => {
        this.clientList.emit(res);
        this.custParamOut.emit(this.custPar);
        this.loadingStatus.emit(false);
      },
      err => {
        this.errorClientList.emit(err);
      }
    );
  }

}
