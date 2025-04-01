import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FalsehoodSubmitComponent } from './falsehood-submit.component';

describe('FalsehoodSubmitComponent', () => {
  let component: FalsehoodSubmitComponent;
  let fixture: ComponentFixture<FalsehoodSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FalsehoodSubmitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FalsehoodSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
