import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionManagermentComponent } from './position-managerment.component';

describe('PositionManagermentComponent', () => {
  let component: PositionManagermentComponent;
  let fixture: ComponentFixture<PositionManagermentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionManagermentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionManagermentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
