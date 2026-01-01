import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, Input, OnDestroy, OnInit, QueryList } from '@angular/core';
import { CdkStep, CdkStepper } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [NgTemplateOutlet],
  providers: [{ provide: CdkStepper, useExisting: Carousel }],
  templateUrl: './carousel.html',
  styleUrls: ['./carousel.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Carousel extends CdkStepper implements OnInit, AfterContentInit, OnDestroy {
  // Use ContentChildren to grab all the <cdk-step> elements passed into the component
  @ContentChildren(CdkStep, { descendants: true })
  override steps: QueryList<CdkStep> = new QueryList<CdkStep>();

  // Input to control the slide transition speed (optional)
  @Input() transitionSpeed: number = 300; // in milliseconds

  ngOnInit(): void {
    // Set the orientation to horizontal (default for a carousel)
    this.orientation = 'horizontal';
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  // CdkStepper relies on the steps QueryList being set after content initialization
  override ngAfterContentInit(): void {
    super.ngAfterContentInit();
  }

  // Public methods to control navigation (can be used by parent component)
  goNext(): void {
    this.next();
  }

  goPrevious(): void {
    this.previous();
  }

  goTo(index: number): void {
    this.selectedIndex = index;
  }
}
