import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export type JbButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type JbButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'jb-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './jb-button.html',
  styleUrl: './jb-button.scss',
  host: {
    // Esto hace que la etiqueta <jb-button> sea "invisible" para el CSS
    // y permita que tu botón interior tome el control total.
    'style': 'display: contents;' 
  }
})
export class JbButtonComponent {
  variant = input<JbButtonVariant>('primary');
  size = input<JbButtonSize>('md');
  loading = input(false);
  disabled = input(false);
  fullWidth = input(false);
  iconStart = input<string>('');
  iconEnd = input<string>('');
  type = input<'button' | 'submit' | 'reset'>('button');
  ariaLabel = input('');

  clicked = output<MouseEvent>();

  onClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}