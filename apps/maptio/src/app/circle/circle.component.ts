import { Component, Input } from '@angular/core';

import { CircleMapService } from '../shared/circle-map.service';
import { InitiativeNode } from '../shared/initiative.model';


@Component({
  selector: 'g[maptioCircle]', // eslint-disable-line @angular-eslint/component-selector
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss'],
})
export class CircleComponent {
  @Input() circle!: InitiativeNode;

  // TODO: Move calculations into typescript code
  math = Math;

  constructor(private circleMapService: CircleMapService) {}

  onClick($event: MouseEvent) {
    console.log(`CircleComponent.onClick fired for: ${this.circle.data.name}`);

    this.circleMapService.onCircleClick(this.circle);

    // Avoid triggering click events for circles underneath this one
    $event.stopPropagation();
  }
}
