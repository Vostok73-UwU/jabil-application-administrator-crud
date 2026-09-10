import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Director, CreateDirectorDto, UpdateDirectorDto } from '../models/director.model';
import { Movie, CreateMovieDto, UpdateMovieDto } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // ==========================
  // DIRECTORES
  // ==========================
  getDirectors(pageNumber = 1, pageSize = 10, search?: string, activeOnly = false): Observable<Director[]> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (search) params = params.set('search', search);
    if (activeOnly) params = params.set('activeOnly', 'true');
    return this.http.get<Director[]>(`${this.baseUrl}/Directors`, { params });
  }

  getDirector(id: number): Observable<Director> {
    return this.http.get<Director>(`${this.baseUrl}/Directors/${id}`);
  }

  createDirector(dto: CreateDirectorDto): Observable<Director> {
    return this.http.post<Director>(`${this.baseUrl}/Directors`, dto);
  }

  updateDirector(id: number, dto: UpdateDirectorDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/Directors/${id}`, dto);
  }

  deleteDirector(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Directors/${id}`);
  }

  // ==========================
  // PELÍCULAS
  // ==========================
  getMovies(pageNumber = 1, pageSize = 10, search?: string): Observable<Movie[]> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (search) params = params.set('search', search);
    return this.http.get<Movie[]>(`${this.baseUrl}/Movies`, { params });
  }

  getMovie(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.baseUrl}/Movies/${id}`);
  }

  createMovie(dto: CreateMovieDto): Observable<Movie> {
    return this.http.post<Movie>(`${this.baseUrl}/Movies`, dto);
  }

  updateMovie(id: number, dto: UpdateMovieDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/Movies/${id}`, dto);
  }

  deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Movies/${id}`);
  }
}