import { Component, Input, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../core/services/review.service';
import { RatingSummary } from '../../../core/models/review.model';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-rating-summary',
  standalone: true,
  imports: [
    CommonModule,
    StarRatingComponent,
    HlmCardImports
  ],
  templateUrl: './rating-summary.component.html',
  styleUrl: './rating-summary.component.css'
})
export class RatingSummaryComponent implements OnInit {
  @Input() movieId!: number;

  private reviewService = inject(ReviewService);

  ratingSummary = signal<RatingSummary | null>(null);
  isLoading = signal(false);

  // Compute percentage for each rating level for the bar chart
  ratingDistribution = computed(() => {
    const summary = this.ratingSummary();
    if (!summary || summary.totalReviews === 0) {
      return [];
    }

    const dist = summary.ratingDistribution;
    const distribution = [
      { stars: 5, count: dist['5'] || 0, percentage: ((dist['5'] || 0) / summary.totalReviews) * 100 },
      { stars: 4, count: dist['4'] || 0, percentage: ((dist['4'] || 0) / summary.totalReviews) * 100 },
      { stars: 3, count: dist['3'] || 0, percentage: ((dist['3'] || 0) / summary.totalReviews) * 100 },
      { stars: 2, count: dist['2'] || 0, percentage: ((dist['2'] || 0) / summary.totalReviews) * 100 },
      { stars: 1, count: dist['1'] || 0, percentage: ((dist['1'] || 0) / summary.totalReviews) * 100 }
    ];

    return distribution;
  });

  ngOnInit() {
    this.loadRatingSummary();
  }

  loadRatingSummary() {
    this.isLoading.set(true);
    this.reviewService.getMovieRating(this.movieId).subscribe({
      next: (summary: RatingSummary) => {
        this.ratingSummary.set(summary);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading rating summary:', error);
        this.isLoading.set(false);
      }
    });
  }

  // Public method to refresh the rating summary
  refresh() {
    this.loadRatingSummary();
  }
}