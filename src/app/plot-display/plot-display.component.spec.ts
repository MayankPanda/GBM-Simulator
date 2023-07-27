import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotDisplayComponent } from './plot-display.component';

describe('PlotDisplayComponent', () => {
  let component: PlotDisplayComponent;
  let fixture: ComponentFixture<PlotDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlotDisplayComponent]
    });
    fixture = TestBed.createComponent(PlotDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
