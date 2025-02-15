import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListManagementComponent } from './project-list-management.component';

describe('ProjectListManagementComponent', () => {
  let component: ProjectListManagementComponent;
  let fixture: ComponentFixture<ProjectListManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectListManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectListManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
