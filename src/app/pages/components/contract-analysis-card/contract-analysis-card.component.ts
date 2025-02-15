import {Component, Input, OnInit} from '@angular/core';
import {SalesOrOpportunitiesByCategory} from "../ticker-card/ticker-card.component";

export type SalesByStateAndCity = SaleByStateAndCity[];
export type SaleByStateAndCity = {
  stateName: string,
  stateCoords: string,
  city: string,
  total: number,
  percentage: number,
};
@Component({
  selector: 'app-contract-analysis-card',
  templateUrl: './contract-analysis-card.component.html',
  styleUrls: ['./contract-analysis-card.component.less']
})
export class ContractAnalysisCardComponent{

  @Input() data!: SalesOrOpportunitiesByCategory;

  customizeSaleText(arg: { percentText: string }) {
    return arg.percentText;
  }

}
