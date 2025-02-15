import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWageManagermentComponent } from './list-wage-managerment.component';

describe('ListWageManagermentComponent', () => {
  let component: ListWageManagermentComponent;
  let fixture: ComponentFixture<ListWageManagermentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListWageManagermentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWageManagermentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
