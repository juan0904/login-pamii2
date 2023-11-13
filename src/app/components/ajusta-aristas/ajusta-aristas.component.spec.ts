import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjustaAristasComponent } from './ajusta-aristas.component';

describe('AjustaAristasComponent', () => {
  let component: AjustaAristasComponent;
  let fixture: ComponentFixture<AjustaAristasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjustaAristasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjustaAristasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
