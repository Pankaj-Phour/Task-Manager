import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-task-editor',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './task-editor.html',
  styleUrl: './task-editor.scss'
})
export class TaskEditor {

  taskForm:FormGroup;

  constructor(private _fb:FormBuilder,@Inject(MAT_DIALOG_DATA) public data,public dialogRef:MatDialogRef<TaskEditor>){};

  validation(){
    this.taskForm = this._fb.group({
      project: new FormControl('',Validators.required),
      title: new FormControl('',Validators.required),
      description: new FormControl('',Validators.required),
      status: new FormControl('pending',Validators.required),
      message: new FormControl(''),
    })
  }

  ngOnInit(){
    this.validation();
    console.log(this.data);
    if(!this.data.new){
      this.taskForm.patchValue(this.data.task);
    }
  }

  updateTask(){
    let value = this.taskForm.value;
    console.log(value);
    this.dialogRef.close({update:true,data:value});
  }
}
