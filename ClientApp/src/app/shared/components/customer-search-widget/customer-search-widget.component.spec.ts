import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSearchWidgetComponent } from './customer-search-widget.component';

describe('CustomerSearchWidgetComponent', () => {
  let component: CustomerSearchWidgetComponent;
  let fixture: ComponentFixture<CustomerSearchWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSearchWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSearchWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
