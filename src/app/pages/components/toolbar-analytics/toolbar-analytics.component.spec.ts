import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarAnalyticsComponent } from './toolbar-analytics.component';

describe('ToolbarAnalyticsComponent', () => {
  let component: ToolbarAnalyticsComponent;
  let fixture: ComponentFixture<ToolbarAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
