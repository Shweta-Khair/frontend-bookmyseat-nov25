import { Component, OnInit, signal, computed, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieService } from '../../../core/services/movie.service';
import { ReviewService } from '../../../core/services/review.service';
import { MovieDetail } from '../../../core/models/movie.model';
import { RatingSummary } from '../../../core/models/review.model';
import { DurationPipe } from '../../../shared/pipes/duration.pipe';
import { RatingSummaryComponent } from '../../reviews/rating-summary/rating-summary.component';
import { ReviewListComponent } from '../../reviews/review-list/review-list.component';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DurationPipe,
    RatingSummaryComponent,
    ReviewListComponent,
    HlmCardImports,
    HlmButtonImports,
    HlmSpinnerImports
  ],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css'
})
export class MovieDetailComponent implements OnInit {
  @ViewChild('ratingSummary') ratingSummaryComponent?: RatingSummaryComponent;

  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  private reviewService = inject(ReviewService);

  movie = signal<MovieDetail | null>(null);
  isLoading = computed(() => this.movieService.isLoading());
  movieId = signal<number>(0);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.movieId.set(id);
    this.loadMovie(id);
  }

  loadMovie(id: number) {
    this.movieService.getMovieById(id).subscribe({
      next: (movie) => this.movie.set(movie),
      error: (error) => console.error('Error loading movie:', error)
    });
  }

  onReviewSubmitted() {
    // Refresh the rating summary when a new review is submitted
    this.ratingSummaryComponent?.refresh();
  }
}