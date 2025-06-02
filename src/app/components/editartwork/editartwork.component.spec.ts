import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditartworkComponent } from './editartwork.component';

describe('EditartworkComponent', () => {
  let component: EditartworkComponent;
  let fixture: ComponentFixture<EditartworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditartworkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditartworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
