import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReferenciasComponent } from './list-referencias.component';

describe('ListReferenciasComponent', () => {
  let component: ListReferenciasComponent;
  let fixture: ComponentFixture<ListReferenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListReferenciasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListReferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
