import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarFormComponent } from './toolbar-form.component';

describe('ToolbarFormComponent', () => {
  let component: ToolbarFormComponent;
  let fixture: ComponentFixture<ToolbarFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
