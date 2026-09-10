import { Component, OnInit, signal, ViewChild, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { ApiService } from '../../core/services/api';
import { ToastService } from '../../core/services/toast.service';
import { Director } from '../../core/models/director.model';
import { JbInputComponent } from '../../shared/components/jb-input/jb-input';
import { JbButtonComponent } from '../../shared/components/jb-button/jb-button';
import { JbSkeletonComponent } from '../../shared/components/jb-skeleton/jb-skeleton';

@Component({
  selector: 'app-directors',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatIconModule,
    MatCheckboxModule, MatPaginatorModule,
    JbInputComponent, JbButtonComponent, JbSkeletonComponent
  ],
  templateUrl: './directors.html',
  styleUrl: './directors.scss'
})
export class Directors implements OnInit, OnDestroy {
  directors = signal<Director[]>([]);
  displayedColumns: string[] = ['pkDirector', 'name', 'age', 'active', 'actions'];

  currentDirector: Director = { name: '', age: undefined, active: true };
  isEditing = false;
  isSaving = false;
  isTableLoading = signal(false);

  // Pagination
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageIndex = signal(0);
  pageSize = signal(10);
  totalCount = signal(0);
  pageSizeOptions = [5, 10, 25, 50];

  private paginatorSub?: Subscription;

  constructor(
    private apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDirectors();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginatorSub = this.paginator.page.subscribe((event: PageEvent) => {
        this.pageIndex.set(event.pageIndex);
        this.pageSize.set(event.pageSize);
        this.loadDirectors();
      });
    }
  }

  ngOnDestroy(): void {
    this.paginatorSub?.unsubscribe();
  }

  loadDirectors(): void {
    this.isTableLoading.set(true);
    this.apiService.getDirectors(this.pageIndex() + 1, this.pageSize()).subscribe({
      next: (data: Director[]) => {
        this.directors.set(data);
        this.totalCount.set(data.length);
      },
      error: (err) => console.error('Error al cargar directores:', err),
      complete: () => this.isTableLoading.set(false)
    });
  }

  saveDirector(form: NgForm): void {
    if (form.invalid || this.isSaving) return;
    
    this.isSaving = true;

    if (this.isEditing && this.currentDirector.pkDirector) {
      this.apiService.updateDirector(this.currentDirector.pkDirector, this.currentDirector)
        .subscribe({
          next: () => {
            this.toastService.success('Director actualizado correctamente');
            this.loadDirectors();
            this.resetForm();
          },
          complete: () => this.isSaving = false,
          error: (err) => {
            this.isSaving = false;
            const msg = err.error?.message || 'Datos inválidos. Verifique los campos.';
            this.toastService.error(msg);
          }
        });
    } else {
      this.apiService.createDirector(this.currentDirector)
        .subscribe({
          next: () => {
            this.toastService.success('Director registrado correctamente');
            this.loadDirectors();
            this.resetForm();
          },
          complete: () => this.isSaving = false,
          error: (err) => {
            this.isSaving = false;
            const msg = err.error?.message || 'Datos inválidos. Verifique los campos.';
            this.toastService.error(msg);
          }
        });
    }
  }

  editDirector(director: Director): void {
    this.currentDirector = { ...director };
    this.isEditing = true;
  }

  deleteDirector(id: number): void {
    if(confirm('¿Estás seguro de eliminar este director de la base de datos?')) {
      this.isSaving = true;
      this.apiService.deleteDirector(id).subscribe({
        next: () => {
          this.toastService.success('Director eliminado exitosamente');
          this.loadDirectors();
        },
        complete: () => this.isSaving = false,
        error: (err) => {
          this.isSaving = false;
          const errorMessage = err.error?.message || 'Error desconocido al intentar eliminar el director.';
          this.toastService.error(errorMessage);
        }
      });
    }
  }

  resetForm(form?: NgForm): void {
    this.currentDirector = { name: '', age: undefined, active: true };
    this.isEditing = false;
    this.isSaving = false;
    if (form) {
      form.resetForm({ name: '', age: undefined, active: true });
    }
  }

  canSave(): boolean {
    return !!this.currentDirector.name && !this.isSaving;
  }
}