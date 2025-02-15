import {Component, Input} from '@angular/core';

export type SaleOrOpportunityByCategory = {
  name: string,
  value: number,
};
export type Sale = {
  date: string | Date,
  category: string,
  total: number
};
export type SalesOrOpportunitiesByCategory = SaleOrOpportunityByCategory[];
export type Sales = Sale[];
@Component({
  selector: 'app-ticker-card',
  templateUrl: './ticker-card.component.html',
  styleUrls: ['./ticker-card.component.less']
})
export class TickerCardComponent {

  @Input() titleText: any;
  @Input() addText: any;

  @Input() data: SalesOrOpportunitiesByCategory | Sales | null = null;

  @Input() total: string | null = null;

  @Input() percentage!: number;

  @Input() icon!: string;

  @Input() tone?: 'warning' | 'info';

  @Input() contentClass: string | null = null;

  getTotal(data: Array<{ value?: number; total?: number }>): number {
    return (data || []).reduce((total, item) => total + (item.value ?? item.total ?? 0), 0);
  }

  abs(value: number): number {
    return Math.abs(value);
  }

  getIconClass = () => this.tone || (this.percentage > 0 ? 'positive' : 'negative');

}
