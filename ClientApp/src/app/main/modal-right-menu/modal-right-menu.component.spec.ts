import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRightMenuComponent } from './modal-right-menu.component';

describe('ModalRightMenuComponent', () => {
  let component: ModalRightMenuComponent;
  let fixture: ComponentFixture<ModalRightMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRightMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRightMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
