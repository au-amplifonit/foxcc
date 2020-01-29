import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustOverComponent } from './cust-over.component';

describe('CustOverComponent', () => {
  let component: CustOverComponent;
  let fixture: ComponentFixture<CustOverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustOverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
