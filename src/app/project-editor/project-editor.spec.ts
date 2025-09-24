import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEditor } from './project-editor';

describe('ProjectEditor', () => {
  let component: ProjectEditor;
  let fixture: ComponentFixture<ProjectEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
