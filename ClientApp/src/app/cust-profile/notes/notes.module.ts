import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NotesRoutingModule} from './notes-routing.module';
import {NotesComponent} from './notes.component';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import { NoteListComponent } from './note-list/note-list.component';
import { NoteListItemComponent } from './note-list-item/note-list-item.component';
import { FiltersComponent } from './filters/filters.component';


@NgModule({
  declarations: [NotesComponent, NoteListComponent, NoteListItemComponent, FiltersComponent],
  imports: [
    CommonModule,
    SharedModule,
    NotesRoutingModule
  ],
  entryComponents: [NotesComponent]
})
export class NotesModule { }
