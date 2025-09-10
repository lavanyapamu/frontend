import { ComponentFixture, TestBed } from '@angular/core/testing';

import { buyerOrdersComponent } from './orders.component';

describe('OrdersComponent', () => {
  let component: buyerOrdersComponent;
  let fixture: ComponentFixture<buyerOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [buyerOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(buyerOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
