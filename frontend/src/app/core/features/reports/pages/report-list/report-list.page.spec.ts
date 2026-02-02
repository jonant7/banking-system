import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportListPage} from './report-list.page';

describe('ReportListPage', () => {
  let component: ReportListPage;
  let fixture: ComponentFixture<ReportListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportListPage]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReportListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
