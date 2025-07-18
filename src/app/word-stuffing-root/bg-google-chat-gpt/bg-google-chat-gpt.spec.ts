import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgGoogleChatGpt } from './bg-google-chat-gpt';

describe('BgGoogleChatGpt', () => {
  let component: BgGoogleChatGpt;
  let fixture: ComponentFixture<BgGoogleChatGpt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BgGoogleChatGpt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BgGoogleChatGpt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
