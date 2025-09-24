import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '../services/api';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
userForm:FormGroup;
error = signal({value:false,message:''});

  constructor(private router:Router,private _api:Api,private _fb:FormBuilder){};

  validation(){
    this.userForm = this._fb.group({
      email: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required)
    })
  }

  ngOnInit(){
    this.validation();

    this.userForm.valueChanges.subscribe(val=>{
      this.error.set({value:false,message:''});
    })
  }

  handleSubmit() {
    let value = this.userForm.value;
    this._api.postApi('/signin',value).subscribe((res:any)=>{
      console.log(res);
      if(res && !res.error){
        this.userForm.reset();
        localStorage.setItem('user',JSON.stringify(res.response));
        this.router.navigate(['/dashboard']);
      }
      else{
        this.error.set({value:true,message:res.message})
      }
    })
  }
  
}
