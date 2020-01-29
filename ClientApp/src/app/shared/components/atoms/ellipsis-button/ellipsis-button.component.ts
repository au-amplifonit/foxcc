import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ButtonMenuItemsList} from '../../../models/utility/button-menu-items-list';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerApiService } from 'src/app/core/services/api/customer/customer-api.service';

@Component({
  selector: 'fcw-ellipsis-button',
  templateUrl: './ellipsis-button.component.html',
  styleUrls: ['./ellipsis-button.component.scss']
})
export class EllipsisButtonComponent implements OnInit {
  @Input() menuItems: ButtonMenuItemsList[];
  @Input() data: any;
  @Input() inContactPhoneSearch: boolean;
  @Input() dataMenu: ButtonMenuItemsList;
  @Output() ellipsisEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() ellipsisPoppedUp: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router, private customerApiService: CustomerApiService, private route: ActivatedRoute) {
    this.menuItems = [this.dataMenu];
  }

  ngOnInit() {
  }

  navigateTo(menuItemId: string, menuItemUrl: string, customerId: string) {
    if (menuItemId === 'profile') {
      this.router.navigate([`${menuItemUrl}/${customerId}`]);
      this.customerApiService.updateCustomer(this.data);
    } else if (menuItemId === 'appointment') {
      if (this.inContactPhoneSearch) {
        const phonenumber = this.route.snapshot.queryParamMap.get('phonenumber');
        const queryParams = this.route.snapshot.queryParams;
        const def = {
          customerId: `${customerId}`,
          ...queryParams
        }
        this.router.navigate([`${menuItemUrl}`], { queryParams: def });
      } else {
        this.router.navigate([`${menuItemUrl}`], { queryParams: { customerId: `${customerId}`} });
      }
    }
  }

  launchEvent(eventName: string, $event: any) {
    $event.stopPropagation();
    this.ellipsisPoppedUp.emit(true);
    this.ellipsisEvent.emit(eventName);
  }
}
