import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HeaderWithBadgeComponent} from './header-with-badge.component';

describe('HeaderWithBadgeComponent', () => {
  let component: HeaderWithBadgeComponent;
  let fixture: ComponentFixture<HeaderWithBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderWithBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderWithBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
