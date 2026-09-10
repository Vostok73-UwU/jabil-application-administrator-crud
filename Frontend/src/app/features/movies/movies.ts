import { Component, OnInit, signal, ViewChild, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { ApiService } from '../../core/services/api';
import { ToastService } from '../../core/services/toast.service';
import { LoadingService } from '../../core/services/loading.service';
import { Movie, CreateMovieDto, UpdateMovieDto, formatDurationForInput, parseDurationForApi } from '../../core/models/movie.model';
import { Director } from '../../core/models/director.model';
import { JbInputComponent } from '../../shared/components/jb-input/jb-input';
import { JbSelectComponent, JbSelectOption } from '../../shared/components/jb-select/jb-select';
import { JbButtonComponent } from '../../shared/components/jb-button/jb-button';
import { JbSkeletonComponent } from '../../shared/components/jb-skeleton/jb-skeleton';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatIconModule,
    MatProgressSpinnerModule, MatDialogModule, MatPaginatorModule,
    JbInputComponent, JbSelectComponent, JbButtonComponent, JbSkeletonComponent
  ],
  templateUrl: './movies.html',
  styleUrl: './movies.scss'
})
export class Movies implements OnInit, OnDestroy {
  movies = signal<Movie[]>([]);
  allDirectors = signal<Director[]>([]);
  displayedColumns: string[] = ['pkMovies', 'name', 'gender', 'duration', 'director', 'actions'];

  currentMovie: Movie = { name: '', gender: '', duration: '', fkDirector: 0 };
  isEditing = false;
  isSaving = false;
  isTableLoading = signal(false);

  // Pagination
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageIndex = signal(0);
  pageSize = signal(10);
  totalCount = signal(0);
  pageSizeOptions = [5, 10, 25, 50];

  // Director options for jb-select
  directorOptions = signal<JbSelectOption<number>[]>([]);

