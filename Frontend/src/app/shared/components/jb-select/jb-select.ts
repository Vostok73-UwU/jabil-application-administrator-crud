import { Component, input, output, forwardRef, signal, computed, HostBinding, model, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

export interface JbSelectOption<T = unknown> {
  value: T;
  label: string;
  disabled?: boolean;
  group?: string;
}

@Component({
  selector: 'jb-select',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatIconModule],
  templateUrl: './jb-select.html',
  styleUrl: './jb-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JbSelectComponent),
      multi: true
    }
  ]
})
export class JbSelectComponent<T = unknown> implements ControlValueAccessor, OnDestroy {
  // Inputs
  label = input('');
  placeholder = input('Seleccione una opción');
  required = input(false);
  disabled = model(false);
  readonly = input(false);
  error = input('');
  hint = input('');
  prefixIcon = input('');
  options = input<JbSelectOption<T>[]>([]);
  multiple = input(false);
  searchable = input(false);
  searchDebounce = input(300); // ms
  appearance = input<'fill' | 'outline'>('outline');
  compareWith = input<(a: T, b: T) => boolean>((a, b) => a === b);
  ariaLabel = input('');
  ariaDescribedBy = input('');

  // Outputs
  valueChange = output<T | T[]>();
  selectionChange = output<T | T[]>();
  openedChange = output<boolean>();
  blur = output<FocusEvent>();
  focus = output<FocusEvent>();

  // Internal state
  protected value = signal<T | T[] | null>(null);
  protected focused = signal(false);
  protected panelOpen = signal(false);
  protected controlId = `jb-select-${Math.random().toString(36).substr(2, 9)}`;

  // Search with debounce
  protected searchQuery = signal('');
  protected searchQueryRaw = signal('');
  private searchDebounceTimer?: ReturnType<typeof setTimeout>;

  // Computed
  protected isMultiple = computed(() => this.multiple());
  protected hasValue = computed(() => this.value() !== null && this.value() !== undefined);
  protected displayValue = computed(() => {
    const val = this.value();
    if (val === null || val === undefined) return '';
    
    if (this.isMultiple()) {
      const arr = Array.isArray(val) ? val : [val];
      return arr.map(v => this.getOptionLabel(v)).filter(Boolean).join(', ');
    }
    
    return this.getOptionLabel(val as T);
  });

  // Computed helpers
  protected hasGroups = computed(() => 
    this.options().some(opt => opt.group !== undefined)
  );

  protected groupedOptions = computed(() => {
    const groups = new Map<string, JbSelectOption<T>[]>();
    const ungrouped: JbSelectOption<T>[] = [];
    
    for (const opt of this.options()) {
      if (opt.group) {
        const existing = groups.get(opt.group) ?? [];
        existing.push(opt);
        groups.set(opt.group, existing);
      } else {
        ungrouped.push(opt);
      }
    }
    
    const result: { name: string; options: JbSelectOption<T>[] }[] = [];
    
    if (ungrouped.length > 0) {
      result.push({ name: '', options: ungrouped });
    }
    
    for (const [name, options] of groups.entries()) {
      result.push({ name, options });
    }
    
    return result;
  });

  protected filteredOptions = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.options();
    
    return this.options().filter(opt => 
      opt.label.toLowerCase().includes(query)
    );
  });

  constructor() {
    // Debounce effect for search
    effect(() => {
      const raw = this.searchQueryRaw();
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }
      this.searchDebounceTimer = setTimeout(() => {
        this.searchQuery.set(raw);
      }, this.searchDebounce());
    });
  }

  ngOnDestroy(): void {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
  }

  protected onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQueryRaw.set(target.value);
    event.stopPropagation();
  }

  // CVA
  private onChange = (value: T | T[] | null) => {};
  private onTouched = () => {};

  writeValue(value: T | T[] | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: T | T[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // Events
  protected onSelectionChange(event: { value: T | T[] }): void {
    const newValue = event.value;
    this.value.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue as T | T[]);
    this.selectionChange.emit(newValue as T | T[]);
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

  protected onOpenedChange(open: boolean): void {
    this.panelOpen.set(open);
    this.openedChange.emit(open);
  }

  protected getOptionLabel(optionValue: T): string {
    const opt = this.options().find(o => this.compareWith()(o.value, optionValue));
    return opt?.label ?? String(optionValue);
  }

  protected getOptionGroup(optionValue: T): string | undefined {
    const opt = this.options().find(o => this.compareWith()(o.value, optionValue));
    return opt?.group;
  }

  @HostBinding('class.jb-select') readonly hostClass = true;
  @HostBinding('class.jb-select--has-error') get hasError() { return !!this.error(); }
  @HostBinding('class.jb-select--disabled') get isDisabled() { return this.disabled(); }
  @HostBinding('class.jb-select--focused') get isFocused() { return this.focused(); }
  @HostBinding('class.jb-select--multiple') get isMultipleHost() { return this.isMultiple(); }
}