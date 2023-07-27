import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaVantageAPIComponent } from './alpha-vantage-api.component';

describe('AlphaVantageAPIComponent', () => {
  let component: AlphaVantageAPIComponent;
  let fixture: ComponentFixture<AlphaVantageAPIComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlphaVantageAPIComponent]
    });
    fixture = TestBed.createComponent(AlphaVantageAPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
