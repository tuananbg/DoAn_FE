import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailQualificationManagerComponent } from './detail-qualification-manager.component';

describe('DetailQualificationManagerComponent', () => {
  let component: DetailQualificationManagerComponent;
  let fixture: ComponentFixture<DetailQualificationManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailQualificationManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailQualificationManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
