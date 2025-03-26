import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFalsehoodComponent } from './search-falsehood.component';

describe('SearchFalsehoodComponent', () => {
  let component: SearchFalsehoodComponent;
  let fixture: ComponentFixture<SearchFalsehoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFalsehoodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFalsehoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
