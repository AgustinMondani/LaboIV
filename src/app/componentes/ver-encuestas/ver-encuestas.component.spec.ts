import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerEncuestasComponent } from './ver-encuestas.component';

describe('VerEncuestasComponent', () => {
  let component: VerEncuestasComponent;
  let fixture: ComponentFixture<VerEncuestasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerEncuestasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerEncuestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
