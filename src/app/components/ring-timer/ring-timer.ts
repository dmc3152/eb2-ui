import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-ring-timer',
  imports: [],
  templateUrl: './ring-timer.html',
  styleUrl: './ring-timer.scss'
})
export class RingTimer {
  duration = input.required<number>(); // Total time in seconds
  size = input<number>(120);           // Diameter in pixels
  strokeWidth = input<number>(8);      // Thickness of the ring
  color = input<string>('color-default');
  fontColorClass = input<string>('font-color-default');

  // Internal State
  private startTime: number = 0;
  private animationFrameId: number | null = null;

  // Signals for UI updates
  timeLeft = signal<number>(0);
  progress = signal<number>(1); // 0 to 1
  isComplete = signal<boolean>(false);

  // Computed Values for SVG Math
  center = computed(() => this.size() / 2);
  radius = computed(() => (this.size() - this.strokeWidth()) / 2);
  circumference = computed(() => 2 * Math.PI * this.radius());
  fontSize = computed(() => this.size() / 2.5);

  // Calculate the stroke-dashoffset based on progress
  // progress 1 = full circle (offset 0)
  // progress 0 = empty circle (offset circumference)
  dashOffset = computed(() => {
    const value = this.circumference() - (this.progress() * this.circumference());
    return value;
  });

  // Dynamic color class - changes to red when low on time
  colorClass = computed(() => {
    if (this.isComplete()) return 'color-complete';
    if (this.progress() < 0.3) return 'color-warning'; // Warning color (last 20%)
    return `stroke-current ${this.color()}`;
  });

  // Format time for display (mm:ss or just ss depending on duration)
  displayTime = computed(() => {
    const s = Math.ceil(this.timeLeft());
    if (this.duration() > 60) {
      const mins = Math.floor(s / 60);
      const secs = s % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return s.toString();
  });

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  startTimer() {
    this.stopTimer(); // Clear existing if any
    this.startTime = performance.now();
    this.isComplete.set(false);

    // Initial State
    this.timeLeft.set(this.duration());
    this.progress.set(1);

    // Start Animation Loop
    this.tick();
  }

  stopTimer() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private tick = () => {
    const now = performance.now();
    const elapsed = (now - this.startTime) / 1000; // in seconds
    const remaining = Math.max(0, this.duration() - elapsed);

    // Update State
    this.timeLeft.set(remaining);
    this.progress.set(remaining / this.duration());

    if (remaining > 0) {
      this.animationFrameId = requestAnimationFrame(this.tick);
    } else {
      this.isComplete.set(true);
      this.timeLeft.set(0);
      this.progress.set(0);
    }
  };

  // Public method to reset from parent
  reset() {
    this.startTimer();
  }
}
