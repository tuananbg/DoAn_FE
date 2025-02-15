import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationFlowComponent } from './information-flow.component';

describe('InformationFlowComponent', () => {
  let component: InformationFlowComponent;
  let fixture: ComponentFixture<InformationFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationFlowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
