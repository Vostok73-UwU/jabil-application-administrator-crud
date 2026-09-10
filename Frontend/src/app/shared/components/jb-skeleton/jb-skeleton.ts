import { Component, input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'table-row';

@Component({
  selector: 'jb-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jb-skeleton.html',
  styleUrl: './jb-skeleton.scss'
})
export class JbSkeletonComponent {
  variant = input<SkeletonVariant>('text');
  width = input<string>('100%');
  height = input<string>('1rem');
  count = input(1);
  animation = input<'pulse' | 'wave' | 'none'>('pulse');

  protected get items(): number[] {
    return Array.from({ length: this.count() }, (_, i) => i);
  }

  @HostBinding('class.jb-skeleton') readonly hostClass = true;
  @HostBinding('class.jb-skeleton--text') get isText() { return this.variant() === 'text'; }
  @HostBinding('class.jb-skeleton--circular') get isCircular() { return this.variant() === 'circular'; }
  @HostBinding('class.jb-skeleton--rectangular') get isRectangular() { return this.variant() === 'rectangular'; }
  @HostBinding('class.jb-skeleton--table-row') get isTableRow() { return this.variant() === 'table-row'; }
  @HostBinding('class.jb-skeleton--pulse') get isPulse() { return this.animation() === 'pulse'; }
  @HostBinding('class.jb-skeleton--wave') get isWave() { return this.animation() === 'wave'; }
}