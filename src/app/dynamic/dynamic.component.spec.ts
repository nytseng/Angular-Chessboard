import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    MoveChange,
    NgxChessBoardComponent,
    PieceIconInput
} from 'ngx-chess-board';
import {
    ColorInput,
    PieceTypeInput
} from 'ngx-chess-board/src/lib/utils/inputs/piece-type-input';

import { DynamicComponent } from './dynamic.component';

describe('DynamicComponent', () => {
  let component: DynamicComponent;
  let fixture: ComponentFixture<DynamicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
