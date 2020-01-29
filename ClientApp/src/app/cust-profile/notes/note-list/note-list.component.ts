import { Component, OnInit, Input } from '@angular/core';
import { Note } from 'src/app/shared/models/note.model';

@Component({
  selector: 'fcw-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit {
  @Input() notes: Array<Note>;

  constructor() { }

  ngOnInit() {
  }

}
