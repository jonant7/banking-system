import {ContentChild, Directive, Input, TemplateRef} from '@angular/core';

@Directive({
  selector: '[appCellDef]',
  standalone: true,
})
export class CellDefDirective<T = any> {
  constructor(public template: TemplateRef<CellContext<T>>) {
  }

  static ngTemplateContextGuard<T>(
    dir: CellDefDirective<T>,
    ctx: unknown
  ): ctx is CellContext<T> {
    return true;
  }
}

@Directive({
  selector: '[appHeaderCellDef]',
  standalone: true,
})
export class HeaderCellDefDirective {
  constructor(public template: TemplateRef<HeaderCellContext>) {
  }
}

@Directive({
  selector: '[appActionCellDef]',
  standalone: true,
})
export class ActionCellDefDirective<T = any> {
  constructor(public template: TemplateRef<ActionCellContext<T>>) {
  }

  static ngTemplateContextGuard<T>(
    dir: ActionCellDefDirective<T>,
    ctx: unknown
  ): ctx is ActionCellContext<T> {
    return true;
  }
}

@Directive({
  selector: '[appColumnDef]',
  standalone: true,
})
export class ColumnDefDirective<T = any> {
  @Input({required: true, alias: 'appColumnDef'}) name!: string;
  @Input() sortable = false;
  @Input() width?: string;
  @Input() align?: 'left' | 'center' | 'right';
  @Input() headerClass?: string;
  @Input() cellClass?: string | ((row: T) => string);

  @ContentChild(HeaderCellDefDirective, {read: TemplateRef})
  headerTemplate?: TemplateRef<HeaderCellContext>;

  @ContentChild(CellDefDirective, {read: TemplateRef})
  cellTemplate?: TemplateRef<CellContext<T>>;

  @ContentChild(ActionCellDefDirective, {read: TemplateRef})
  actionTemplate?: TemplateRef<ActionCellContext<T>>;
}

@Directive({
  selector: '[appRowDef]',
  standalone: true,
})
export class RowDefDirective<T = any> {
  @Input({required: true, alias: 'appRowDefColumns'}) columns!: string[];
  @Input() when?: (index: number, row: T) => boolean;

  constructor(public template: TemplateRef<RowContext<T>>) {
  }

  static ngTemplateContextGuard<T>(
    dir: RowDefDirective<T>,
    ctx: unknown
  ): ctx is RowContext<T> {
    return true;
  }
}

@Directive({
  selector: '[appHeaderRowDef]',
  standalone: true,
})
export class HeaderRowDefDirective {
  @Input({required: true, alias: 'appHeaderRowDef'}) columns!: string[];

  constructor(public template: TemplateRef<void>) {
  }
}

export interface CellContext<T> {
  $implicit: T;
  value: any;
  index: number;
  column: string;
}

export interface HeaderCellContext {
  column: string;
}

export interface ActionCellContext<T> {
  $implicit: T;
  index: number;
}

export interface RowContext<T> {
  $implicit: T;
  index: number;
}
