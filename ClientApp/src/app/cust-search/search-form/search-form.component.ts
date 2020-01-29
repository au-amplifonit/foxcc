import {Component, EventEmitter, OnInit, Output, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, NgControlStatus} from '@angular/forms';
import {CustomerList, CustParam} from '../../shared/models/customer.model';
import {CustomerApiService} from '../../core/services/api/customer/customer-api.service';
import {environment} from '../../../environments/environment';
import {HttpErrorResponse} from '@angular/common/http';
import { switchMap, tap, catchError, take, takeUntil, first } from 'rxjs/operators';
import { Subject, Observable, throwError, of } from 'rxjs';
import { formatDate } from '@angular/common';

@Component({
  selector: 'fcw-search-form',
  template: `
      <div class="p-3">
        <div class="d-flex text-danger mb-3 align-items-center">
          <span class="align-middle">
          <svg-icon class="s" src="../../../../assets/img/svg/search.svg"></svg-icon>
          </span>
            <span class="mx-3"><p class="lead m-0">Search Options</p></span>
          </div>
          <form class="p-2" [formGroup]="custSearchForm" (submit)="onSubmit()">
              <!--<fieldset class="">-->
              <div class="form-group">
              <!-- <label for="name">namvae</label>-->
              <input
                      class="form-control"
                      type="text"
                      formControlName="first_name"
                      id="name"
                      placeholder="Customer first name"
                      [ngClass]="{
                        'has-error': !custSearchForm.controls[
                          'first_name'
                        ].valid
                    }"
              />
            <span class="error-msg-hint" *ngIf="custSearchForm?.errors?.validateSearchForm && custSearchForm?.controls['first_name'].value !== ''">*Insert another field to enable search</span>
          </div>
              <!--    customer name    -->
              <div class="form-group">
                  <!-- <label for="name">name</label>-->
                  <input
                          class="form-control"
                          type="text"
                          formControlName="last_name"
                          id="name"
                          placeholder="Customer last name"
                          [ngClass]="{
                            'has-error': !custSearchForm.controls[
                              'last_name'
                            ].valid || custSearchForm?.errors?.last_name || custSearchForm?.errors?.validateSearchForm
                          }"
                  />
              </div>
              <!--
              -->
              <div class="form-group">
                  <!--<label for="name">code</label>-->
                  <input
                          class="form-control"
                          type="text"
                          formControlName="code"
                          id="code"
                          placeholder="Client code"
                          [ngClass]="{
                            'has-error': custSearchForm?.errors?.validateSearchForm }"
                  />
              </div>
              <div class="form-group">
                  <input
                          class="form-control"
                          type="text"
                          formControlName="hsp"
                          id="hsp"
                          placeholder="HSP Voucher"
                          [ngClass]="{
                            'has-error': custSearchForm?.errors?.validateSearchForm }"
                  />
              </div>
              <div class="form-group">
                  <input
                          maxlength="10"
                          class="form-control"
                          type="text"
                          formControlName="phone"
                          id="phone"
                          placeholder="Customer phone"
                          [ngClass]="{
                            'has-error': custSearchForm?.errors?.validateSearchForm || custSearchForm?.errors?.phone }"
                  />
              </div>
              <div class="form-group">
                  <input
                          class="form-control"
                          type="text"
                          id="dateOfB"
                          placeholder="Customer Birthday (dd-mm-yyyy)"
                          bsDatepicker
                          formControlName="dateOfB"
                          [maxDate]="maxDate"
                          [bsConfig]="{
                            dateInputFormat: 'DD-MM-YYYY',
                            containerClass: 'theme-default'
                          }"
                          placement="right"
                          [ngClass]="{
                            'has-error': custSearchForm?.errors?.validateSearchForm }"
                  />
              </div>
              <div class="form-group">
                  <button class="btn btn-danger btn-block p-2 my-3" type="submit" [disabled]="!custSearchForm.valid">
                      Search
                  </button>
              </div>
          </form>
      </div>
  `,
  styleUrls: ['./search-form.component.scss'],
  providers: [CustomerApiService]
})
export class SearchFormComponent implements OnInit, OnDestroy {
  custSearchForm: FormGroup;
  searchValue$: Subject<any>;
  maxDate: Date = new Date();

