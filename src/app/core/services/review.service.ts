import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Review, ReviewSubmission, ReviewPage, RatingSummary } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private baseUrl = environment.reviewServiceUrl;

  isLoading = signal(false);
  isSubmitting = signal(false);

  getReviewsForMovie(movieId: number, page: number = 0, size: number = 10): Observable<ReviewPage> {
    this.isLoading.set(true);
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ReviewPage>(`${this.baseUrl}/reviews/movie/${movieId}`, { params }).pipe(
      tap(() => this.isLoading.set(false))
    );
  }

  getMovieRating(movieId: number): Observable<RatingSummary> {
    return this.http.get<RatingSummary>(`${this.baseUrl}/reviews/movie/${movieId}/rating`);
  }

  submitReview(review: ReviewSubmission): Observable<Review> {
    this.isSubmitting.set(true);
    return this.http.post<Review>(`${this.baseUrl}/reviews`, review).pipe(
      tap(() => this.isSubmitting.set(false))
    );
  }
}
