import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListQualificationManagerComponent } from './list-qualification-manager.component';

describe('ListQualificationManagerComponent', () => {
  let component: ListQualificationManagerComponent;
  let fixture: ComponentFixture<ListQualificationManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListQualificationManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListQualificationManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
