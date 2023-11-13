import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadPlantillaComponent } from './load-plantilla.component';

describe('LoadPlantillaComponent', () => {
  let component: LoadPlantillaComponent;
  let fixture: ComponentFixture<LoadPlantillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadPlantillaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadPlantillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
