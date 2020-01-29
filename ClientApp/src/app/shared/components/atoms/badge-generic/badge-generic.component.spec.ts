import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BadgeGenericComponent} from './badge-generic.component';

describe('BadgeGenericComponent', () => {
  let component: BadgeGenericComponent;
  let fixture: ComponentFixture<BadgeGenericComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BadgeGenericComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
