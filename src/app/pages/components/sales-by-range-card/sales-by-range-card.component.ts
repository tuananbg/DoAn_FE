import {Component, Input} from '@angular/core';
import {SalesOrOpportunitiesByCategory} from "../ticker-card/ticker-card.component";

@Component({
  selector: 'app-sales-by-range-card',
  templateUrl: './sales-by-range-card.component.html',
  styleUrls: ['./sales-by-range-card.component.less']
})
export class SalesByRangeCardComponent {

  @Input() data!: SalesOrOpportunitiesByCategory;

  customizeSaleText(arg: { percentText: string }) {
    return arg.percentText;
  }

}
