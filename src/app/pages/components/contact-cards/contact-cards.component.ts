import {Component, Input, OnInit} from '@angular/core';
import {Activity} from "../../../core/activities";
import {Opportunities} from "../../../core/opportunities";
import {Notes} from "../../../core/notes";
import {Messages} from "../../../core/messages";
import {TaskForm} from "../../../core/task";

@Component({
  selector: 'app-contact-cards',
  templateUrl: './contact-cards.component.html',
  styleUrls: ['./contact-cards.component.less']
})
export class ContactCardsComponent {

  @Input() tasks: TaskForm[] | undefined;

  @Input() activities: Activity[] | undefined;

  @Input() activeOpportunities!: Opportunities;

  @Input() closedOpportunities!: Opportunities;

  @Input() notes!: Notes;

  @Input() messages!: Messages;

  @Input() contactName: any;

  @Input() isLoading!: boolean;

}
