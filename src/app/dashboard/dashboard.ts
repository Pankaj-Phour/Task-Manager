import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditor } from '../task-editor/task-editor';
import { Api } from '../services/api';
import { ProjectEditor } from '../project-editor/project-editor';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  projects:any = signal([]);
  loader = signal(false);

  constructor(private dialog:MatDialog,private _api:Api){}

  ngOnInit() {
    this.loadProjects();
  }

  private loadProjects() {
      const mockProjects:any = [
        {
          id: '1',
          name: 'Website Redesign',
          description: 'Complete redesign of company website',
          createdAt: (new Date().toDateString()),
          pendingCount:1,
          completeCount:1,
          cancelCount:0,
          tasks: [
            {
              id: '1',
              title: 'Design Homepage',
              description: 'Create new homepage design with modern UI',
              status: 'pending',
              projectId: '1',
              createdAt: new Date().toDateString(),
              updatedAt: new Date().toDateString(),
              screenshots: []
            },
            {
              id: '2',
              title: 'Implement Responsive Design',
              description: 'Make the design responsive for mobile devices',
              status: 'completed',
              projectId: '1',
              createdAt: new Date().toDateString(),
              updatedAt: new Date().toDateString(),
              screenshots: [],
              completionNote: 'Used CSS Grid and Flexbox for responsive layout'
            }
          ]
        },
        {
          id: '2',
          name: 'Mobile App Development',
          description: 'Build cross-platform mobile application',
          createdAt: new Date().toDateString(),
          pendingCount:0,
          completeCount:0,
          cancelCount:1,
          tasks: [
            {
              id: '3',
              title: 'Setup Development Environment',
              description: 'Install and configure React Native development tools',
              status: 'cancelled',
              projectId: '2',
              createdAt: new Date().toDateString(),
              updatedAt: new Date().toDateString(),
              screenshots: [],
              completionNote: 'Decided to go with Flutter instead'
            }
          ]
        }
      ];
      this.projects.set(mockProjects);
    console.log(this.projects());
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
      maxHeight:'500px',
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
      maxHeight:'500px',
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
}
