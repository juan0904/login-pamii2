import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBrandProvidersComponent } from './list-brand-providers.component';

describe('ListBrandProvidersComponent', () => {
  let component: ListBrandProvidersComponent;
  let fixture: ComponentFixture<ListBrandProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBrandProvidersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListBrandProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
