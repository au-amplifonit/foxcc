import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  CustomerList,
  CustomerListItem
} from 'src/app/shared/models/customer.model';
import { ShareCustomerElementService } from '../../shared/share-customer-element-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'fcw-client-list',
  template: `
    <div>
      <fcw-client-list-item
        *ngFor="let item of clientList.pageItems"
        [client]="item"
        [contextClinical]="contextClinical"
        [inContact]="inContactFlag"
      >
      </fcw-client-list-item>
    </div>
  `,
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  @Input() clientList: CustomerList;
  @Input() contextClinical: boolean;
  public inContactFlag = false;
  @Output() selectedItem: EventEmitter<CustomerListItem> = new EventEmitter();

  constructor(private share: ShareCustomerElementService, private route: ActivatedRoute) {}

  ngOnInit() {
    if(this.route.snapshot.queryParamMap.get('phonenumber')) {
      this.inContactFlag = true;
    }
  }

  getListElementData($event, data: CustomerListItem) {
    $event.stopPropagation();
    $event.preventDefault();
    // this.selectedItem.emit(data);
    this.share.emitData(data);
  }

  // handleClick($event, item) {
  //   const selection = window.getSelection();
  //   if (selection.toString().length === 0) {
  //     this.getListElementData($event, item);
  //   }
  // }
}
