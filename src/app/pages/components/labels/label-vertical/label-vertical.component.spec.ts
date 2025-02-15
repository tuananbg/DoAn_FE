import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelVerticalComponent } from './label-vertical.component';

describe('LabelVerticalComponent', () => {
  let component: LabelVerticalComponent;
  let fixture: ComponentFixture<LabelVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabelVerticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
