import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccDetComponent } from './acc-det.component';

describe('AccDetComponent', () => {
  let component: AccDetComponent;
  let fixture: ComponentFixture<AccDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
