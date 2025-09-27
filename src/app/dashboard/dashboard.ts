import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditor } from '../task-editor/task-editor';
import { Api } from '../services/api';
import { ProjectEditor } from '../project-editor/project-editor';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,MatTooltipModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  projects:any = signal([]);
  loader = signal(false);

  constructor(private dialog:MatDialog,private _api:Api,private router:Router){}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
     this._api.getApi('/projects').subscribe((res:any)=>{
      console.log(res);
      if(res && !res.error){
        let response = res.response;
        for(let item of response){
          item['pendingCount'] = 0;
          item['completeCount'] = 0;
          item['cancelCount'] = 0;
          for(let task of item.tasks){
            if(task.status == 'pending'){
              item.pendingCount += 1;
            }
            else if(task.status == 'complete'){
              item.completeCount += 1;
            }
            else{
              item.cancelCount += 1;
            }
          }
        }
        this.projects.set(response);
        console.log(this.projects());
        
      }
      
     })
  }

  addNewProject(){
    let dialog = this.dialog.open(ProjectEditor,{
      height:'fit-content',
      maxHeight:'500px',
      width:'90%',
      maxWidth:'450px',
      minWidth:'fit-content',
      disableClose:true
    })
    dialog.afterClosed().subscribe((val:any)=>{
      console.log(val);
      if(val && val.update){
        this.loader.set(true);
        this._api.postApi('/create-project',val.data).subscribe((res:any)=>{
          this.loader.set(false);
          console.log(res);
          if(res && !res.error){
            this.projects.update(state=>{
              let newstate = JSON.parse(JSON.stringify(state));
              newstate.push(res.response);
              return newstate;
            })
          }
        })
      }
    })
  }

  addNewTask(index:number){
    let data = {
      new:true
    }
        let dialog = this.dialog.open(TaskEditor,{
      height:'80%',
      maxHeight:'550px',
      minHeight:'fit-content',
      width:'95%',
      maxWidth:'450px',
      minWidth:'fit-content',
      data:data,
      disableClose:true
    })
    dialog.afterClosed().subscribe((val:any)=>{
      console.log(val);
      if(val && val.update){
        this.loader.set(true);
        let value = val.data;
        value['project'] = this.projects()[index]._id;
        this._api.postApi('/create-task',val.data).subscribe((res:any)=>{
          this.loader.set(false);
          console.log(res);
          if(res && !res.error){
            this.projects.update(state=>{
              let newState = JSON.parse(JSON.stringify(state));
              newState[index].tasks.push(res.response);
              return newState;
            })
          }
        })
      }
    })
  }

  updateTask(task:any,parentIndex:number,index:number){
    let data = {
      task:task
    }
    let dialog = this.dialog.open(TaskEditor,{
      height:'80%',
      maxHeight:'550px',
      minHeight:'fit-content',
      width:'95%',
      maxWidth:'450px',
      minWidth:'fit-content',
      data:data,
      disableClose:true
    })
    dialog.afterClosed().subscribe((val:any)=>{
      console.log(val);
      if(val && val.update){
        let data = val.data;
        data['_id'] = task._id;
        this.loader.set(true);
        this._api.postApi('/update-task',data).subscribe((res:any)=>{
          this.loader.set(false);
          console.log(res);
          if(res && !res.error){
            this.projects.update(state=>{
              let newState = JSON.parse(JSON.stringify(state));
              newState[parentIndex].tasks[index] = res.response;
              return newState;
            })
          }
        })
      }
    })
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login'])
  }
}
