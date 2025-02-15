import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeoffAnalysisCardComponent } from './timeoff-analysis-card.component';

describe('TimeoffAnalysisCardComponent', () => {
  let component: TimeoffAnalysisCardComponent;
  let fixture: ComponentFixture<TimeoffAnalysisCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeoffAnalysisCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeoffAnalysisCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
