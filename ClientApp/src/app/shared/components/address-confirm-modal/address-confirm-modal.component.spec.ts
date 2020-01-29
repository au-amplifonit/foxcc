import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressConfirmModalComponent } from './address-confirm-modal.component';

describe('AddressConfirmModalComponent', () => {
  let component: AddressConfirmModalComponent;
  let fixture: ComponentFixture<AddressConfirmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressConfirmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
