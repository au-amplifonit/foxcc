import {Component, OnInit} from '@angular/core';
import {ShareCustomerElementService} from '../../shared/share-customer-element-service.service';
import {CustomerListItem} from '../../shared/models/customer.model';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ModalRightMenuComponent} from '../modal-right-menu/modal-right-menu.component';

@Component({
  selector: 'fcw-header',
  template: `
      <fcw-hamburger
        (hamOpenButtonClickd)="setShowH()"
        [show]="showLMenu">
      </fcw-hamburger>
      <div class="row">
        <fcw-left-menu [show]="showLMenu" (linkClicked)="setShowH()"></fcw-left-menu>
      </div>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showRMenu = false;
  showLMenu = false;
  bsModalRef: BsModalRef;
  private dataForQMenu: CustomerListItem;

  constructor(
    private share: ShareCustomerElementService,
    private modalService: BsModalService
  ) {
    share.dataEmitted$.subscribe(m => {
      this.dataForQMenu = m;
      this.setShow(m);
    });
  }

  ngOnInit() {
  }

  setShow(data) {
    // this.showRMenu = !this.showRMenu;
    this.openModal(data);
  }

  setShowH() {
    this.showLMenu = !this.showLMenu;
  }

  openModal(data: CustomerListItem) {
    this.bsModalRef = this.modalService.show(ModalRightMenuComponent, {
      initialState: {
        data
      }
    });
    this.bsModalRef.setClass('modal-fixed-right');
    this.bsModalRef.content.closeBtnName = 'Close';
    // this.bsModalRef.content.data = data;
  }
}
