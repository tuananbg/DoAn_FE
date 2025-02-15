import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpImgComponent } from './pop-up-img.component';

describe('PopUpImgComponent', () => {
  let component: PopUpImgComponent;
  let fixture: ComponentFixture<PopUpImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpImgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
