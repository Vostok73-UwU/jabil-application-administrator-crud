import { Component, input, output, forwardRef, signal, computed, HostBinding, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export type JbInputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

@Component({
  selector: 'jb-input',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatTooltipModule],
  templateUrl: './jb-input.html',
  styleUrl: './jb-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JbInputComponent),
      multi: true
    }
  ]
})
export class JbInputComponent implements ControlValueAccessor {
  // Inputs
  label = input('');
  placeholder = input('');
  type = input<JbInputType>('text');
  required = input(false);
  disabled = model(false);
  readonly = input(false);
  error = input('');
  hint = input('');
  prefixIcon = input('');
  suffixIcon = input('');
  clearable = input(false);
  togglePassword = input(false);
  maxLength = input<number | null>(null);
  counter = input(false);
  appearance = input<'fill' | 'outline'>('outline');
  autocomplete = input('off');
  ariaLabel = input('');
  ariaDescribedBy = input('');

  // Outputs
  valueChange = output<string>();
  blur = output<FocusEvent>();
  focus = output<FocusEvent>();
  clear = output<void>();
  passwordToggle = output<boolean>();

  // Internal state
  protected value = signal('');
  protected focused = signal(false);
  protected showPassword = signal(false);
  protected controlId = `jb-input-${Math.random().toString(36).substr(2, 9)}`;

  // Computed
  protected effectiveType = computed(() => 
    this.type() === 'password' && this.togglePassword() ? (this.showPassword() ? 'text' : 'password') : this.type()
  );
  protected hasValue = computed(() => this.value().length > 0);
  protected showClear = computed(() => 
    this.clearable() && this.hasValue() && !this.disabled() && !this.readonly() && this.focused()
  );
  protected showPasswordToggle = computed(() => 
    this.togglePassword() && this.type() === 'password' && !this.disabled() && !this.readonly()
  );
  protected counterText = computed(() => {
    if (!this.counter() || this.maxLength() === null) return '';
    return `${this.value().length}/${this.maxLength()}`;
  });

  // CVA
  private onChange = (value: string) => {};
  private onTouched = () => {};

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // Events
  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;
    this.value.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }

  protected onBlur(event: FocusEvent): void {
    this.focused.set(false);
    this.onTouched();
    this.blur.emit(event);
  }

  protected onFocus(event: FocusEvent): void {
    this.focused.set(true);
    this.focus.emit(event);
  }

  protected onClear(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.value.set('');
    this.onChange('');
    this.valueChange.emit('');
    this.clear.emit();
  }

  protected onPasswordToggle(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.showPassword.update(v => !v);
    this.passwordToggle.emit(this.showPassword());
  }

  @HostBinding('class.jb-input') readonly hostClass = true;
  @HostBinding('class.jb-input--has-error') get hasError() { return !!this.error(); }
  @HostBinding('class.jb-input--disabled') get isDisabled() { return this.disabled(); }
  @HostBinding('class.jb-input--focused') get isFocused() { return this.focused(); }
}