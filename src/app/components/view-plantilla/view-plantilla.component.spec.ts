import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPlantillaComponent } from './view-plantilla.component';

describe('ViewPlantillaComponent', () => {
  let component: ViewPlantillaComponent;
  let fixture: ComponentFixture<ViewPlantillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPlantillaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPlantillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
