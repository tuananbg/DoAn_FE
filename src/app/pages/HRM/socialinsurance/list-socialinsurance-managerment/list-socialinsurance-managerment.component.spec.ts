import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSocialinsuranceManagermentComponent } from './list-socialinsurance-managerment.component';

describe('ListSocialinsuranceManagermentComponent', () => {
  let component: ListSocialinsuranceManagermentComponent;
  let fixture: ComponentFixture<ListSocialinsuranceManagermentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSocialinsuranceManagermentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSocialinsuranceManagermentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
