import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilVoice } from './util-voice';

describe('UtilVoice', () => {
  let component: UtilVoice;
  let fixture: ComponentFixture<UtilVoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilVoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilVoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
