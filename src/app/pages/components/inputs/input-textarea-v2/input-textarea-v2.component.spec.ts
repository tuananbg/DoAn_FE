import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTextareaV2Component } from './input-textarea-v2.component';

describe('InputTextareaV2Component', () => {
  let component: InputTextareaV2Component;
  let fixture: ComponentFixture<InputTextareaV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputTextareaV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTextareaV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
