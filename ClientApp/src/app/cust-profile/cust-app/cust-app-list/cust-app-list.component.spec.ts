import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustAppListComponent } from './cust-app-list.component';

describe('CustAppListComponent', () => {
  let component: CustAppListComponent;
  let fixture: ComponentFixture<CustAppListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustAppListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustAppListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
