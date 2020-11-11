import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiangvienComponent } from './giangvien.component';

describe('GiangvienComponent', () => {
  let component: GiangvienComponent;
  let fixture: ComponentFixture<GiangvienComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiangvienComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiangvienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
