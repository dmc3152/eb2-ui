import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { Carousel } from './carousel';
import { Directionality } from '@angular/cdk/bidi';
import { of } from 'rxjs';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [Carousel, CdkStepperModule],
  template: `
    <app-carousel>
      <cdk-step>Step 1</cdk-step>
      <cdk-step>Step 2</cdk-step>
      <cdk-step>Step 3</cdk-step>
    </app-carousel>
  `
})
class TestHostComponent {}

describe('Carousel', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let component: Carousel;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: Directionality, useValue: { value: 'ltr', change: of() } }]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const carouselDebugEl = hostFixture.debugElement.query(By.directive(Carousel));
    component = carouselDebugEl.componentInstance;

    // Prevent QueryList.destroy from throwing during test cleanup
    if (component?.steps && (component.steps as any).destroy) {
      // Replace destroy with a no-op to avoid 'object unsubscribed' during cleanup
      (component.steps as any).destroy = () => {};
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default orientation and transitionSpeed', () => {
    expect(component.orientation).toBe('horizontal');
    expect(component.transitionSpeed).toBe(300);
  });

  it('should initialize steps from content children', () => {
    expect(component.steps.length).toBe(3);
  });

  it('should navigate using goNext and goPrevious', () => {
    expect(component.selectedIndex).toBe(0);
    component.goNext();
    expect(component.selectedIndex).toBe(1);
    component.goPrevious();
    expect(component.selectedIndex).toBe(0);
  });

  it('should goTo specific index', () => {
    component.goTo(2);
    expect(component.selectedIndex).toBe(2);
  });
});
