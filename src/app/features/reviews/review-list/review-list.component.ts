import { Component, Input, Output, EventEmitter, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../core/models/review.model';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [
    CommonModule,
    StarRatingComponent,
    ReviewFormComponent,
    HlmCardImports,
    HlmButtonImports,
    HlmSpinnerImports
  ],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.css'
})
export class ReviewListComponent implements OnInit {
  @Input() movieId!: number;
  @Output() reviewSubmitted = new EventEmitter<void>();

  private reviewService = inject(ReviewService);

  reviews = signal<Review[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);
  totalReviews = signal(0);
  isLoading = signal(false);
  isLastPage = signal(false);

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.isLoading.set(true);
    this.reviewService.getReviewsForMovie(this.movieId, this.currentPage()).subscribe({
      next: (page) => {
        console.log('Reviews loaded:', page);
        this.reviews.set(page?.reviews || []);
        this.totalPages.set(page?.totalPages || 0);
        this.totalReviews.set(page?.totalReviews || 0);
        this.isLastPage.set(page?.last || false);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.reviews.set([]);
        this.totalReviews.set(0);
        this.isLoading.set(false);
      }
    });
  }

  loadMore() {
    if (!this.isLastPage()) {
      this.currentPage.update(page => page + 1);
      this.loadReviews();
    }
  }

  onReviewSubmitted() {
    this.currentPage.set(0);
    // Add a small delay to ensure the backend has processed the review
    setTimeout(() => {
      this.loadReviews();
      // Emit the event to parent component (movie-detail)
      this.reviewSubmitted.emit();
    }, 500);
  }

  trackByReviewId(index: number, review: Review): number {
    return review.id;
  }
}