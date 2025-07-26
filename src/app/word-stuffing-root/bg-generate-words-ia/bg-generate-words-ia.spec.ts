import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgGenerateWordsIA } from './bg-generate-words-ia';

describe('BgGenerateWordsIA', () => {
  let component: BgGenerateWordsIA;
  let fixture: ComponentFixture<BgGenerateWordsIA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BgGenerateWordsIA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BgGenerateWordsIA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
