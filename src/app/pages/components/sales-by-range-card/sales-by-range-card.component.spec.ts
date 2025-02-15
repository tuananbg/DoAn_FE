import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesByRangeCardComponent } from './sales-by-range-card.component';

describe('SalesByRangeCardComponent', () => {
  let component: SalesByRangeCardComponent;
  let fixture: ComponentFixture<SalesByRangeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesByRangeCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesByRangeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
