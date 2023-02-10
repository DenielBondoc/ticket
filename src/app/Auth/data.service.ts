import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Tickets } from '../models/tickets'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private afs: AngularFirestore) { }

  addTickets(tickets: Tickets){
    tickets.id = this.afs.createId();
    return this.afs.collection('/Ticket').add(tickets);
  }

  getAllTickets() {
    return this.afs.collection('/Ticket').snapshotChanges();
  }

  deleteTicket(tickets: Tickets){
    return this.afs.doc('/Ticket/'+tickets.id).delete();
  }

  updateTicket(tickets: Tickets){
    this.deleteTicket(tickets);
    this.addTickets(tickets);
  }
}
