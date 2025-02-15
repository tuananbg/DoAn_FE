import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentManagermentComponent } from './department-managerment.component';

describe('DepartmentManagermentComponent', () => {
  let component: DepartmentManagermentComponent;
  let fixture: ComponentFixture<DepartmentManagermentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentManagermentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentManagermentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
