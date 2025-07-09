import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgGoogleDrive } from './bg-google-drive';

describe('BgGoogleDrive', () => {
  let component: BgGoogleDrive;
  let fixture: ComponentFixture<BgGoogleDrive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BgGoogleDrive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BgGoogleDrive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
