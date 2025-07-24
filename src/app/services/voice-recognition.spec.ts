import { TestBed } from '@angular/core/testing';

import { VoiceRecognition } from './voice-recognition';

describe('VoiceRecognition', () => {
  let service: VoiceRecognition;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoiceRecognition);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
