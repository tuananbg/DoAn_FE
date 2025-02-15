import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TickerCardComponent } from './ticker-card.component';

describe('TickerCardComponent', () => {
  let component: TickerCardComponent;
  let fixture: ComponentFixture<TickerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TickerCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TickerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
