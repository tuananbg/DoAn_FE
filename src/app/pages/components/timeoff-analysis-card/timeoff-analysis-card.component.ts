import {Component, Input, OnInit} from '@angular/core';

export type SalesByState = SaleByState[];
export type SaleByState = {
  employeeName: string,
  totalTask: number,
  totalTaskDone: number,
  percentage: number,
};
@Component({
  selector: 'app-timeoff-analysis-card',
  templateUrl: './timeoff-analysis-card.component.html',
  styleUrls: ['./timeoff-analysis-card.component.less']
})
export class TimeoffAnalysisCardComponent{

  @Input() data!: SalesByState;

}
