import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTextV2Component } from './input-text-v2.component';

describe('InputTextV2Component', () => {
  let component: InputTextV2Component;
  let fixture: ComponentFixture<InputTextV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputTextV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTextV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
