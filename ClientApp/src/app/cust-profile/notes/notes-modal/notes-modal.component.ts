import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap";
import * as moment from "moment";
import { Note } from "src/app/shared/models/note.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CustomerApiService } from "src/app/core/services/api/customer/customer-api.service";
import { Customer } from "src/app/shared/models/customer.model";
import { CustomerAppointment } from "src/app/shared/models/customerAppointment.model";
import { AppointmentsApiService } from "src/app/core/services/api/appointments/appointments-api.service";
import { ShareCustomerElementService } from 'src/app/shared/share-customer-element-service.service';

@Component({
  selector: "fcw-notes-modal",
  templateUrl: "./notes-modal.component.html",
  styleUrls: ["./notes-modal.component.scss"]
})
export class NotesModalComponent implements OnInit {
  today = new Date();
  modalData: { note: Note; customerData: Customer; viewMode: boolean };
  noteForm: FormGroup;
  newNote: boolean;
  editAppointmentNote: boolean;
  public appointmentData: CustomerAppointment;
  type: string;
  constructor(
    private bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private custApi: CustomerApiService,
    private appointmentsApi: AppointmentsApiService,
    private share: ShareCustomerElementService
  ) {}

  ngOnInit() {
    if (this.type === "edit-appointment-note" ) {
      this.noteForm = this.fb.group({
        employee: [
          this.appointmentData && this.appointmentData.employeeName
            ? this.appointmentData.employeeName
            : "",
          Validators.required
        ],
        date: [
          this.appointmentData && this.appointmentData.appointmentDate
            ? (this.today = moment(this.appointmentData.appointmentDate).toDate())
            : (this.today = new Date())
        ],
        description: [
          this.appointmentData && this.appointmentData.note
            ? this.appointmentData.note
            : "",
          Validators.required
        ]
      });
    } else {
      this.newNote = !(Object.keys(this.modalData.note).length > 0);
      this.noteForm = this.fb.group({
        employee: [
          this.modalData.note && this.modalData.note.employeeDescription
            ? this.modalData.note.employeeDescription
            : "",
          Validators.required
        ],
        date: [
          this.modalData.note && this.modalData.note.date
            ? (this.today = moment(this.modalData.note.date).toDate())
            : (this.today = new Date())
        ],
        description: [
          this.modalData.note && this.modalData.note.description
            ? this.modalData.note.description
            : "",
          Validators.required
        ]
      });
      if (this.modalData.viewMode) {
        this.noteForm.controls.description.disable();
        this.noteForm.controls.employee.disable();
      }
    }
  }

  submitNote() {
    if (this.type === 'edit-appointment-note') {
      this.bsModalRef.hide();
      this.appointmentData.note = this.noteForm.controls.description.value;
      this.appointmentsApi.updateAppointment(this.appointmentData).subscribe(() => this.share.emitReload());
    } else {
      if (this.newNote) {
        const note = {
          customerCode: this.modalData.customerData.id,
          noteCounter: 0,
          date: moment(this.noteForm.controls.date.value).format(
            "YYYY-MM-DD[T]HH:mm:ss"
          ),
          isReserved: false,
          description: this.noteForm.controls.description.value,
          employeeDescription: this.noteForm.controls.employee.value
        };
        this.custApi.newNote(note).subscribe();
        this.bsModalRef.hide();
        this.custApi.reloadNotes();
      } else {
        const note = {
          activityTypeDescription: this.modalData.note.activityTypeDescription,
          employeeDescription: this.noteForm.controls.employee.value,
          documentTypeDescription: this.modalData.note.documentTypeDescription,
          customerCode: this.modalData.note.customerCode,
          noteCounter: this.modalData.note.noteCounter,
          date: this.modalData.note.date,
          isReserved: this.modalData.note.isReserved,
          activityTypeCode: this.modalData.note.activityTypeCode,
          appointmentId: this.modalData.note.appointmentId,
          subject: this.modalData.note.subject,
          description: this.noteForm.controls.description.value,
          employeeCode: this.modalData.note.employeeCode,
          documentTypeCode: this.modalData.note.documentTypeCode,
          documentNumber: this.modalData.note.documentNumber,
          documentDate: this.modalData.note.documentDate,
          rowGuid: this.modalData.note.rowGuid
        };
        this.custApi.editNote(this.modalData.note.rowGuid, note).subscribe();
        this.bsModalRef.hide();
        this.custApi.reloadNotes();
      }
    }
  }

  close() {
    this.bsModalRef.hide();
  }
}
