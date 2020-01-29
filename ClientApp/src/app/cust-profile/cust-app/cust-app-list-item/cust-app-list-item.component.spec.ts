import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustAppListItemComponent } from './cust-app-list-item.component';

describe('CustAppListItemComponent', () => {
  let component: CustAppListItemComponent;
  let fixture: ComponentFixture<CustAppListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustAppListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustAppListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
