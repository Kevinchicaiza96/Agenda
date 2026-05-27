import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDialog } from './search-dialog';

describe('SearchDialog', () => {
  let component: SearchDialog;
  let fixture: ComponentFixture<SearchDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
