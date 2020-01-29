import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustAppModalComponent } from './cust-app-modal.component';

describe('CustAppModalComponent', () => {
  let component: CustAppModalComponent;
  let fixture: ComponentFixture<CustAppModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustAppModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustAppModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
