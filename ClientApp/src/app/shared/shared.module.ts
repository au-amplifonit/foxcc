import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EllipsisButtonComponent } from './components/atoms/ellipsis-button/ellipsis-button.component';
import { ButtonsModule, BsDatepickerModule, TabsModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { RouterModule } from '@angular/router';
import { CardComponent } from './components/card/card.component';
import { BadgeGenericComponent } from './components/atoms/badge-generic/badge-generic.component';
import { HeaderWithBadgeComponent } from './components/card/components/header-with-badge/header-with-badge.component';
import { ConfirmButtonComponent } from './components/atoms/buttons/confirm-button.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomToast } from './components/atoms/custom-toast/custom-toast.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  ToastrModule,
  ToastContainerModule,
  ToastNoAnimationModule
} from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { registerLocaleData } from '@angular/common';
import localeAu from '@angular/common/locales/en-AU';
import { AppointmentModalComponent } from '../cust-profile/appointments/appointment-modal/appointment-modal.component';
import { CustAppListItemComponent } from '../cust-profile/cust-app/cust-app-list-item/cust-app-list-item.component';
import { KeysPipe } from './pipes/keys/keys.pipe';
import { CustSearchComponent } from '../cust-search/cust-search.component';
import { SearchFormComponent } from '../cust-search/search-form/search-form.component';
import { SortersComponent } from '../cust-search/sorters/sorters.component';
import { PaginationComponent } from '../cust-search/pagination/pagination.component';
import { ClientListComponent } from '../cust-search/client-list/client-list.component';
import { ClientListItemComponent } from '../cust-search/client-list-item/client-list-item.component';
import { CustAppModalComponent } from '../cust-profile/cust-app/cust-app-modal/cust-app-modal.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NotesModalComponent } from '../cust-profile/notes/notes-modal/notes-modal.component';
import { InfoModalComponent } from './components/info-modal/info-modal.component';
import { DynamicHeaderDirective } from '../dynamic-header.directive';
import { CustomerWidgetComponent } from './components/customer-widget/customer-widget.component';
import { CustomerSearchWidgetComponent } from './components/customer-search-widget/customer-search-widget.component';
import { QuickViewComponent } from './components/quick-view/quick-view.component';
import { ProductViewComponent } from './components/product-view/product-view.component';
import { AddressConfirmModalComponent } from './components/address-confirm-modal/address-confirm-modal.component';
registerLocaleData(localeAu);

@NgModule({
  declarations: [
    EllipsisButtonComponent,
    CardComponent,
    BadgeGenericComponent,
    HeaderWithBadgeComponent,
    ConfirmButtonComponent,
    CustomToast,
    ClientListItemComponent,
    CustSearchComponent,
    AppointmentModalComponent,
    CustAppListItemComponent,
    KeysPipe,
    SearchFormComponent,
    SortersComponent,
    PaginationComponent,
    ClientListComponent,
    CustAppModalComponent,
    NotesModalComponent,
    InfoModalComponent,
    DynamicHeaderDirective,
    CustomerWidgetComponent,
    CustomerSearchWidgetComponent,
    QuickViewComponent,
    ProductViewComponent,
    AddressConfirmModalComponent
  ],
  exports: [
    EllipsisButtonComponent,
    CollapseModule,
    InfoModalComponent,
    SearchFormComponent,
    AngularMultiSelectModule,
    CardComponent,
    BadgeGenericComponent,
    AppointmentModalComponent,
    HeaderWithBadgeComponent,
    ConfirmButtonComponent,
    CustomToast,
    NotesModalComponent,
    CommonModule,
    BsDropdownModule,
    NgxUiLoaderModule,
    ToastrModule,
    AccordionModule,
    AngularSvgIconModule,
    NgbModule,
    UiSwitchModule,
    ReactiveFormsModule,
    ToastContainerModule,
    ToastNoAnimationModule,
    BsDatepickerModule,
    DynamicHeaderDirective,
    TabsModule,
    FormsModule,
    NgxSpinnerModule,
    CustAppListItemComponent,
    FullCalendarModule,
    KeysPipe,
    CustSearchComponent,
    SortersComponent,
    PaginationComponent,
    ClientListComponent,
    ClientListItemComponent,
    CustAppModalComponent,
    TypeaheadModule,
    CustomerWidgetComponent
  ],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(),
    RouterModule,
    AngularMultiSelectModule,
    NgxUiLoaderModule,
    AngularSvgIconModule,
    ToastrModule.forRoot(),
    NgbModule,
    UiSwitchModule,
    CollapseModule,
    ReactiveFormsModule,
    ButtonsModule,
    ToastContainerModule,
    BsDatepickerModule.forRoot(),
    ToastNoAnimationModule,
    TabsModule,
    FormsModule,
    NgxSpinnerModule,
    FullCalendarModule,
    TypeaheadModule.forRoot()
  ],
  entryComponents: [
    CustomToast,
    AppointmentModalComponent,
    CustSearchComponent,
    CustAppModalComponent,
    NotesModalComponent,
    InfoModalComponent,
    CustomerWidgetComponent,
    CustomerSearchWidgetComponent,
    QuickViewComponent,
    AddressConfirmModalComponent
  ]
})
export class SharedModule {}
