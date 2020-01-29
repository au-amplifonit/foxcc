import { Component, OnInit, Input } from '@angular/core';
import { Note } from 'src/app/shared/models/note.model';
import { ButtonMenuItemsList } from 'src/app/shared/models/utility/button-menu-items-list';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { NotesModalComponent } from '../notes-modal/notes-modal.component';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'fcw-note-list-item',
  templateUrl: './note-list-item.component.html',
  styleUrls: ['./note-list-item.component.scss'],
  animations: [
    trigger('showNote', [
      state('show', style({
        height: '*'
      })),
      state('hide', style({
        opacity: 0,
        height: '0px'
      })),
      transition('show => hide', animate('150ms ease-out')),
      transition('hide => show', animate('225ms ease-in'))
    ]
    )
  ]
})
export class NoteListItemComponent implements OnInit {
  @Input() note: Note;
  @Input() hasElipsis: boolean;
  @Input() clientActions: ButtonMenuItemsList[];
  menuItems = [];
  timeout;
  prevent = false;
  selectedNote: boolean;
  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService) {}

  ngOnInit() {
    this.selectedNote = false;
    this.setEllipsisItem();
  }

  doAction(event) {
    if (event === 'edit-event') {
      this.openTheModal();
    } else if (event === 'view-event') {
      this.openTheModal(event);
    }
  }

  setEllipsisItem() {
    this.menuItems.push(
      {
        id: 'view-event',
        url: 'null',
        icon: '../../../../assets/img/svg/clipboard_2.svg',
        text: 'View',
        eventName: 'view-event'
      },
      {
        id: 'edit-event',
        url: 'null',
        icon: '../../../../assets/img/svg/create_2.svg',
        text: 'Edit',
        eventName: 'edit-event'
      }
    );
  }

  dblClickAction() {
    clearTimeout(this.timeout);
    this.prevent = true;
  }

  openTheModal(event = null) {
    this.bsModalRef = this.modalService.show(NotesModalComponent, {
      class: 'modal-dialog modal-dialog-centered modal-lg',
      initialState: {
        modalData: {
          note: { ...this.note },
          customerData: null,
          viewMode: event === 'view-event' ? true : false
        }
      }
    });
  }

  showNoteItem() {
    this.selectedNote = !this.selectedNote;
    this.clearSelection();
  }

  clearSelection() {
    if (window.getSelection()) {
      const sel = window.getSelection();
      sel.removeAllRanges();
    }
  }

  get stateName() {
    return this.selectedNote ? 'show' : 'hide';
  }
}
