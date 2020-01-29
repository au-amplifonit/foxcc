import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HamburgerContentComponent } from './hamburger-content.component';

describe('HamburgerContentComponent', () => {
  let component: HamburgerContentComponent;
  let fixture: ComponentFixture<HamburgerContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HamburgerContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HamburgerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
