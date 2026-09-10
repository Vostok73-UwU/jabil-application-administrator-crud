import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Directors } from './directors';

describe('Directors', () => {
  let component: Directors;
  let fixture: ComponentFixture<Directors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Directors],
    }).compileComponents();

    fixture = TestBed.createComponent(Directors);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
