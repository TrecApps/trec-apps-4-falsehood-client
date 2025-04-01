import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactcheckSearchComponent } from './factcheck-search.component';

describe('FactcheckSearchComponent', () => {
  let component: FactcheckSearchComponent;
  let fixture: ComponentFixture<FactcheckSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactcheckSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactcheckSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
