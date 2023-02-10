import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Auth/auth.service';
import { DataService } from 'src/app/Auth/data.service';
import { Tickets } from 'src/app/models/tickets';
import { ID } from 'src/app/models/id'
import { of } from 'rxjs';
import { tick } from '@angular/core/testing';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Stats } from 'src/app/models/food';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  ticketList: Tickets[] = [];
  ticketObj : Tickets = {
    id: '',
    owner_name: '',
    description: '',
    status: ''
  };
  id: string = '';
  owner_name: string = '';
  description: string = '';
  status: string = '';
  dodo = this.id;
  
  stats: Stats[] = [
    {value: 'To do', viewValue: 'To do (If new ticket)'},
    {value: 'In Progress', viewValue: 'In Progress'},
    {value: 'Ready for deployment', viewValue: 'Ready for deployment'},
  ];

  pickMe: ID[] = [];
  task: ID[] = [];
  inProg: ID[] = [];
  done: ID[] = [];
  
  todoForm !: FormGroup;
  constructor(private auth: AuthService, private data : DataService, private fb: FormBuilder) { }

  ngOnInit() {
    this.getAllTickets();
    this.todoForm = this.fb.group({
      item : ['', Validators.required]
    });
  }

  register(){
    this.auth.logout();
  }

  getAllTickets(){
    this.data.getAllTickets().subscribe({
        next: res => {
        this.ticketList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        })
      },
      error: err => {
        alert('Error while fetching');
      }
    })
  }

  resetTicket(){
   this.id = '';
   this.owner_name = '';
   this.description = '';
   this.status = '';
  }

  addTicket(){
    if(this.owner_name == '' || this.description == '' || this.status == ''){
      alert('Input fields are empty');
      return;
    }

    this.ticketObj.id = '';
    this.ticketObj.owner_name = this.owner_name;
    this.ticketObj.description = this.description;
    this.ticketObj.status = this.status;

    this.data.addTickets(this.ticketObj);
    this.resetTicket();
  }

  deleteTicket(tickets : Tickets){
    if(window.confirm('Are you sure you want to delete ' + tickets.id + ' ' + tickets.owner_name))
    this.data.deleteTicket(tickets)
  }
  
  addTask(){
    this.pickMe.push({
      id:this.todoForm.value.item,
    });
    
  }


  deleteTickets(i: number){
    this.task.splice(i,1)
    this.inProg.splice(i,1)
    this.done.splice(i,1)
  }

  drop(event: CdkDragDrop<ID[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  saveTicket(){
    const value = this.todoForm.value.item;
    localStorage.setItem('description', value)
  }
}
