import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {CustomerListItem} from '../../shared/models/customer.model';

@Component({
  selector: 'fcw-modal-right-menu',
  template: `

  <div class="p-4">
      <div class="m-0 text-right">
      <button
      type="button"
      class="btn-danger btn-sm p-0"
      (click)="bsModalRef.hide()"
      >
      <svg-icon class="s" src="../../../../assets/img/svg/close-red.svg"></svg-icon>
      </button>
      </div>
          <div class="h3 text-center">{{data.salutationDescription}} {{data.firstname}} {{data.lastname}}</div>
          <div class="text-center">

          <span class="badge p-2 m-1" [ngClass]="{
            'badge-success' : data.statusDescription === 'Active' || data.statusDescription === 'Active Lead',
            'badge-warning' : data.statusDescription === 'Do Not Contact' || data.statusDescription === 'Transferred',
            'badge-dark' : data.statusDescription === 'Deceased',
            'badge-danger' : data.statusDescription === 'Deleted'
          }">{{data.statusDescription}}</span>
          <span class="badge badge-info text-info bg-white border border-info p-2 m-1">{{data.fundingType}}</span>
          <!--
          <span *ngIf="data.isLead" class="badge badge-warning p-2 m-1">Lead</span>
          -->
          </div>
      </div>

      <div class="modal-body bg-light">

          <p>{{data.genderDescription}}</p>
          <p>{{data.age}} years old</p>
          <p>{{data.mainAddress?.address}}</p>
          <p>{{data.mainAddress?.city}}</p>

      </div>

  `,
  styleUrls: ['./modal-right-menu.component.scss']
})
export class ModalRightMenuComponent implements OnInit {
  closeBtnName: string;
  data: CustomerListItem;

  constructor(public bsModalRef: BsModalRef) {
  }

  ngOnInit() {
  }

}
