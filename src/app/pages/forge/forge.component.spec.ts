import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgeComponent } from './forge.component';

describe('ForgeComponent', () => {
  let component: ForgeComponent;
  let fixture: ComponentFixture<ForgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
