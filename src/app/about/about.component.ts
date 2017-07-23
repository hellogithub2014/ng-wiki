import { Component, OnInit } from '@angular/core';

import * as lodash from 'lodash';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
    console.log(`lodash test`);
    console.log(lodash.differenceWith(objects, [{ 'x': 1, 'y': 2 }], lodash.isEqual));
  }

}
