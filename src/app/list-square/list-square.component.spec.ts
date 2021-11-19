import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSquareComponent } from './list-square.component';

describe('ListSquareComponent', () => {
  let component: ListSquareComponent;
  let fixture: ComponentFixture<ListSquareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSquareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
