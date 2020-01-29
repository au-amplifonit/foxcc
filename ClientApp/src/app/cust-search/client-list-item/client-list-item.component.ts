import { Component, Input, OnInit } from '@angular/core';
import {
  CustomerListItem,
  Customer
} from "src/app/shared/models/customer.model";
import { ShareCustomerElementService } from "src/app/shared/share-customer-element-service.service";
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { QuickViewComponent } from 'src/app/shared/components/quick-view/quick-view.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'fcw-client-list-item',
  template: `
    <div
      class="col-md-12 my-3 rounded p-3 cont bg-white"
      [ngClass]="{ 'shadow-c': contextClinical }"
    >
      <div class="row">
        <div
          (click)="
            contextClinical
              ? handleClickClinical($event, client)
              : this.openQuickView()
          "
          class="col-md-11 d-flex align-items-center flex-direction-row"
        >
          <div class="col-md-3">
            <div
              class="d-flex"
              title="{{ client.firstname }} {{ client.lastname }}"
            >
              <h5 *ngIf="client.salutationDescription">
                {{ client.salutationDescription}} <span class="pl-1 d-inline-block"></span>
              </h5>
              <h5 class="ellipsis">
                {{ client.firstname }} {{ client.lastname }}
              </h5>
            </div>
            <h5
              class="badge p-2 m-1"
              [ngClass]="{
                'badge-success':
                  client.statusDescription === 'Active' ||
                  client.statusDescription === 'Active Lead',
                'badge-warning':
                  client.statusDescription === 'Do Not Contact' ||
                  client.statusDescription === 'Transferred',
                'badge-dark': client.statusDescription === 'Deceased',
                'badge-danger': client.statusDescription === 'Deleted'
              }"
            >
              {{ client.statusDescription }}
            </h5>
            <h5
             *ngIf="client.fundingType"
              class="badge badge-info text-info bg-white border border-info p-2 m-1"
            >
              {{ client.fundingType }}
            </h5>
          </div>
          <div class="col-md-3 align-right">
            <h5>{{ client.birthday | date: "dd-MM-yyyy" }}</h5>
            <h5 class="ctext text-secondary">
              {{ client.age }} {{ client.age ? "years old" : "" }}
            </h5>
            <h5 class="ctext text-secondary">
              {{ client.genderDescription | titlecase }}
            </h5>
          </div>
          <div class="col-md-3 align-center">
            <h5>
              {{
                client.mainAddress?.mobile
                  ? client.mainAddress?.mobile
                  : (client.mainAddress?.phones)[0]
              }}
            </h5>
            <h5
              [ngClass]="{
                'ctext text-secondary':
                  client.mainAddress?.mobile != '          '
              }"
            >
              {{
                client.mainAddress?.mobile
                  ? (client.mainAddress?.phones)[0]
                  : (client.mainAddress?.phones)[1]
              }}
            </h5>
            <h5 class="ctext ellipsis" title="{{ client.mainAddress?.eMail }}">
              {{ client.mainAddress?.eMail }}
            </h5>
          </div>
          <div class="col-md-3 align-left">
            <h5>
              {{ (client.mainAddress?.address)[0] }}
              {{
                (client.mainAddress?.address)[1] !== null
                  ? (client.mainAddress?.address)[1]
                  : ""
              }}
            </h5>
            <h5 class="ctext text-secondary">
              {{ client.mainAddress?.city | titlecase }}
            </h5>
            <h5 class="ctext text-secondary">
              {{ client.mainAddress?.stateCode }}
              {{ client.mainAddress?.zipCode }}
            </h5>
          </div>
        </div>
        <div class="col-md-1 align-self-center">
          <fcw-ellipsis-button
            *ngIf="!contextClinical"
            [data]="client"
            [menuItems]="menuItems"
            [inContactPhoneSearch]="inContact"
            (ellipsisPoppedUp)="setEllipsisToggle($event)"
          ></fcw-ellipsis-button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./client-list-item.component.scss']
})
export class ClientListItemComponent implements OnInit {
  @Input() client: CustomerListItem;
  @Input() contextClinical: boolean;
  preSelectedCustomer: CustomerListItem;
  @Input() inContact: boolean;

  bsModalRef: BsModalRef;
  constructor(private share: ShareCustomerElementService, private modalService: BsModalService,private route: ActivatedRoute) {}
  menuItems = [];
  ellippsisToggle = false;
  ngOnInit() {

    if (!this.client.isLead) {
      this.menuItems.push(
        {
          id: 'profile',
          url: '/main/custProfile/acc-det',
          icon: '../../../../assets/img/svg/person_2.svg',
          text: 'View profile'
        },
        {
          id: 'appointment',
          url: '/main/custProfile/appointments/newAppointment',
          icon: '../../../../assets/img/svg/book-appointment-grey_2.svg',
          text: 'Make appointment'
        }
      );
    } else {
      this.menuItems.push(
        {
          id: 'convert',
          url: '/main/custProfile/acc-det',
          icon: '../../../../assets/img/svg/filter.svg',
          text: 'Convert to Qualified Lead'
        },
        {
          id: 'appointment',
          url: '/main/custProfile/appointments/newAppointment',
          icon: '../../../../assets/img/svg/book-appointment-grey_2.svg',
          text: 'Make appointment'
        }
      );
    }
  }

  setEllipsisToggle(ellipsisToggle) {
    this.ellippsisToggle = ellipsisToggle;
  }

  getListElementData($event, data: CustomerListItem) {
    $event.preventDefault();
    if (!this.ellippsisToggle) {
      $event.stopPropagation();
      this.share.emitData(data);
    }
  }

  handleClick($event, item) {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      this.getListElementData($event, item);
    }
    this.ellippsisToggle = false;
  }
  handleClickClinical($event, item): void {
    this.preSelectedCustomer = item;
    this.share.emitConfirmedCustomerClinical(this.preSelectedCustomer);
  }

  openQuickView() {
    this.bsModalRef = this.modalService.show(QuickViewComponent, {
      class: 'modal-xl mt-1 modal-dialog quick-fixed-right',
      initialState: {
        customer: this.client
      }
    });

  }

  salutationNeedsDot(sal: string): boolean {
    return sal === 'Mr' || sal === 'Mrs' || sal === 'Ms';
  }
}
