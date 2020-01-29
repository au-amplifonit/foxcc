import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'fcw-kitchensink',
  template: `
      <p>
          kitchensink works!
      </p>
      <hr>

      <button class="btn btn-lg btn-primary ">confirm</button>
      <button class="btn btn-lg btn-outline-secondary ">cancel</button>

      <hr>


      <fcw-card class="m-3 p-3">
          <h1 head>Identity</h1>

          <div body>

              <span class="d-flex flex-row justify-content-between">
                  <span class="flex-column p-3">
                      <label for="firstName">first name</label>
                      <p class="lead" id="firstName">{{testDataCardCustomer?.firstname}}</p>
                  </span>
                  <span class="flex-column p-3">
                      <label for="lastName">last name name</label>
                      <p class="lead" id="lastName">{{testDataCardCustomer?.lastname}}</p>
                  </span>
              </span>

              <span class="flex-row">
                  <form class="form-group" [formGroup]="testDataCardCustomerForm">
                      <fieldset class="form-group">
                          <label for="birthdate">Birth date ( {{testDataCardCustomer.age}} years old)</label>
                          <input
                                  class="form-control"
                                  type="date"
                                  id="birthdate"
                                  formControlName="birthdate"
                                  placeholder="01/07/77"
                                  [value]="testDataCardCustomer.birthday|date: 'DD-MM-YYYY'"
                          >
                      </fieldset>
                      <fieldset class="form-group">
                          <label for="gender">
                              Gender
                          </label>
                          <input id="gender"
                                 class="form-control"
                                 type="text"
                                 formControlName="gender"
                                 placeholder="gender"
                                 [value]="testDataCardCustomer.genderDescription"
                          >
                      </fieldset>
                      <fieldset class="form-group">
                          <label for="salutation">
                              Salutation
                          </label>
                          <input id="salutation"
                                 class="form-control"
                                 type="text"
                                 formControlName="salutation"
                                 placeholder="salutation"
                                 [value]="testDataCardCustomer.salutationDescription"
                          >
                      </fieldset>
                      <fieldset>
                          <label for="languageDescription">
                              Language
                          </label>
                          <input id="languageDescription"
                                 class="form-control"
                                 type="text"
                                 formControlName="languageDescription"
                                 placeholder="languageDescription"
                                 [value]="testDataCardCustomer.languageDescription"
                          >
                      </fieldset>
                  </form>
              </span>
          </div>
      </fcw-card>

      <p body>{{testDataCardCustomer|json}}</p>
      <hr>

      <fcw-card>
          <p head>pippo</p>
          <p body>pippo</p>
      </fcw-card>

      <hr>
      <hr>
      <hr>

  `,
  styleUrls: ['./kitchensink.component.scss']
})
export class KitchensinkComponent implements OnInit {

  testDataCardCustomer: any = {
    id: 'VL1P5KX',
    firstname: 'Janet',
    lastname: 'Huges',
    birthday: '1923-09-18T07:35:12.672Z',
    fundingType: 'OHS',
    statusCode: '00',
    lastHAItemHistory: [],
    practiceName: null,
    practitionerNumber: null,
    practitionerName: null,
    middleName: null,
    otherContact_Firstname: null,
    otherContact_Lastname: null,
    relation: null,
    genderCode: null,
    birthPlace: null,
    tax_ID_Number: null,
    titleCode: null,
    salutationCode: '003',
    allowPrivacy: false,
    allowSensData: true,
    allowAdvertising: false,
    allowProfiling: false,
    statusUpdateDate: null,
    categoryCode: 'CL',
    customerTypeCode: 'LD',
    customerTypeUpdateDate: null,
    occupationCode: null,
    occupationOther: null,
    isRetired: false,
    practiceCode: null,
    practitionerCode: null,
    genderDescription: null,
    titleDescription: null,
    salutationDescription: 'Mrs',
    statusDescription: 'Active ',
    categoryDescription: 'Private Clients',
    customerTypeDescription: 'Lead',
    occupationDescription: null,
    addresses: [
      {
        customerCode: 'VL1P5KX',
        addressCounter: 1,
        isMailingDefault: true,
        isInvoiceDefault: true,
        isOtherContact: false,
        address: [
          '1 Real St',
          '',
          null,
          null
        ],
        countryCode: 'AUS',
        areaCode: '101',
        zipCode: '4103',
        city: 'ANNERLEY',
        locality: null,
        poBox: null,
        phones: [
          '0738925797',
          null,
          null
        ],
        mobile: ' ',
        eMail: null,
        isHomeVisitDefault: false,
        homeVisitContactName: null,
        stateCode: 'QLD',
        rowGuid: '155dc948-9863-4b98-9aaa-65d97cf7a3c1'
      },
      {
        customerCode: 'VL1P5KX',
        addressCounter: 2,
        isMailingDefault: false,
        isInvoiceDefault: false,
        isOtherContact: true,
        address: [
          null,
          null,
          null,
          null
        ],
        countryCode: 'AUS',
        areaCode: null,
        zipCode: null,
        city: null,
        locality: null,
        poBox: null,
        phones: [
          '',
          null,
          null
        ],
        mobile: null,
        eMail: null,
        isHomeVisitDefault: false,
        homeVisitContactName: null,
        stateCode: 'QLD',
        rowGuid: '0f73c8c7-00db-4462-a52d-7f7971164dcf'
      }
    ],
    age: 96,
    languageDescription: 'english',
    languageCode: '0001',
    rowGuid: '8d3758dc-376a-4ec2-9119-36ace2a4a496'
  };
  today: number = Date.now();
  bday: number = Date.parse(this.testDataCardCustomer.birthday);
  age: number;
  testDataCardCustomerForm: FormGroup;


  constructor(private fb: FormBuilder) {
    this.testDataCardCustomerForm = this.fb.group({
      birthdate: this.testDataCardCustomer.birthday,
      gender: '',
      salutation: '',
      languageDescription: ''
    });
  }

  ngOnInit() {
    this.calcAge();
  }

  public calcAge() {
    const timediff = Math.abs(this.today - this.bday);
    this.age = Math.floor((timediff / (1000 * 3600 * 24)) / 365);

  }

}
