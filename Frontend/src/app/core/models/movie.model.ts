import { Director } from './director.model';

export interface Movie {
  pkMovies?: number;
  name: string;
  gender?: string;
  duration?: string;
  fkDirector: number;
  directorName?: string;
}

export interface CreateMovieDto {
  name: string;
  gender?: string;
  duration?: string;
  fkDirector: number;
}

export interface UpdateMovieDto {
  name: string;
  gender?: string;
  duration?: string;
  fkDirector: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export function formatDurationForInput(duration?: string): string {
  if (!duration) return '';
  const parts = duration.split(':');
  if (parts.length === 3) {
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:${parts[2].padStart(2, '0')}`;
  }
  return duration;
}

export function parseDurationForApi(duration: string): string | undefined {
  if (!duration.trim()) return undefined;
  const timeRegex = /^(\d{1,2}):(\d{2}):(\d{2})$/;
  const match = duration.match(timeRegex);
  if (match) {
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = parseInt(match[3], 10);
    if (hours >= 0 && minutes >= 0 && minutes < 60 && seconds >= 0 && seconds < 60) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }
  return duration;
}