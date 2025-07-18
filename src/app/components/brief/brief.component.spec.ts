import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BriefComponent } from './brief.component';

describe('BriefComponent', () => {
  let component: BriefComponent;
  let fixture: ComponentFixture<BriefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BriefComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BriefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