  private paginatorSub?: Subscription;

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    public loadingService: LoadingService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMovies();
    this.loadDirectors();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginatorSub = this.paginator.page.subscribe((event: PageEvent) => {
        this.pageIndex.set(event.pageIndex);
        this.pageSize.set(event.pageSize);
        this.loadMovies();
      });
    }
  }

  ngOnDestroy(): void {
    this.paginatorSub?.unsubscribe();
  }

  loadMovies(): void {
    this.isTableLoading.set(true);
    this.apiService.getMovies(this.pageIndex() + 1, this.pageSize()).subscribe({
      next: (data) => {
        console.log('Movies API response:', data);
        this.movies.set(data);
        this.totalCount.set(data.length);
        console.log('Movies assigned:', this.movies());
      },
      error: (err) => console.error('Movies load error:', err),
      complete: () => this.isTableLoading.set(false)
    });
  }

  loadDirectors(): void {
    this.apiService.getDirectors().subscribe({
      next: (data) => {
        console.log('Directors API response:', data);
        this.allDirectors.set(data);
        console.log('Directors assigned:', this.allDirectors());
        this.updateDirectorOptions();
      },
      error: (err) => console.error('Directors load error:', err)
    });
  }

  updateDirectorOptions(): void {
    const activeDirectors = this.allDirectors().filter(d => d.active && d.pkDirector != null);
    if (this.isEditing && this.currentMovie.fkDirector) {
      const editingDirector = this.allDirectors().find(d => d.pkDirector === this.currentMovie.fkDirector);
      if (editingDirector && !editingDirector.active && editingDirector.pkDirector != null && !activeDirectors.some(d => d.pkDirector === editingDirector.pkDirector)) {
        this.directorOptions.set([
          ...activeDirectors.map(d => ({ value: d.pkDirector!, label: d.name })),
          { value: editingDirector.pkDirector!, label: editingDirector.name + ' (Inactivo)' }
        ]);
        return;
      }
    }
    this.directorOptions.set(activeDirectors.map(d => ({ value: d.pkDirector!, label: d.name })));
  }

  get directors(): Director[] {
    const activeDirectors = this.allDirectors().filter(d => d.active);
    if (this.isEditing && this.currentMovie.fkDirector) {
      const editingDirector = this.allDirectors().find(d => d.pkDirector === this.currentMovie.fkDirector);
      if (editingDirector && !editingDirector.active && !activeDirectors.some(d => d.pkDirector === editingDirector.pkDirector)) {
        return [...activeDirectors, editingDirector];
      }
    }
    return activeDirectors;
  }

  getDirectorName(id: number): string {
    const dir = this.allDirectors().find(d => d.pkDirector === id);
    return dir ? dir.name : 'Desconocido';
  }

  onDurationInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    // Auto-format: HH:mm:ss
    if (value.length >= 3) {
      value = value.slice(0, 2) + ':' + value.slice(2);
    }
    if (value.length >= 6) {
      value = value.slice(0, 5) + ':' + value.slice(5, 7);
    }
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    
    input.value = value;
    this.currentMovie.duration = parseDurationForApi(value);
  }

  onDurationBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Validate and fix format on blur
    const parsed = parseDurationForApi(input.value);
    if (parsed) {
      input.value = parsed;
      this.currentMovie.duration = parsed;
    } else if (input.value) {
      // Invalid format, clear it
      input.value = '';
      this.currentMovie.duration = '';
    }
  }

  saveMovie(form: NgForm): void {
    if (form.invalid || this.isSaving) return;

    this.isSaving = true;
    const duration = parseDurationForApi(this.currentMovie.duration || '');

    if (this.isEditing && this.currentMovie.pkMovies) {
      const updateDto: UpdateMovieDto = {
        name: this.currentMovie.name,
        gender: this.currentMovie.gender || '',
        duration: duration,
        fkDirector: this.currentMovie.fkDirector
      };

      this.apiService.updateMovie(this.currentMovie.pkMovies, updateDto).subscribe({
        next: () => {
          this.toastService.success('Película actualizada correctamente');
          this.loadMovies();
          this.resetForm();
        },
        error: (err) => {
          const msg = err.error?.message || 'Error al actualizar la película';
          this.toastService.error(msg);
        },
        complete: () => this.isSaving = false
      });
    } else {
      const createDto: CreateMovieDto = {
        name: this.currentMovie.name,
        gender: this.currentMovie.gender || '',
        duration: duration,
        fkDirector: this.currentMovie.fkDirector
      };

      this.apiService.createMovie(createDto).subscribe({
        next: () => {
          this.toastService.success('Película creada correctamente');
          this.loadMovies();
          this.resetForm();
        },
        error: (err) => {
          const msg = err.error?.message || 'Error al crear la película';
          this.toastService.error(msg);
        },
        complete: () => this.isSaving = false
      });
    }
  }

  editMovie(movie: Movie): void {
    this.currentMovie = {
      ...movie,
      duration: formatDurationForInput(movie.duration)
    };
    this.isEditing = true;
    this.updateDirectorOptions();
  }

  deleteMovie(id: number): void {
    const confirmed = confirm('¿Estás seguro de eliminar esta película?');
    if (!confirmed) return;

    this.isSaving = true;
    this.apiService.deleteMovie(id).subscribe({
      next: () => {
        this.toastService.success('Película eliminada correctamente');
        this.loadMovies();
      },
      error: (err) => {
        const msg = err.error?.message || 'Error al eliminar la película';
        this.toastService.error(msg);
      },
      complete: () => this.isSaving = false
    });
  }

  resetForm(form?: NgForm): void {
    this.currentMovie = { name: '', gender: '', duration: '', fkDirector: 0 };
    this.isEditing = false;
    this.isSaving = false;
    this.updateDirectorOptions();
    if (form) {
      form.resetForm({ name: '', gender: '', duration: '', fkDirector: 0 });
    }
  }

  canSave(): boolean {
    return !!this.currentMovie.name && this.currentMovie.fkDirector > 0 && !this.isSaving;
  }
}