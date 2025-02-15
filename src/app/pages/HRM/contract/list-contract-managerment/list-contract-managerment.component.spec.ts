import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListContractManagermentComponent } from './list-contract-managerment.component';

describe('ListContractManagermentComponent', () => {
  let component: ListContractManagermentComponent;
  let fixture: ComponentFixture<ListContractManagermentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListContractManagermentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListContractManagermentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
