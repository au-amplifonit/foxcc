import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fcw-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements OnInit {

  @Input() product: any;

  constructor() { }

  ngOnInit() {
  }

}
