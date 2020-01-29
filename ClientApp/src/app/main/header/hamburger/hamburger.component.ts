import {Component, EventEmitter, Input, OnInit, Output, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { DynamicHeaderDirective } from 'src/app/dynamic-header.directive';
import { CustomerWidgetComponent } from 'src/app/shared/components/customer-widget/customer-widget.component';
import { CustomerSearchWidgetComponent } from 'src/app/shared/components/customer-search-widget/customer-search-widget.component';
import { Router, ActivatedRouteSnapshot, ActivatedRoute, NavigationStart, ResolveStart } from '@angular/router';
import { CustomerApiService } from 'src/app/core/services/api/customer/customer-api.service';

@Component({
  selector: 'fcw-hamburger',
  templateUrl: './hamburger.component.html',
  styleUrls: ['./hamburger.component.scss']
})
export class HamburgerComponent implements OnInit {
  @Output() hamOpenButtonClickd: EventEmitter<any> = new EventEmitter();
  @Input() show: boolean;
  @ViewChild(DynamicHeaderDirective, {static: true}) fcwDynamicHeader: DynamicHeaderDirective;
  private componentsArray: any[] = [CustomerWidgetComponent, CustomerSearchWidgetComponent];

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private router: Router, private customerService: CustomerApiService) {}

  ngOnInit() {
    this.router.events.subscribe(data => {

      if (data instanceof ResolveStart) {

        if (data.url !== '/main/custSearch') {
          this.resolveWidget(0);
        } else {
          this.resolveWidget(1);
        }
      }

    });

    if (this.router.url === '/main/custSearch') {
      this.resolveWidget(1);
    }

  }

  resolveWidget(idx) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.componentsArray[idx]);
    const viewContainerRef = this.fcwDynamicHeader.viewContainerRef;
    viewContainerRef.clear();
    viewContainerRef.createComponent(componentFactory);
  }

  setHamMenuOpen() {
    this.hamOpenButtonClickd.emit('hamOpenButtonClickd');
  }
}
