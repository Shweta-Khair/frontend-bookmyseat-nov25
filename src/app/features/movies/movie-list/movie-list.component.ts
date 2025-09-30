import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../../core/services/movie.service';
import { Movie } from '../../../core/models/movie.model';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MovieCardComponent,
    HlmSpinnerImports,
    HlmLabelImports,
    HlmButtonImports
  ],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css'
})
export class MovieListComponent implements OnInit {
  private movieService = inject(MovieService);

  movies = signal<Movie[]>([]);
  selectedGenre = signal<string>('All');
  selectedLanguage = signal<string>('All');
  isLoading = computed(() => this.movieService.isLoading());

  genres = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Crime'];
  languages = ['All', 'English', 'Hindi', 'Spanish'];

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    const filters: any = {};
    if (this.selectedGenre() !== 'All') {
      filters.genre = this.selectedGenre();
    }
    if (this.selectedLanguage() !== 'All') {
      filters.language = this.selectedLanguage();
    }

    this.movieService.getMovies(filters).subscribe({
      next: (response) => this.movies.set(response.movies),
      error: (error) => console.error('Error loading movies:', error)
    });
  }

  onFilterChange() {
    this.loadMovies();
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}