  private destroyed$ = new Subject();

  custParam: CustParam;
  @Output() initGet: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clientList: EventEmitter<CustomerList> = new EventEmitter<CustomerList>();
  @Output() errorClientList: EventEmitter<HttpErrorResponse> = new EventEmitter<HttpErrorResponse>();
  @Output() custParamOut: EventEmitter<CustParam> = new EventEmitter<CustParam>();


  constructor(private fb: FormBuilder, private api: CustomerApiService) {
    this.custSearchForm = this.fb.group({
      first_name: ['',  this.nameValidator()],
      last_name: ['', [this.nameValidator()]],
      code: [''],
      hsp: [''],
      phone: [''],
      dateOfB: ['']
    }, { validators: (formGroup: FormGroup) => this.validateSearchForm(formGroup) });

    this.searchValue$ = new Subject();
    this.searchValue$
      .pipe(
        takeUntil(this.destroyed$),
        tap(() => {
          this.initGet.emit(true);
          this.custParam = {
            firstname: this.custSearchForm.controls.first_name.value,
            lastname: this.custSearchForm.controls.last_name.value,
            customerCode: this.custSearchForm.controls.code.value,
            voucherID: this.custSearchForm.controls.hsp.value,
            phoneNumber: this.custSearchForm.controls.phone.value,
            birthdate: this.custSearchForm.controls.dateOfB.value
              ? formatDate(this.custSearchForm.controls.dateOfB.value, 'yyyy-MM-dd', 'en-AU') + 'T00:00:00'
              : '',
            pageNumber: environment.pageNumber,
            pageSize: environment.pageSize,
            pageCount: '',
            pageRequested: '',
            recordCount: '',
            SortAscending: 'true'
          };
        }),
        switchMap(() => this.api
          .search(this.custParam)
          .pipe(
            take(1),
            tap(res => {
              this.initGet.emit(false);
              this.clientList.emit(res);
              this.custParam = {
                ...this.custParam,
                ...{
                  pageCount: res.pageCount.toString(),
                  pageRequested: res.pageRequested.toString(),
                  recordCount: res.recordCount.toString()
                }
              };
              this.custParamOut.emit(this.custParam);
            }),
            catchError(err => {
              this.initGet.emit(false);
              this.errorClientList.emit(err);
              return of(err);
            })
          ))
      )
      .subscribe();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onSubmit() {
    this.searchValue$.next();
  }
  nameValidator(): ValidatorFn {
    const nameRe = /^[A-Za-z\s]+$/;
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.touched) {
        if ( control.value === '' ) {
          return  null;
        } else {
          const valid = nameRe.test(control.value);
          return !valid ? { nameAlpha: { value: control.value } } : null;
        }
      } else {
        return null;
      }
    };
  }

  validateSearchForm(searchForm) {
    const err: any = {};
    const firstName = searchForm.controls['first_name'].value;
    const lastName = searchForm.controls['last_name'].value;
    const code = searchForm.controls['code'].value;
    const hsp = searchForm.controls['hsp'].value;
    const phone = searchForm.controls['phone'].value;
    const dateOfB = searchForm.controls['dateOfB'].value;
    const atLeastOneFieldFill = lastName || code || hsp || phone || dateOfB;

    if (firstName && !atLeastOneFieldFill) {
      err.validateSearchForm = true;
    }


    if (!atLeastOneFieldFill) {
      err.validateSearchForm = true;
    }

    const nameRe = /^[0-9]+$/;
    if (phone) {
      if (phone.length < 10) {
        err.phone = true;
      }
      if (!nameRe.test(phone) ) {
        err.phone = true;
      }
    }

    if (err) {
      return err;
    } else {
      return null;
    }

  }
}

