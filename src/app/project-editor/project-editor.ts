import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-project-editor',
  imports: [FormsModule,ReactiveFormsModule,CommonModule,],
  templateUrl: './project-editor.html',
  styleUrl: './project-editor.scss'
})
export class ProjectEditor {
projectForm:FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data,private _fb:FormBuilder,public dialogRef:MatDialogRef<ProjectEditor>){};

  validation(){
    this.projectForm = this._fb.group({
      title: new FormControl('',Validators.required),
      description: new FormControl('',Validators.required),
    })
  }

  ngOnInit(){
    this.validation();
    console.log(this.data);
  }

  submit(){
    let value = this.projectForm.value;
    console.log(value)
    this.dialogRef.close({update:true,data:value})
  }
}
