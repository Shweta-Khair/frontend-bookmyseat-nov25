import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Movie, MovieDetail, MoviesResponse, ShowtimesResponse } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);
  private baseUrl = environment.movieServiceUrl;

  // Signal for loading state
  isLoading = signal(false);

  getMovies(filters?: { genre?: string; language?: string }): Observable<MoviesResponse> {
    this.isLoading.set(true);
    let params = new HttpParams();
    if (filters?.genre) params = params.set('genre', filters.genre);
    if (filters?.language) params = params.set('language', filters.language);

    return this.http.get<MoviesResponse>(`${this.baseUrl}/movies`, { params }).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(error => {
        this.isLoading.set(false);
        throw error;
      })
    );
  }

  getMovieById(id: number): Observable<MovieDetail> {
    this.isLoading.set(true);
    return this.http.get<MovieDetail>(`${this.baseUrl}/movies/${id}`).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(error => {
        this.isLoading.set(false);
        throw error;
      })
    );
  }

  getShowtimes(filters?: { movieId?: number; date?: string; theater?: string }): Observable<ShowtimesResponse> {
    let params = new HttpParams();
    if (filters?.movieId) params = params.set('movieId', filters.movieId.toString());
    if (filters?.date) params = params.set('date', filters.date);
    if (filters?.theater) params = params.set('theater', filters.theater);

    return this.http.get<ShowtimesResponse>(`${this.baseUrl}/showtimes`, { params });
  }
}