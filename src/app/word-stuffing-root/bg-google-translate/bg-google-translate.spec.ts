import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgGoogleTranslate } from './bg-google-translate';

describe('BgGoogleTranslate', () => {
  let component: BgGoogleTranslate;
  let fixture: ComponentFixture<BgGoogleTranslate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BgGoogleTranslate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BgGoogleTranslate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
