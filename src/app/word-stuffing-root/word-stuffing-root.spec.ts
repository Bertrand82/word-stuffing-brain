import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordStuffingRoot } from './word-stuffing-root';

describe('WordStuffingRoot', () => {
  let component: WordStuffingRoot;
  let fixture: ComponentFixture<WordStuffingRoot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordStuffingRoot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordStuffingRoot);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
