import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyartworksComponent } from './myartworks.component';

describe('MyartworksComponent', () => {
  let component: MyartworksComponent;
  let fixture: ComponentFixture<MyartworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyartworksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyartworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
