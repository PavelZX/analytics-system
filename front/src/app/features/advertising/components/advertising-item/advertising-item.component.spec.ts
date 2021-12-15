import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisingItemComponent } from './advertising-item.component';

describe('AdvertisingItemComponent', () => {
  let component: AdvertisingItemComponent;
  let fixture: ComponentFixture<AdvertisingItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertisingItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertisingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
