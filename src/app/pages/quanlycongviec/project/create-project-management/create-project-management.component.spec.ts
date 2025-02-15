import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectManagementComponent } from './create-project-management.component';

describe('CreateProjectManagementComponent', () => {
  let component: CreateProjectManagementComponent;
  let fixture: ComponentFixture<CreateProjectManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProjectManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProjectManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
