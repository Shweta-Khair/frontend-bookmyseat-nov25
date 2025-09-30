export interface Review {
  id: number;
  movieId: number;
  movieTitle?: string;
  userName: string;
  rating: number;
  comment: string;
  reviewDate: string;
}

export interface ReviewSubmission {
  movieId: number;
  userName: string;
  rating: number;
  comment: string;
}

export interface ReviewPage {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  page: number;
  totalPages: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface RatingSummary {
  movieId: number;
  movieTitle: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: string]: number };
}