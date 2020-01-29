import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustSearchRoutingModule} from './cust-search-routing.module';
import {CustSearchComponent} from './cust-search.component';
import {ClientListItemComponent} from './client-list-item/client-list-item.component';
import {SearchFormComponent} from './search-form/search-form.component';
// import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ClientListComponent} from './client-list/client-list.component';
import {CoreModule} from '../core/core.module';
import {HttpClientModule} from '@angular/common/http';
import {PaginationModule, BsDatepickerModule} from 'ngx-bootstrap';
import {PaginationComponent} from './pagination/pagination.component';
import {SharedModule} from '../shared/shared.module';
import {SortersComponent} from './sorters/sorters.component';
// import {NgHttpLoaderModule} from 'ng-http-loader';
// import { NgxUiLoaderModule } from 'ngx-ui-loader';
// import { AngularSvgIconModule } from 'angular-svg-icon';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    // HttpClientModule,
    CoreModule,
    CustSearchRoutingModule,
    // FormsModule,
    // ReactiveFormsModule,
    PaginationModule.forRoot(),
    SharedModule,
    // NgHttpLoaderModule.forRoot(),
    // NgxUiLoaderModule,
    // AngularSvgIconModule,
    // BsDatepickerModule.forRoot(),
    // NgbModule
  ],
  exports: [
     CustSearchComponent
  ]
})
export class CustSearchModule {
}
