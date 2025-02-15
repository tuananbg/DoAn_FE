import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionManagermentFormComponent } from './position-managerment-form.component';

describe('PositionManagermentFormComponent', () => {
  let component: PositionManagermentFormComponent;
  let fixture: ComponentFixture<PositionManagermentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionManagermentFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionManagermentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
