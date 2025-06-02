import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddartworkComponent } from './addartwork.component';

describe('AddartworkComponent', () => {
  let component: AddartworkComponent;
  let fixture: ComponentFixture<AddartworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddartworkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddartworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
