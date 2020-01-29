import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustAppComponent } from './cust-app.component';

describe('CustAppComponent', () => {
  let component: CustAppComponent;
  let fixture: ComponentFixture<CustAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
