import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgConfigLangage } from './bg-config-langage';

describe('BgConfigLangage', () => {
  let component: BgConfigLangage;
  let fixture: ComponentFixture<BgConfigLangage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BgConfigLangage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BgConfigLangage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
