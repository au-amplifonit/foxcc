import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalScheduleComponent } from './clinical-schedule.component';

describe('ClinicalScheduleComponent', () => {
  let component: ClinicalScheduleComponent;
  let fixture: ComponentFixture<ClinicalScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicalScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
