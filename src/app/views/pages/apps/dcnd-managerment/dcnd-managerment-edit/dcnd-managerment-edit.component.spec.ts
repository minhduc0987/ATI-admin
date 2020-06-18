import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcndManagermentEditComponent } from './dcnd-managerment-edit.component';

describe('DcndManagermentEditComponent', () => {
  let component: DcndManagermentEditComponent;
  let fixture: ComponentFixture<DcndManagermentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcndManagermentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcndManagermentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
