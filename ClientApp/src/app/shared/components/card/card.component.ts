import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ButtonMenuItemsList} from '../../models/utility/button-menu-items-list';

@Component({
  selector: 'fcw-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() data: any;
  @Input() card: string;
  @Input() dataMenu: ButtonMenuItemsList[];
  @Output() eventFromCard: EventEmitter<string> = new EventEmitter();
  @Input() footerHidden = false;
  @Input() isNewForm: boolean;
  @Input() isOtherContactPreferred: boolean;
  @Input() showButton: boolean;

  localAccordionToggler = true;
  ellippsisToggle = false;
  constructor() { }

  ngOnInit() {
    // this.localAccordionToggler = this.card !== 'otherContact' ? !this.localAccordionToggler : this.localAccordionToggler;
  }

  setEllipsisToggle(ellipsisToggle) {
    this.ellippsisToggle = ellipsisToggle;
  }

  toggleAccordionGroup($event) {
    if (this.ellippsisToggle) {
      this.localAccordionToggler = !this.localAccordionToggler;
    } else {
      this.localAccordionToggler = !this.localAccordionToggler;
      this.ellippsisToggle = false;
    }
  }
  bubbleEvent($event: string) {
    this.eventFromCard.emit($event);
  }
}
