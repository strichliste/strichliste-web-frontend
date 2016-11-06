/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TallyListComponent } from './tally-list.component';

describe('TallyListComponent', () => {
  let component: TallyListComponent;
  let fixture: ComponentFixture<TallyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TallyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TallyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
