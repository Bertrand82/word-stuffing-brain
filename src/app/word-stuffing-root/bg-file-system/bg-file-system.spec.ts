import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgFileSystem } from './bg-file-system';

describe('BgFileSystem', () => {
  let component: BgFileSystem;
  let fixture: ComponentFixture<BgFileSystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BgFileSystem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BgFileSystem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
