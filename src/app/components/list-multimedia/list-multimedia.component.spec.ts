import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMultimediaComponent } from './list-multimedia.component';

describe('ListMultimediaComponent', () => {
  let component: ListMultimediaComponent;
  let fixture: ComponentFixture<ListMultimediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMultimediaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMultimediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
