import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListParametrosComponent } from './list-parametros.component';

describe('ListParametrosComponent', () => {
  let component: ListParametrosComponent;
  let fixture: ComponentFixture<ListParametrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListParametrosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListParametrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
