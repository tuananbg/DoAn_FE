import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractAnalysisCardComponent } from './contract-analysis-card.component';

describe('ContractAnalysisCardComponent', () => {
  let component: ContractAnalysisCardComponent;
  let fixture: ComponentFixture<ContractAnalysisCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractAnalysisCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractAnalysisCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
