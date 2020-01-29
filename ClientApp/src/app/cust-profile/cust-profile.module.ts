import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustProfileRoutingModule} from './cust-profile-routing.module';
import {CustProfileComponent} from './cust-profile.component';
import {TabsetConfig} from 'ngx-bootstrap';
import {CoreModule} from '../core/core.module';
// import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from '../shared/shared.module';
// import {CustomerApiService} from '../core/services/api/customer/customer-api.service';
// import {NgHttpLoaderModule} from 'ng-http-loader';
// import { NgxUiLoaderModule } from 'ngx-ui-loader';
// import { AngularSvgIconModule } from 'angular-svg-icon';


@NgModule({
  declarations: [CustProfileComponent],
  imports: [
    CommonModule,
    // HttpClientModule,
    // CoreModule,
    SharedModule,
    CustProfileRoutingModule,
    // TabsModule,
    // NgHttpLoaderModule.forRoot(),
    // NgxUiLoaderModule,
    // AngularSvgIconModule
  ],
  providers: [TabsetConfig]
})
export class CustProfileModule { }
