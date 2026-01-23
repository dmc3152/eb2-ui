import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignUserDialog } from './autocomplete-dialog';

describe('AssignUserDialog', () => {
  let component: AssignUserDialog;
  let fixture: ComponentFixture<AssignUserDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignUserDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignUserDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
