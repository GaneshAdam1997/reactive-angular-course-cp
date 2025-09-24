import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessagesService } from './messages.service';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  standalone: false
})
export class MessagesComponent implements OnInit {

  showMessages: boolean = false;

  errors$: Observable<string[]>;


  constructor(private messageService: MessagesService) {

  }

  ngOnInit() {
    console.log("initalized messages component");
    this.errors$ = this.messageService.errors$.pipe(
      tap(() => {
        console.log("Message Service side effect");
        this.showMessages = true
      })
    )
  }


  onClose() {
    this.showMessages = false;
  }

}
