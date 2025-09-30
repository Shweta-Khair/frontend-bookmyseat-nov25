import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true
    }
  ],
  template: `
    <div class="star-rating" 
         [class.readonly]="readonly"
         (click)="onContainerClick($event)">
      <span
        *ngFor="let star of stars"
        class="star"
        [ngClass]="{'filled': star <= displayRating}"
        (click)="onStarClick(star); $event.stopPropagation()"
        (mouseenter)="onStarHover(star)"
        (mouseleave)="onStarLeave()">
        ★
      </span>
    </div>
  `,
  styles: [`
    .star-rating {
      display: inline-flex;
      gap: 0.5rem;
      font-size: 2rem;
      position: relative;
      z-index: 1;
    }

    .star-rating:not(.readonly) {
      cursor: pointer;
    }

    .star-rating.readonly {
      cursor: default;
      pointer-events: none;
    }

    .star {
      color: #d1d5db;
      transition: all 0.2s;
      cursor: pointer;
      user-select: none;
      padding: 0.25rem;
      position: relative;
      z-index: 2;
    }

    .star-rating:not(.readonly) .star {
      cursor: pointer;
      pointer-events: auto;
    }

    .star-rating:not(.readonly) .star:hover {
      color: #f59e0b;
      transform: scale(1.1);
    }

    .star.filled {
      color: #f59e0b;
    }

    .star.half {
      background: linear-gradient(90deg, #f59e0b 50%, #d1d5db 50%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  `]
})
export class StarRatingComponent implements ControlValueAccessor {
  @Input() readonly = false;
  @Input() set rating(value: number | null) {
    this._rating = value || 0;
  }
  get rating(): number {
    return this._rating;
  }
  @Output() ratingChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];
  hoverRating = 0;
  private _rating: number = 0;

  private onChange = (value: number | null) => {};
  private onTouched = () => {};

  get displayRating(): number {
    return this.hoverRating || this.rating || 0;
  }

  writeValue(value: number | null): void {
    this._rating = value || 0;
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.readonly = isDisabled;
  }

  onStarClick(star: number) {
    if (!this.readonly) {
      this._rating = star;
      this.onChange(star);
      this.onTouched();
      this.ratingChange.emit(star);
    }
  }

  onStarHover(star: number) {
    if (!this.readonly) {
      this.hoverRating = star;
    }
  }

  onStarLeave() {
    this.hoverRating = 0;
  }

  onContainerClick(event: Event) {
    // Container click handler for debugging if needed
  }
}