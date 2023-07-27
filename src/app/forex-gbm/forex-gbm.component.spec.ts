import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForexGBMComponent } from './forex-gbm.component';

describe('ForexGBMComponent', () => {
  let component: ForexGBMComponent;
  let fixture: ComponentFixture<ForexGBMComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForexGBMComponent]
    });
    fixture = TestBed.createComponent(ForexGBMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
