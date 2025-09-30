export interface Movie {
  id: number;
  title: string;
  description: string;
  durationMinutes: number;
  genre: string;
  language: string;
  releaseDate: string;
}

export interface MovieDetail extends Movie {
  showtimes: Showtime[];
}

export interface MoviesResponse {
  movies: Movie[];
}

export interface Showtime {
  id: number;
  movieId: number;
  movieTitle?: string;
  showDateTime: string;
  theater: string;
  availableSeats: number;
}

export interface ShowtimesResponse {
  showtimes: Showtime[];
}