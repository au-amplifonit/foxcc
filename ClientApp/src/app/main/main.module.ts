import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MainRoutingModule} from './main-routing.module';

import {MainComponent} from './main.component';
import {HeaderComponent} from './header/header.component';
import {HamburgerComponent} from './header/hamburger/hamburger.component';
import {HamburgerContentComponent} from './header/hamburger-content/hamburger-content.component';
import {InfoBarComponent} from './header/info-bar/info-bar.component';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {ModalModule} from 'ngx-bootstrap/modal';
import {LeftMenuComponent} from './left-menu/left-menu.component';
import {ModalRightMenuComponent} from './modal-right-menu/modal-right-menu.component';
import {SharedModule} from '../shared/shared.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [MainComponent,
    HeaderComponent,
    HamburgerComponent,
    HamburgerContentComponent,
    InfoBarComponent,
    LeftMenuComponent,
    ModalRightMenuComponent, ],
  imports: [
    CommonModule,
    SharedModule,
    MainRoutingModule,
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    AngularSvgIconModule
  ],
  exports: [],
  entryComponents: [ModalRightMenuComponent]
})
export class MainModule {
}
