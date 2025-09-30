import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReviewService } from '../../../core/services/review.service';
import { ReviewSubmission } from '../../../core/models/review.model';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StarRatingComponent,
    HlmCardImports,
    HlmButtonImports,
    HlmInputImports,
    HlmLabelImports
  ],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css'
})
export class ReviewFormComponent {
  @Input() movieId!: number;
  @Output() reviewSubmitted = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private reviewService = inject(ReviewService);

  reviewForm: FormGroup;
  isSubmitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  constructor() {
    this.reviewForm = this.fb.group({
      userName: ['', [Validators.required, Validators.maxLength(100)]],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.maxLength(1000)]]
    });
  }

  onRatingChange(rating: number) {
    this.reviewForm.patchValue({ rating });
  }

  onSubmit() {
    if (this.reviewForm.valid) {
      this.isSubmitting.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      const submission: ReviewSubmission = {
        movieId: this.movieId,
        ...this.reviewForm.value
      };

      this.reviewService.submitReview(submission).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.successMessage.set('Review submitted successfully!');
          this.reviewForm.reset();
          this.reviewForm.patchValue({ rating: 0 });
          this.reviewSubmitted.emit();

          // Clear success message after 3 seconds
          setTimeout(() => this.successMessage.set(''), 3000);
        },
        error: (error) => {
          this.isSubmitting.set(false);
          this.errorMessage.set('Failed to submit review. Please try again.');
          console.error('Error submitting review:', error);
        }
      });
    }
  }

  get userNameControl() {
    return this.reviewForm.get('userName');
  }

  get ratingControl() {
    return this.reviewForm.get('rating');
  }

  get commentControl() {
    return this.reviewForm.get('comment');
  }

  get currentRating(): number {
    return this.reviewForm.get('rating')?.value || 0;
  }
}