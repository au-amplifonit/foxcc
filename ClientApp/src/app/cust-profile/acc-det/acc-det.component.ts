import { Component, OnInit } from '@angular/core';
import { ClientSelectedService } from '../../shared/services/client-selected.service';
import { Address, Customer } from '../../shared/models/customer.model';
import { Observable, of, pipe } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidatorFn,
  AsyncValidatorFn,
  ValidationErrors
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerApiService } from '../../core/services/api/customer/customer-api.service';
import { ButtonMenuItemsList } from '../../shared/models/utility/button-menu-items-list';
import { Clinic } from '../../shared/models/clinic.model';
import { AppDetConstants } from './costants';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Common, State } from 'src/app/shared/models/common/common.model';
import { ToastrService } from 'ngx-toastr';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

import { enGbLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import * as moment from 'moment';
import { tap, take } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { TypeaheadMatch, BsModalService } from 'ngx-bootstrap';
import { InfoModalComponent } from 'src/app/shared/components/info-modal/info-modal.component';
import { AddressConfirmModalComponent } from 'src/app/shared/components/address-confirm-modal/address-confirm-modal.component';

defineLocale('en-gb', enGbLocale);

@Component({
  selector: 'fcw-acc-det',
  templateUrl: './acc-det.component.html',
  styleUrls: ['./acc-det.component.scss']
})
export class AccDetComponent implements OnInit {
  data: Customer;
  customerId;
  modalFlag = false;
  xid;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  dataSource: Observable<any>;
  data$: Observable<Customer>;
  cardCustomerContactForm: FormGroup;
  cardCustomerOtherContactForm: FormGroup;
  cardCustomerIdentityForm: FormGroup;
  cardCustomerAddressForm: FormGroup;
  cardCustomerAccountForm: FormGroup;
  customerPhoneGroup: any;
  objCustomer: any = {};
  clinicAddress: any;
  objCustomerMerge = {};
  appointmentsStatus: Common[];
  categoriesType: Common[];
  preferredTimesOfContact: Common[];
  relationships: Common[];
  isSaving = false;
  maxDate: Date = new Date();
  localAddresses = [
    {
      id: '001',
      addressType: '001',
      addressLine1: null,
      addressLine2: null,
      locality: '',
      stateCode: '',
      zipCode: '',
      city: null,
      rowGuid: '00000000-0000-0000-0000-000000000000'
    },
    {
      id: '002',
      addressType: '002',
      addressLine1: null,
      addressLine2: null,
      locality: '',
      stateCode: '',
      zipCode: '',
      city: null,
      rowGuid: '00000000-0000-0000-0000-000000000000'
    },
    {
      id: '003',
      addressType: '003',
      addressLine1: null,
      addressLine2: null,
      locality: '',
      stateCode: '',
      zipCode: '',
      city: null,
      rowGuid: '00000000-0000-0000-0000-000000000000'
    },
    {
      id: '004',
      addressType: '003',
      addressLine1: null,
      addressLine2: null,
      locality: '',
      stateCode: '',
      zipCode: '',
      city: null,
      rowGuid: '00000000-0000-0000-0000-000000000000'
    }
  ];
  isSwitchChecked = false;
  appointmentTypeIndex = 0;
  // keyPairTOC: { desc: string, code: string};
  dataMenuIdentityForm: ButtonMenuItemsList[] = [
    {
      icon: '',
      text: 'Edit',
      url: '',
      eventName: 'editToggleIdentity'
    }
  ];
  dataMenuAccount: ButtonMenuItemsList[] = [
    {
      icon: '',
      text: 'Edit',
      url: '',
      eventName: 'editToggleAccount'
    }
  ];
  dataMenuContact: ButtonMenuItemsList[] = [
    {
      icon: '',
      text: 'Edit',
      url: '',
      eventName: 'editToggleContact'
    }
  ];
  dataMenuOtherContact: ButtonMenuItemsList[] = [
    {
      icon: '',
      text: 'Edit',
      url: '',
      eventName: 'editToggleOtherContact'
    }
  ];
  dataMenuAddressForm: ButtonMenuItemsList[] = [
    {
      icon: '',
      text: 'Edit',
      url: '',
      eventName: 'editToggleAddress'
    }
  ];
  customer: Customer;
  singleAddress: Address;
  homeAddress: Address; // -> isHomeAddress=true
  mailingAddress: Address; // --> isMailingDefault=true
  invoiceAddress: Address; // --> isInvoiceDefault=true
  otherAddress: Address; // --> isOtherContact=true
  // singleAddress: Address;
  switcher = {
    isHiddenIdentity: true,
    isHiddenContact: true,
    isHiddenAddress: true,
    isHiddenAccount: true,
    isHiddenOtherContact: true
  };
  salutationList: Common[];
  languageList: Common[];
  stateList: State[];
  genderList = AppDetConstants.GENDERLIST;
  TOCList = AppDetConstants.TOCLIST;
  statusList: Common[];
  fundingList: Common[];
  clinicList: Clinic[];
  addressTypeList = AppDetConstants.ADDRESSTYPELIST;

  nullChar = '--';

  otherContactIndex = 0;
  // preferredIndex: number;
  customerIndex = 0;
  homeAddressIndex: number;
  mailingAddressIndex: number;
  invoiceAddressIndex: number;
  homeVisitInfosIndex: number;
  isNewForm: boolean;
  inEditing = false;
  customerIdBool: boolean; // shows card button footer if customer id is present  momentarily just hide button indefinitely
  objAddress = {};
  contactPreferredIsOtherOne = false;
  private readonly state: { [p: string]: any };
  private cCustContactData: any;
  private cCustIdentityData: any;
  private cCustAccountData: any;
  private cCustAddressData: any;
  private homeAddressForm: FormGroup;
  bsModalRef: any;
  bsModalRef2: any;

  constructor(
    private fb: FormBuilder,
    private customerSrv: ClientSelectedService,
    private router: Router,
    private route: ActivatedRoute,
    private api: CustomerApiService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private localeService: BsLocaleService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private bsModalService: BsModalService
  ) {
    this.localeService.use('en-gb');
    this.state = this.router.getCurrentNavigation().extras.state;
    this.route.params.subscribe(params => {
      if (params.id) {
        this.customerId = params['id'];
      }
      if (params.xid) {
        this.xid = params['xid'];
      }
      this.customerIdBool = !!this.customerId;
    });
    this.route.queryParams.subscribe(qParams => {
      if (qParams.xid) {
        this.xid = qParams['xid'];
      }
    });
    // @ts-ignore
    // tslint:disable-next-line:new-parens
    this.customer = new (class implements Customer {
      addresses: [
        {
          customerCode: '';
          addressCounter: 0;
          isHomeAddress: false;
          isMailingDefault: false;
          isInvoiceDefault: false;
          isOtherContact: false;
          address: string[];
          stateCode: '';
          city: '';
          zipCode: '';
          // city: '';
          locality: '';
          poBox: '';
          phones: string[];
          mobile: '';
          eMail: '';
          preferredContactMethod: 3;
          isHomeVisitDefault: false;
          homeVisitContactName: '';
          countryCode: '';
          rowGuid: '';
        },
        {
          customerCode: '';
          addressCounter: 0;
          isHomeAddress: false;
          isMailingDefault: false;
          isInvoiceDefault: false;
          isOtherContact: false;
          address: string[];
          stateCode: '';
          zipCode: '';
          city: '';
          locality: '';
          poBox: '';
          phones: string[];
          mobile: '';
          eMail: '';
          isPreferred: false;
          preferredContactMethod: 3;
          isHomeVisitDefault: false;
          homeVisitContactName: '';
          countryCode: '';
          rowGuid: '';
        }
      ];
      id: '';
      firstname: '';
      lastname: '';
      birthday: '';
      fundingType: '';
      statusCode: '';
      practiceName: '';
      practitionerNumber: '';
      practitionerName: '';
      age: 0;
      middleName: '';
      preferredName: '';
      // tslint:disable-next-line:variable-name
      otherContact_Firstname: '';
      // tslint:disable-next-line:variable-name
      otherContact_Lastname: '';
      relation: '';
      genderCode: '';
      birthPlace: '';
      // tslint:disable-next-line:variable-name
      tax_ID_Number: '';
      titleCode: '';
      salutationCode: '';
      allowPrivacy: false;
      allowSensData: false;
      allowAdvertising: false;
      allowProfiling: false;
      statusUpdateDate: '';
      categoryCode: '';
      customerTypeCode: '';
      customerTypeUpdateDate: '';
      occupationCode: '';
      occupationOther: '';
      isRetired: false;
      practiceCode: '';
      practitionerCode: '';
      languageCode: '';
      preferredContactMethod: 3;
      isOtherContactPreferred: false;
      preferredTimeOfContactCode: '';
      genderDescription: '';
      titleDescription: '';
      salutationDescription: '';
      statusDescription: '';
      categoryDescription: '';
      customerTypeDescription: '';
      occupationDescription: '';
      languageDescription: '';
      preferredTimeOfContactDescription: '';
      // lastHAItemHistory: LastHAItemHistory[];
      rowGuid: '';
    })();
    // tslint:disable-next-line:new-parens
    this.singleAddress = new (class implements Address {
      customerCode: string;
      addressCounter: number;
      isHomeAddress: boolean;
      isMailingDefault: boolean;
      isInvoiceDefault: boolean;
      isOtherContact: boolean;
      address: string[];
      stateCode: string;
      city: string;
      zipCode: string;
      locality: string;
      poBox: string;
      phones: string[];
      mobile: string;
      eMail: string;
      preferredContactMethod: number;
      isHomeVisitDefault: boolean;
      homeVisitContactName: string;
      countryCode: string;
      rowGuid: string;
    })();

    this.cardCustomerContactForm = this.fb.group(this.customer);
    this.cardCustomerOtherContactForm = this.fb.group(this.customer);
    this.cardCustomerIdentityForm = this.fb.group(this.customer);
    this.cardCustomerAddressForm = this.fb.group(this.customer);
    this.cardCustomerAccountForm = this.fb.group(this.customer);
    this.customerPhoneGroup = this.fb.group(this.customer);
  }

  ngOnInit() {

    this.api.shareAddress$.subscribe(data => {
      this.cardCustomerAddressForm.patchValue(data);
    });

    this.modalService.onHide.subscribe(data => {
      this.modalFlag = false;
    });

    this.commonService
      .getLanguage()
      .subscribe((data: Common[]) => (this.languageList = data));
    this.commonService
      .getSalutation()
      .subscribe((data: Common[]) => (this.salutationList = data));
    this.commonService
      .getCustomerType()
      .subscribe((data: Common[]) => (this.categoriesType = data));
    this.commonService
      .getRelationship()
      .subscribe((data: Common[]) => (this.relationships = data));
    this.commonService
      .getPreferredTimeOfContact()
      .subscribe((data: Common[]) => (this.preferredTimesOfContact = data));
    this.commonService
      .getStates()
      .subscribe((data: State[]) => (this.stateList = data));
    this.commonService
      .getCustomerStatus()
      .subscribe((data: Common[]) => (this.statusList = data));
    this.commonService
      .getFundingType()
      .subscribe((data: Common[]) => (this.fundingList = data));
    this.commonService
      .getClinic()
      .subscribe((data: Clinic[]) => (this.clinicList = data));
    if (this.customerId) {
      this.getCustomer();
    } else {
      this.switcher.isHiddenIdentity = false;
      this.switcher.isHiddenContact = false;
      this.switcher.isHiddenAddress = false;
      this.switcher.isHiddenAccount = false;
      this.switcher.isHiddenOtherContact = false;
      if (this.xid) {
        this.getCustomerFromLead();
      } else {
        this.setForm(true);
      }
    }
    this.setOtherContactValidators(this.contactPreferredIsOtherOne);
  }

  /* TODO: MOVE INTO UTILS */
  setAreaValidation() {
    // if (this.inEditing) {
    //   if (this.cardCustomerOtherContactForm.controls['isOtherContactPreferred'].value) {
    //     this.cardCustomerOtherContactForm.controls['isOtherContactPreferred'].enable();
    //   } else {
    //     this.cardCustomerOtherContactForm.enable();
    //   }
    // }
    // this.contactPreferredIsOtherOne = !this.cardCustomerOtherContactForm.controls['isOtherContactPreferred'].value;
  }

  /* TODO: MOVE INTO UTILS */
  setOtherContactValidators($event) {
    const otherContactFirstname = this.cardCustomerOtherContactForm.get(
      'otherContact_Firstname'
    );
    const otherContactLastname = this.cardCustomerOtherContactForm.get(
      'otherContact_Lastname'
    );
    const relation = this.cardCustomerOtherContactForm.get('relation');
    const otherContactEmail = this.cardCustomerOtherContactForm.get(
      'otherContact_eMail'
    );
    const otherContactMobile = this.cardCustomerOtherContactForm.get(
      'otherContact_mobile'
    );
    const otherContactWorkHomePhone = this.cardCustomerOtherContactForm.get(
      'otherContact_workHomePhone'
    );
    this.contactPreferredIsOtherOne = $event;
    if ($event) {
      if (!this.isNewForm) {
        // this.switcher.isHiddenOtherContact = false;
        setTimeout(() => {
          this.switcher.isHiddenOtherContact = false;
        });
        // this.switcher.isHiddenOtherContact = false;
        this.isSwitchChecked = true;
        this.toggleFormAbilitation(
          this.switcher.isHiddenOtherContact,
          this.cardCustomerIdentityForm
        );
      }
      setTimeout(() => {
        if (otherContactFirstname) {
          otherContactFirstname.setValidators([Validators.required]);
          otherContactFirstname.enable();
          otherContactFirstname.updateValueAndValidity();
        }
        if (otherContactLastname) {
          otherContactLastname.setValidators([Validators.required]);
          otherContactLastname.enable();
          otherContactLastname.updateValueAndValidity();
        }
        if (relation) {
          relation.setValidators([Validators.required]);
          relation.updateValueAndValidity();
          relation.enable();
        }
        if (otherContactMobile) {
          otherContactMobile.setValidators([
            Validators.required,
            Validators.maxLength(10)
          ]);
          otherContactMobile.updateValueAndValidity();
          otherContactMobile.enable();
        }
        if (otherContactWorkHomePhone) {
          otherContactWorkHomePhone.setValidators([
            Validators.required,
            Validators.maxLength(10)
          ]);
          otherContactWorkHomePhone.updateValueAndValidity();
          otherContactWorkHomePhone.enable();
        }
        if (otherContactEmail) {
          otherContactWorkHomePhone.setValidators([
            Validators.required,
            Validators.maxLength(10)
          ]);
          otherContactWorkHomePhone.updateValueAndValidity();
          otherContactEmail.enable();
        }
      });
    } else {
      if (!this.isNewForm) {
        this.switcher.isHiddenOtherContact = this.xid ? false : true;
        this.isSwitchChecked = false;
        this.toggleFormAbilitation(
          this.switcher.isHiddenOtherContact,
          this.cardCustomerIdentityForm
        );
      }
      if (otherContactFirstname) {
        otherContactFirstname.setValidators(null);
        otherContactFirstname.updateValueAndValidity();
      }
      if (otherContactLastname) {
        otherContactLastname.setValidators(null);
        otherContactLastname.updateValueAndValidity();
      }
      if (relation) {
        relation.setValidators(null);
        relation.updateValueAndValidity();
      }
      if (otherContactMobile) {
        otherContactMobile.setValidators(null);
        otherContactMobile.updateValueAndValidity();
      }
      if (otherContactWorkHomePhone) {
        otherContactWorkHomePhone.setValidators(null);
        otherContactWorkHomePhone.updateValueAndValidity();
      }
      if (otherContactEmail) {
        otherContactEmail.setValidators(null);
        otherContactEmail.updateValueAndValidity();
      }
    }
  }

  handlePreferredContactRadioChanges($event) {
    const parsedValue = parseInt($event.target.value, 10);
    this.cardCustomerOtherContactForm.controls[
      'isOtherContactPreferred'
    ].setValue(parsedValue === 1 ? true : false);
  }

  handleRadioChanges($event) {
    this.cardCustomerContactForm.controls['preferredContactMethod'].setValue(
      $event.target.value
    );
  }

  getAddressValues(addresses) {
    this.localAddresses[0].addressLine1 = addresses[0].address[0];
    this.localAddresses[0].addressLine2 = addresses[0].address[1];
    // this.localAddresses[0].city = addresses[0].city;
    this.localAddresses[0].city = addresses[0].city;
    this.localAddresses[0].stateCode = addresses[0].stateCode;
    this.localAddresses[0].zipCode = addresses[0].zipCode;
    this.localAddresses[0].rowGuid = this.customer['addresses'][0].rowGuid;
    addresses.forEach(addressObj => {
      if (!addressObj.isHomeAddress && addressObj.isMailingDefault) {
        this.localAddresses[1].addressLine1 = addressObj.address[0];
        this.localAddresses[1].addressLine2 = addressObj.address[1];
        // this.localAddresses[1].city = addressObj.city;
        this.localAddresses[1].stateCode = addressObj.stateCode;
        this.localAddresses[1].city = addressObj.city;
        this.localAddresses[1].zipCode = addressObj.zipCode;
        this.localAddresses[1].rowGuid = addressObj.rowGuid;
      }
      if (!addressObj.isHomeAddress && addressObj.isInvoiceDefault) {
        this.localAddresses[2].addressLine1 = addressObj.address[0];
        this.localAddresses[2].addressLine2 = addressObj.address[1];
        this.localAddresses[2].stateCode = addressObj.stateCode;
        this.localAddresses[2].city = addressObj.city;
        this.localAddresses[2].zipCode = addressObj.zipCode;
        this.localAddresses[2].rowGuid = addressObj.rowGuid;
      }
      if (!addressObj.isHomeAddress && addressObj.isHomeVisitDefault) {
        this.localAddresses[3].addressLine1 = addressObj.address[0];
        this.localAddresses[3].addressLine2 = addressObj.address[1];
        this.localAddresses[3].stateCode = addressObj.stateCode;
        this.localAddresses[3].city = addressObj.city;
        this.localAddresses[3].zipCode = addressObj.zipCode;
        this.localAddresses[3].rowGuid = addressObj.rowGuid;
      }
    });
  }

  getCustomer() {
    this.api
      .getCustomer(this.customerId)
      .pipe(
        take(1),
        tap(res => {
          this.api.updateCustomer(res);
        })
      )
      .subscribe(res => {
        this.data = res;
        this.api.customer = res;
        this.customer = { ...this.data };
        this.customer.birthday = moment(this.customer.birthday).toDate();
        this.otherContactIndex = this.customer['addresses'].findIndex(
          x => x.isOtherContact
        );
        if (this.otherContactIndex === -1) {
          // there's no other contact
          this.otherContactIndex = 0;
          // this.otherAddress = this.customer.addresses[this.otherContactIndex];
        }
        if (this.customer['addresses'] && this.customer['addresses'][0]) {
          if (this.customer['addresses'][0].eMail === null) {
            this.customer['addresses'][0].eMail = '';
          }
        }
        this.customerIndex = this.customer['addresses'].findIndex(
          x => x.customerCode
        );
        // this.homeVisitInfosIndex = this.customer['addresses'].findIndex(x => x.isHomeVisitDefault);
        // this.invoiceAddressIndex = this.customer['addresses'].findIndex(x => x.isInvoiceDefault);
        // this.mailingAddressIndex = this.customer['addresses'].findIndex(x => x.isMailingDefault);
        this.getAddressValues(this.customer['addresses']);
        this.contactPreferredIsOtherOne = this.customer[
          'isOtherContactPreferred'
        ];
        this.otherAddress = this.customer.addresses[this.otherContactIndex];
        this.setForm(false);
        setTimeout(() =>
          this.cardCustomerOtherContactForm.controls['relation'].disable()
        );
      });
  }

  getCustomerFromLead() {
    this.api.getCustomerFromLead(this.xid).subscribe(res => {
      this.data = res;
      this.api.customer = res;
      this.api.updateCustomer(res);
      this.customer = { ...this.data };
      if (this.customer['addresses'] && this.customer['addresses'][0]) {
        if (this.customer['addresses'][0].eMail === null) {
          this.customer['addresses'][0].eMail = '';
        }
      }
      this.otherContactIndex = this.customer['addresses'].findIndex(
        x => x.isOtherContact
      );
      if (this.otherContactIndex === -1) {
        // there's no other contact
        this.otherContactIndex = 0;
        // this.otherAddress = this.customer.addresses[this.otherContactIndex];
      }
      this.customerIndex = this.customer['addresses'].findIndex(
        x => x.customerCode === null
      );
      // this.homeVisitInfosIndex = this.customer['addresses'].findIndex(x => x.isHomeVisitDefault);
      // this.invoiceAddressIndex = this.customer['addresses'].findIndex(x => x.isInvoiceDefault);
      // this.mailingAddressIndex = this.customer['addresses'].findIndex(x => x.isMailingDefault);
      this.getAddressValues(this.customer['addresses']);
      this.contactPreferredIsOtherOne = this.customer[
        'isOtherContactPreferred'
      ];
      this.otherAddress = this.customer.addresses[this.otherContactIndex];
      this.setForm(false);
    });
  }

  onChanges(): void {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.cardCustomerContactForm.controls['customerPhone']) {
      this.cardCustomerContactForm.controls['customerEmail'].setErrors(null);
      this.cardCustomerContactForm.controls[
        'customerPhone'
      ].valueChanges.subscribe(val => {
        this.validateCustomerPhone(
          this.cardCustomerContactForm.controls['customerPhone']
        );
      });
      this.cardCustomerContactForm.controls['customerEmail'].valueChanges.subscribe(val => {
        if (regex.test(val)) {
          this.customerPhoneGroup.controls['customerMobile'].setErrors(null);
          this.customerPhoneGroup.controls['customerOtherPhone'].setErrors(null);
          this.customerPhoneGroup.controls['customerHomePhone'].setErrors(null);
          this.customerPhoneGroup.controls['customerWorkPhone'].setErrors(null);
        } else if (val === '') {
          if (this.customerPhoneGroup.controls['customerEmail']) { this.customerPhoneGroup.controls['customerEmail'].setErrors(null); }
          this.validateCustomerPhone(
            this.cardCustomerContactForm.controls['customerPhone']
          );
        } else {
          this.customerPhoneGroup.controls['customerMobile'].setErrors({
            atLeastOnePhoneValid: true
          });
          this.customerPhoneGroup.controls['customerHomePhone'].setErrors({
            atLeastOnePhoneValid: true
          });
          this.customerPhoneGroup.controls['customerWorkPhone'].setErrors({
            atLeastOnePhoneValid: true
          });
          this.customerPhoneGroup.controls['customerOtherPhone'].setErrors({
            atLeastOnePhoneValid: true
          });
        }

      });

      this.customerPhoneGroup.controls['customerHomePhone'].valueChanges.subscribe(val => {
        if (val) {
          this.cardCustomerContactForm.controls['customerEmail'].setErrors(null);
        }
      });
    }
    if (this.cardCustomerOtherContactForm) {
      this.cardCustomerOtherContactForm.valueChanges.subscribe(val => {
        this.otherContactRecallMethodValidation();
      });
    }
    this.cardCustomerAddressForm.controls[
      'addressLine1'
    ].valueChanges.subscribe(val => {
      if (val !== '') {
        this.dataSource = Observable.create((observer: any) => {
          this.commonService.getAddressValues(val).subscribe((places: any) => {
            const placesDescription = places.map(place => place.description);
            observer.next(placesDescription);
          });
        });
      }
    });
  }

  generateStateCode(cityAndStateCode) {
    let stateCode = '';
    cityAndStateCode.forEach((element, index) => {
      if (index + 1 === cityAndStateCode.length) {
        stateCode = `${stateCode} ${element}`;
      }
    });
    return stateCode.trim();
  }

  generateCity(cityAndStateCode) {
    let city = '';
    cityAndStateCode.forEach((element, index) => {
      if (index + 1 !== cityAndStateCode.length) {
        city = `${city} ${element}`;
      }
    });
    return city.trim();
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    const addressLine1 = e.value.split(',')[0];
    const cityAndStateCode = e.value.split(',')[1].split(' ');
    const city =
      cityAndStateCode.length <= 2 ? null : this.generateCity(cityAndStateCode);
    const stateCode =
      cityAndStateCode.length <= 2
        ? null
        : this.generateStateCode(cityAndStateCode);
    this.cardCustomerAddressForm.patchValue({
      addressLine1,
      stateCode,
      city
    });
  }

  setForm(newForm) {
    this.isNewForm = newForm;


    this.customerPhoneGroup = this.fb.group({
      customerMobile: newForm
        ? new FormControl(null, Validators.required)
        : new FormControl(
            this.customer['addresses'][this.customerIndex]['mobile']
          ),
      customerHomePhone: newForm
        ? new FormControl(null,Validators.required)
        : new FormControl(
            this.customer['addresses'][this.customerIndex]['phones'][0]
          ),
      customerWorkPhone: newForm
        ? new FormControl(null,Validators.required)
        : new FormControl(
            this.customer['addresses'][this.customerIndex]['phones'][1]
          ),
      customerOtherPhone: newForm
        ? new FormControl(null,Validators.required)
        : new FormControl(
            this.customer['addresses'][this.customerIndex]['phones'][2]
          )
    });

    this.cardCustomerContactForm = this.fb.group({
      firstname: newForm
        ? new FormControl('', [Validators.required])
        : new FormControl(this.customer['firstname'], [Validators.required]),
      lastname: newForm
        ? new FormControl('', [Validators.required])
        : new FormControl(this.customer['lastname'], [Validators.required]),
      preferredName: newForm
        ? new FormControl('')
        : new FormControl(this.customer['preferredName']),
      middleName: newForm
        ? new FormControl('')
        : new FormControl(this.customer['middleName']),
      customerEmail: newForm
        ? new FormControl('', [Validators.required])
        : new FormControl(
            this.customer['addresses'][this.customerIndex]['eMail'],
            [this.emailValidator]
          ),
      customerPhone: this.customerPhoneGroup,
      preferredContactMethod: newForm
        ? new FormControl(3, [Validators.required])
        : new FormControl(this.customer.preferredContactMethod, [
            Validators.required
          ]),
      prefTOC: newForm
        ? new FormControl('02', [Validators.required])
        : new FormControl(
            {
              value: this.customer.preferredTimeOfContactCode,
              disabled: this.xid ? false : true
            },
            [Validators.required]
          )
      // ----------------Other contact------------------------------ ///
    });
    this.cardCustomerOtherContactForm = this.fb.group({
      isOtherContactPreferred: newForm
        ? new FormControl(false)
        : new FormControl(this.customer['isOtherContactPreferred']),
      otherContact_Firstname: newForm
        ? new FormControl(null)
        : new FormControl(this.customer['otherContact_Firstname']),
      otherContact_Lastname: newForm
        ? new FormControl(null)
        : new FormControl(this.customer['otherContact_Lastname']),
      relation: newForm
        ? new FormControl(null)
        : new FormControl(this.customer['relation']),
      otherContact_eMail: newForm
        ? new FormControl(null, [this.emailValidator])
        : this.otherContactIndex !== 0
        ? new FormControl(
            this.customer['addresses'][this.otherContactIndex]['eMail'],
            []
          )
        : new FormControl(null, []),
      otherContact_mobile: newForm
        ? new FormControl(null, [Validators.maxLength(10)])
        : this.otherContactIndex !== 0
        ? new FormControl(
            this.customer['addresses'][this.otherContactIndex]['mobile'],
            [Validators.maxLength(10)]
          )
        : new FormControl(null, [Validators.maxLength(10)]),
      otherContact_workHomePhone: newForm
        ? new FormControl(null, [Validators.maxLength(10)])
        : this.otherContactIndex !== 0
        ? new FormControl(
            this.customer['addresses'][this.otherContactIndex].phones[0],
            [Validators.maxLength(10)]
          )
        : new FormControl(null, [Validators.maxLength(10)])
    });

    this.cardCustomerIdentityForm = this.fb.group({
      birthday: newForm
        ? new FormControl(null, [Validators.required])
        : new Date(this.customer['birthday']),
      genderCtrl: newForm
        ? new FormControl(null, [Validators.required])
        : new FormControl(this.customer['genderCode'], [Validators.required]),
      salutationCtrl: newForm
        ? new FormControl(null, [Validators.required])
        : new FormControl(this.customer['salutationCode'], [
            Validators.required
          ]),
      languageCtrl: newForm
        ? new FormControl('en-US')
        : new FormControl(
            this.customer['languageCode'] !== null
              ? this.customer['languageCode']
              : 'en-US'
          )
    });

    this.cardCustomerAddressForm = this.fb.group({
      addressType: newForm
        ? new FormControl({ value: '001', disabled: true })
        : new FormControl({ value: '001', disabled: false }),
      addressLine1: newForm
        ? new FormControl(null, [
            Validators.required,
            Validators.maxLength(100)
          ])
        : new FormControl(this.localAddresses[0]['addressLine1'], [
            Validators.required,
            Validators.maxLength(100)
          ]),
      addressLine2: newForm
        ? new FormControl(null)
        : this.localAddresses[0]['addressLine2'],
      locality: newForm
        ? new FormControl(null)
        : this.localAddresses[0]['locality'],
      city: newForm
        ? new FormControl(null, [Validators.required, Validators.maxLength(50)])
        : new FormControl(this.localAddresses[0]['city'], [
            Validators.required,
            Validators.maxLength(50)
          ]),
      // city: (newForm) ? new FormControl(null, [
      //   Validators.required,
      // ]) : (this.localAddresses[0]['city']),
      stateCode: newForm
        ? new FormControl(null, [Validators.required, Validators.maxLength(3)])
        : new FormControl(this.localAddresses[0]['stateCode'], [
            Validators.required,
            Validators.maxLength(3)
          ]),
      zipCode: newForm
        ? new FormControl('', [Validators.maxLength(15), Validators.required])
        : new FormControl(this.localAddresses[0]['zipCode'], [
            Validators.maxLength(15),
            Validators.required
          ])
    });

    this.cardCustomerAccountForm = this.fb.group({
      id: newForm ? new FormControl('') : this.customer['id'],
      statusDescription: newForm
        ? new FormControl('00', [Validators.required])
        : this.customer['statusCode'],
      fundingType: newForm
        ? new FormControl('PVT', [Validators.required])
        : new FormControl(this.customer['fundingType'], [Validators.required]),
      shopcode: newForm
        ? new FormControl('000')
        : new FormControl(this.customer['shopCode'], [Validators.required])
    });
    // this.cardCustomerContactForm.controls['customerEmail'].setErrors(null);
    

    this.onChanges();
    this.validateCustomerPhone(
      this.cardCustomerContactForm.controls['customerPhone']
    );
  }

  getClinicName() {
    return this.clinicList.find(e => e.code === this.customer.shopCode)
      .description;
  }

  onlyNumbers(event) {
    if (event.target.value.length === 4) {
      return false;
    }
  }

  onCancel(form, switcher) {
    this.setForm(false);
    this.inEditing = false;
    switch (switcher) {
      case 'isHiddenIdentity': {
        this.switcher.isHiddenIdentity = !this.switcher.isHiddenIdentity;
        this.toggleFormAbilitation(this.switcher.isHiddenIdentity, form);
        break;
      }
      case 'isHiddenContact': {
        setTimeout(() =>
          this.cardCustomerContactForm.controls['prefTOC'].disable()
        );
        this.switcher.isHiddenContact = !this.switcher.isHiddenContact;
        this.isSwitchChecked = false;
        this.toggleFormAbilitation(this.switcher.isHiddenContact, form);
        break;
      }
      case 'isHiddenAddress': {
        setTimeout(() =>
          this.cardCustomerAddressForm.controls['addressType'].enable()
        );
        this.switcher.isHiddenAddress = !this.switcher.isHiddenAddress;
        this.toggleFormAbilitation(this.switcher.isHiddenAddress, form);
        break;
      }
      case 'isHiddenOtherContact': {
        setTimeout(() =>
          this.cardCustomerOtherContactForm.controls['relation'].disable()
        );
        this.switcher.isHiddenOtherContact = !this.switcher
          .isHiddenOtherContact;
        this.toggleFormAbilitation(this.switcher.isHiddenOtherContact, form);
        break;
      }
      case 'isHiddenAccount': {
        this.switcher.isHiddenAccount = !this.switcher.isHiddenAccount;
        this.toggleFormAbilitation(this.switcher.isHiddenAccount, form);
        break;
      }
      default: {

      }
    }
  }

  setStoredAddressValues(addressTypeId) {
    this.appointmentTypeIndex = this.localAddresses.findIndex(
      address => address.id === addressTypeId
    );
    this.localAddresses[this.appointmentTypeIndex]
      ? this.cardCustomerAddressForm.controls['addressLine1'].setValue(
          this.localAddresses[this.appointmentTypeIndex]['addressLine1']
        )
      : this.cardCustomerAddressForm.controls['addressLine1'].setValue('');
    this.localAddresses[this.appointmentTypeIndex]
      ? this.cardCustomerAddressForm.controls['addressLine2'].setValue(
          this.localAddresses[this.appointmentTypeIndex]['addressLine2']
        )
      : this.cardCustomerAddressForm.controls['addressLine2'].setValue('');
    // this.localAddresses[this.appointmentTypeIndex] ? this.cardCustomerAddressForm.controls['city'].setValue(this.localAddresses[this.appointmentTypeIndex]['city']) : this.cardCustomerAddressForm.controls['city'].setValue('');
    this.localAddresses[this.appointmentTypeIndex]
      ? this.cardCustomerAddressForm.controls['stateCode'].setValue(
          this.localAddresses[this.appointmentTypeIndex]['stateCode']
        )
      : this.cardCustomerAddressForm.controls['stateCode'].setValue('');
    this.localAddresses[this.appointmentTypeIndex]
      ? this.cardCustomerAddressForm.controls['city'].setValue(
          this.localAddresses[this.appointmentTypeIndex]['city']
        )
      : this.cardCustomerAddressForm.controls['city'].setValue('');
    this.localAddresses[this.appointmentTypeIndex]
      ? this.cardCustomerAddressForm.controls['zipCode'].setValue(
          this.localAddresses[this.appointmentTypeIndex]['zipCode']
        )
      : this.cardCustomerAddressForm.controls['zipCode'].setValue('');
  }

  handleLocalAddressCancel($event) {
    this.setStoredAddressValues($event.target.value);
  }

  handleLocalAddressSave($event) {
    //Segnaposto*12*
    const {city, zipCode, stateCode} = this.cardCustomerAddressForm.value;
    this.api.getAddressValidity({city, zipCode, stateCode}).subscribe((flag) => {
      if (flag) {
        switch ($event) {
          case '001':
            this.localAddresses[0] = this.cardCustomerAddressForm.value;
            this.localAddresses[0].id = '001';
            this.cardCustomerAddressForm.controls['addressType'].enable();
            break;
          case '002':
            this.localAddresses[1] = this.cardCustomerAddressForm.value;
            this.localAddresses[1].id = '002';
            break;
          case '003':
            this.localAddresses[2] = this.cardCustomerAddressForm.value;
            this.localAddresses[2].id = '003';
            break;
          case '004':
            this.localAddresses[3] = this.cardCustomerAddressForm.value;
            this.localAddresses[3].id = '004';
            break;
          default:
            break;
        }
      } else {
        this.bsModalRef2 = this.bsModalService.show(AddressConfirmModalComponent, {ignoreBackdropClick: true, initialState: {data: this.cardCustomerAddressForm.value }});
      }
    })
  }

  /* TODO: MOVE TO UTILS */
  handleLocalAddressChange($event) {
    this.cardCustomerAddressForm.controls['addressLine1'].setValidators([
      Validators.required
    ]);
    this.cardCustomerAddressForm.controls[
      'addressLine1'
    ].updateValueAndValidity();
    this.cardCustomerAddressForm.controls['city'].setValidators([
      Validators.required
    ]);
    this.cardCustomerAddressForm.controls['city'].updateValueAndValidity();
    this.cardCustomerAddressForm.controls['zipCode'].setValidators([
      Validators.required
    ]);
    this.cardCustomerAddressForm.controls['zipCode'].updateValueAndValidity();
    this.cardCustomerAddressForm.controls['stateCode'].setValidators([
      Validators.required
    ]);
    this.cardCustomerAddressForm.controls['stateCode'].updateValueAndValidity();
    this.setStoredAddressValues($event.target.value);
  }

  toggleEnable($event, eventName: string, form: FormGroup, switcher: string) {
    this.inEditing = true;

    switch (switcher) {
      case 'isHiddenIdentity': {
        this.switcher.isHiddenIdentity = !this.switcher.isHiddenIdentity;
        this.toggleFormAbilitation(this.switcher.isHiddenIdentity, form);
        break;
      }
      case 'isHiddenOtherContact': {
        this.setOtherContactValidators(true);
        this.toggleFormAbilitation(this.switcher.isHiddenOtherContact, form);
        break;
      }
      case 'isHiddenContact': {
        this.switcher.isHiddenContact = !this.switcher.isHiddenContact;
        this.toggleFormAbilitation(this.switcher.isHiddenContact, form);
        break;
      }
      case 'isHiddenAddress': {
        this.switcher.isHiddenAddress = !this.switcher.isHiddenAddress;
        this.toggleFormAbilitation(this.switcher.isHiddenAddress, form);
        setTimeout(() =>
          this.cardCustomerAddressForm.controls['addressType'].disable()
        );
        break;
      }
      case 'isHiddenAccount': {
        this.switcher.isHiddenAccount = !this.switcher.isHiddenAccount;
        this.toggleFormAbilitation(this.switcher.isHiddenAccount, form);
        break;
      }
      default: {
      }
    }
  }

  toggleFormAbilitation(toggle: boolean, form: FormGroup) {
    if (toggle) {
      // setTimeout(() => form.disable());
      form.disable();
    } else {
      // setTimeout(() => form.enable());
      form.enable();
    }
  }

  isPreferred(contactIndex: number) {
    if (contactIndex === this.otherContactIndex) {
      return this.customer.isOtherContactPreferred;
    } else {
      return true;
    }
  }

  onSubmitIdentify() {
  }

  onSubmitContact() {
  }

  /* output section */
  // segnaPosto*33*
  saveForm(card = null, addressType = null) {
    this.fillAddressData();
    this.fillCustAccountData();
    this.fillCustContactData();
    this.fillCustIdentityData();


    if (card === 'address') {
      console.log(this.cardCustomerAddressForm.value)
      const {city, zipCode, stateCode} = this.cardCustomerAddressForm.value;
      this.api.getAddressValidity({city, zipCode, stateCode}).subscribe((flag) => {
        if (flag) {
          this.customerId ? this.updateForm(card, addressType) : this.postForm();
        } else {
          this.bsModalRef2 = this.bsModalService.show(AddressConfirmModalComponent, {ignoreBackdropClick: true, initialState: {data: this.cardCustomerAddressForm.value }});
        }
      })
    } else {
      this.customerId ? this.updateForm(card, addressType) : this.postForm();
    }
  }

  getBackToReadMode(card) {
    this.inEditing = false;
    switch (card) {
      case 'identity': {
        this.switcher.isHiddenIdentity = !this.switcher.isHiddenIdentity;
        this.toggleFormAbilitation(
          this.switcher.isHiddenIdentity,
          this.cardCustomerIdentityForm
        );
        break;
      }
      case 'contact': {
        this.switcher.isHiddenContact = !this.switcher.isHiddenContact;
        this.toggleFormAbilitation(
          this.switcher.isHiddenContact,
          this.cardCustomerIdentityForm
        );
        break;
      }
      case 'otherContact': {
        this.switcher.isHiddenOtherContact = !this.switcher
          .isHiddenOtherContact;
        this.toggleFormAbilitation(
          this.switcher.isHiddenOtherContact,
          this.cardCustomerIdentityForm
        );
        this.cardCustomerOtherContactForm.controls['relation'].disable();
        break;
      }
      case 'address': {
        this.switcher.isHiddenAddress = !this.switcher.isHiddenAddress;
        this.toggleFormAbilitation(
          this.switcher.isHiddenAddress,
          this.cardCustomerIdentityForm
        );
        break;
      }
      case 'account': {
        this.switcher.isHiddenAccount = !this.switcher.isHiddenAccount;
        this.toggleFormAbilitation(
          this.switcher.isHiddenAccount,
          this.cardCustomerIdentityForm
        );
        break;
      }
      default: {
        alert('default case');
        break;
      }
    }

    this.otherContactIndex = this.customer['addresses'].findIndex(
      x => x.isOtherContact
    );
    if (this.otherContactIndex === -1) {
      // there's no other contact
      this.otherContactIndex = 0;
      // this.otherAddress = this.customer.addresses[this.otherContactIndex];
    }
  }

  cancelEditForm() {
    this.getCustomer();
  }

  editForm(form) {
    this.assignObjCustomer();

    this.api.putCustomer(this.objCustomer, this.customerId).subscribe(
      res => {
        this.switcher.isHiddenIdentity = false;
        this.switcher.isHiddenContact = false;
        this.switcher.isHiddenAddress = false;
        this.switcher.isHiddenAccount = false;
        this.switcher.isHiddenOtherContact = false;
      }
    );
  }

  updateForm(card = null, addressType = null) {
    this.spinner.show(card);
    switch (card) {
      case 'identity': {
        this.objCustomerMerge = {
          ...this.cCustContactData,
          ...this.cCustIdentityData
        };
        break;
      }
      case 'contact': {
        this.objCustomerMerge = {
          ...this.cCustIdentityData,
          ...this.cCustContactData
        };
        break;
      }
      case 'address': {
        setTimeout(() =>
          this.cardCustomerAddressForm.controls['addressType'].enable()
        );
        this.localAddresses[
          this.appointmentTypeIndex
        ].addressLine1 = this.cardCustomerAddressForm.controls[
          'addressLine1'
        ].value;
        this.localAddresses[
          this.appointmentTypeIndex
        ].addressLine2 = this.cardCustomerAddressForm.controls[
          'addressLine2'
        ].value;
        this.localAddresses[
          this.appointmentTypeIndex
        ].addressType = this.cardCustomerAddressForm.controls[
          'addressType'
        ].value;
        this.localAddresses[
          this.appointmentTypeIndex
        ].city = this.cardCustomerAddressForm.controls['city'].value;
        this.localAddresses[
          this.appointmentTypeIndex
        ].stateCode = this.cardCustomerAddressForm.controls['stateCode'].value;
        this.localAddresses[this.appointmentTypeIndex].id = addressType;
        this.localAddresses[
          this.appointmentTypeIndex
        ].locality = this.cardCustomerAddressForm.controls['locality'].value;
        this.localAddresses[
          this.appointmentTypeIndex
        ].zipCode = this.cardCustomerAddressForm.controls['zipCode'].value;
        this.objCustomerMerge = {
          ...this.cCustIdentityData,
          ...this.cCustContactData
        };
        break;
      }
      default: {
        // this.objCustomerMerge = { ...this.cCustContactData, ...this.cCustIdentityData };
        break;
      }
    }

    this.fillAddressData();
    this.fillCustAccountData();
    this.fillCustContactData();
    this.fillCustIdentityData();
    this.assignObjCustomer();

    for (const key in this.objCustomer) {
      if (this.objCustomer[key]) {
        this.objCustomer[key] =
          this.objCustomer[key] === this.nullChar
            ? null
            : this.objCustomer[key];
      }
    }
    this.api
      .putCustomer(this.objCustomer, this.customerId)
      .pipe(tap(() => this.spinner.hide(card)))
      .subscribe(
        (res: Customer) => {
          this.getBackToReadMode(card);
          this.getAddressValues(res.addresses);
          this.customer = res;
          this.customer.birthday = moment(
            this.cardCustomerIdentityForm.get('birthday').value
          ).toDate();
        },
        err => {
          this.spinner.hide('address');
          this.spinner.hide('account');
          this.spinner.hide('identity');
          this.spinner.hide('contact');
          this.spinner.hide('otherContact');
        }
      );
  }

  postForm() {
    this.spinner.show('total');
    this.assignObjCustomer();
    this.isSaving = true;
    for (const key in this.objCustomer) {
      if (this.objCustomer[key]) {
        this.objCustomer[key] =
          this.objCustomer[key] === this.nullChar
            ? null
            : this.objCustomer[key];
      }
    }

    this.xid = this.xid ? this.xid : null;
    this.api.postCustomer(this.objCustomer, this.xid).subscribe(
      (res: any) => {
        this.spinner.hide('total');
        window.location.href = `/main/custProfile/acc-det/${res.id}`;
      },
      err => {
        this.isSaving = false;
        this.spinner.hide('total');
      }
    );
  }

  updateAddress() {
    this.fillAddressData();
    this.assignObjAddress();
    this.api
      .putAddress(
        this.objAddress,
        this.cCustAddressData.addresses[this.appointmentTypeIndex].rowGuid
      )
      .subscribe(

      );
  }

  fillCustContactData() {
    this.cCustContactData = {
      firstname: this.cardCustomerContactForm.get('firstname').value,
      middleName: this.cardCustomerContactForm.get('middleName').value,
      lastname: this.cardCustomerContactForm.get('lastname').value,
      preferredName: this.cardCustomerContactForm.get('preferredName').value,
      // todo: manage customer email, mobile & workphone when
      //  backend DTO is ready for address put
      preferredTimeOfContactCode: this.cardCustomerContactForm.get('prefTOC')
        .value,
      preferredContactMethod: this.cardCustomerContactForm.get(
        'preferredContactMethod'
      ).value,
      // preferredTimeOfContactDescription: this.TOCList[(this.TOCList.findIndex(x => x.code === this.cardCustomerContactForm.get('prefTOC').value))].description,
      isOtherContactPreferred: this.cardCustomerOtherContactForm.get(
        'isOtherContactPreferred'
      ).value,
      otherContact_Firstname: this.cardCustomerOtherContactForm.get(
        'otherContact_Firstname'
      ).value,
      otherContact_Lastname: this.cardCustomerOtherContactForm.get(
        'otherContact_Lastname'
      ).value,
      otherContact_eMail: this.cardCustomerOtherContactForm.get(
        'otherContact_eMail'
      ).value,
      otherContact_mobile: this.cardCustomerOtherContactForm.get(
        'otherContact_mobile'
      ).value,
      otherContact_workHomePhone: this.cardCustomerOtherContactForm.get(
        'otherContact_mobile'
      ).value,
      relation: this.cardCustomerOtherContactForm.get('relation').value
    };
  }

  fillCustIdentityData() {
    this.cCustIdentityData = {
      birthday: moment(
        this.cardCustomerIdentityForm.get('birthday').value
      ).format('YYYY-MM-DD'),
      genderCode: this.cardCustomerIdentityForm.get('genderCtrl').value,
      genderDescription:
        this.cardCustomerIdentityForm.get('genderCtrl').value !== this.nullChar
          ? this.genderList[
              this.getValueFromCustomerIdentityForm(
                this.genderList,
                'genderCtrl'
              )
            ]
          : '',
      salutationCode: this.cardCustomerIdentityForm.get('salutationCtrl').value,
      salutationDescription:
        this.cardCustomerIdentityForm.get('salutationCtrl').value !==
        this.nullChar
          ? this.salutationList[
              this.getValueFromCustomerIdentityForm(
                this.salutationList,
                'salutationCtrl'
              )
            ]
          : '',
      languageCode: this.cardCustomerIdentityForm.get('languageCtrl').value,
      languageDescription:
        this.cardCustomerIdentityForm.get('languageCtrl').value !==
        this.nullChar
          ? this.cardCustomerIdentityForm.get('languageCtrl').value
          : ''
    };
  }

  getValueFromCustomerAccountForm = (list, formValue): string => {
    list.findIndex(x => {
      if (x.code === this.cardCustomerAccountForm.get(formValue).value) {
        return x.description;
      }
    });
    return '';
  }

  getValueFromCustomerIdentityForm = (list, formValue): string => {
    list.findIndex(x => {
      if (x.code === this.cardCustomerIdentityForm.get(formValue).value) {
        return x.description;
      }
    });
    return '';
  }

  fillCustAccountData() {
    this.cCustAccountData = {
      id: !this.isNewForm ? this.cardCustomerAccountForm.get('id').value : '', // ?????
      statusCode: this.cardCustomerAccountForm.get('statusDescription')
        ? this.cardCustomerAccountForm.get('statusDescription').value
        : null,
      statusDescription: this.cardCustomerAccountForm.get('statusDescription')
        ? this.cardCustomerAccountForm.get('statusDescription').value !==
          this.nullChar
          ? // this.statusList[(this.statusList.findIndex(x => x.code === this.cardCustomerAccountForm.get('statusDescription').value))].description || '' :
            // '',
            this.cardCustomerAccountForm.get('statusDescription').value
          : '000'
        : '000',
      // this.cardCustomerAccountForm.get('statusDescription').value,
      fundingType: this.cardCustomerAccountForm.get('fundingType')
        ? this.cardCustomerAccountForm.get('fundingType').value !==
          this.nullChar
          ? this.cardCustomerAccountForm.get('fundingType').value
          : 'PVT'
        : 'PVT',
      shopCode: this.cardCustomerAccountForm.get('shopcode')
        ? this.cardCustomerAccountForm.get('shopcode').value
        : '000'
    };
    if (this.isNewForm) {
      delete this.cCustAccountData.id;
    }
  }

  fillAddressData() {
    let otherContactPhones: any;
    let mailingAddress: any = {};
    let invoiceAddress: any = {};
    let homeVisitInfoAddress: any = {};
    if (this.customer && this.customer['addresses']) {
      this.otherContactIndex = this.customer['addresses'].findIndex(
        x => x.isOtherContact
      );
      if (this.otherContactIndex === -1) {
        // there's no other contact
        this.otherContactIndex = 0;
        // this.otherAddress = this.customer.addresses[this.otherContactIndex];
      }
    }
    otherContactPhones = this.contactPreferredIsOtherOne
      ? {
          isHomeAddress: false,
          isMailingDefault: false,
          isInvoiceDefault: false,
          isOtherContact: true,
          address: ['Other Contact Address', ''],
          city: this.localAddresses[0].city,
          // locality: ,
          // city: this.localAddresses[0].city, /*this.cardCustomerAddressForm.get('city').value,*/
          stateCode: this.localAddresses[0]
            .stateCode /*this.cardCustomerAddressForm.get('stateCode').value*/,
          zipCode: this.localAddresses[0]
            .zipCode /*this.cardCustomerAddressForm.get('zipCode').value*/,
          poBox: null,
          phones: [
            this.cardCustomerOtherContactForm.get('otherContact_workHomePhone')
              .value !== null
              ? this.cardCustomerOtherContactForm.get(
                  'otherContact_workHomePhone'
                ).value
              : ''
          ],
          mobile:
            this.cardCustomerOtherContactForm.get('otherContact_mobile')
              .value !== null
              ? this.cardCustomerOtherContactForm.get('otherContact_mobile')
                  .value
              : '',
          eMail: this.cardCustomerOtherContactForm.get('otherContact_eMail')
            .value,
          isHomeVisitDefault: false,
          countryCode: 'AUS',
          rowGuid:
            this.customer && this.customer.addresses
              ? this.customer.addresses[this.otherContactIndex]
                ? this.customer.addresses[this.otherContactIndex].rowGuid
                : '00000000-0000-0000-0000-000000000000'
              : '00000000-0000-0000-0000-000000000000'
        }
      : {};
    if (
      this.isNewForm ||
      this.otherContactIndex === 0 ||
      this.otherContactIndex === -1
    ) {
      delete otherContactPhones.rowGuid;
    }
    if (this.localAddresses[1].addressLine1 !== null) {
      mailingAddress = {
        isHomeAddress: false,
        isMailingDefault: true,
        isInvoiceDefault: false,
        isOtherContact: false,
        address: [
          this.localAddresses[1].addressLine1,
          this.localAddresses[1].addressLine2
        ],
        city: this.localAddresses[1].city,
        // city: this.localAddresses[1].city,
        stateCode: this.localAddresses[1].stateCode,
        countryCode: 'AUS',
        // locality: this.localAddresses[1].locality,
        /*this.cardCustomerAddressForm.get('city').value,*/
        /*this.cardCustomerAddressForm.get('stateCode').value*/
        zipCode: this.localAddresses[1]
          .zipCode /*this.cardCustomerAddressForm.get('zipCode').value*/,
        poBox: null,
        isHomeVisitDefault: false,
        rowGuid: this.localAddresses[1].rowGuid
      };
    }
    // if (this.isNewForm || !this.customer.addresses[this.mailingAddressIndex]) { delete mailingAddress.rowGuid; }
    if (this.localAddresses[2].addressLine1 !== null) {
      invoiceAddress = {
        isHomeAddress: false,
        isMailingDefault: false,
        isInvoiceDefault: true,
        isOtherContact: false,
        address: [
          this.localAddresses[2].addressLine1,
          this.localAddresses[2].addressLine2
        ],
        city: this.localAddresses[2].city,
        // city: this.localAddresses[2].city,
        stateCode: this.localAddresses[2].stateCode,
        // locality: this.localAddresses[2].locality,
        countryCode: 'AUS',
        /*this.cardCustomerAddressForm.get('city').value,*/
        /*this.cardCustomerAddressForm.get('stateCode').value*/
        zipCode: this.localAddresses[2]
          .zipCode /*this.cardCustomerAddressForm.get('zipCode').value*/,
        poBox: null,
        isHomeVisitDefault: false,
        rowGuid: this.localAddresses[2].rowGuid
      };
      // if (this.isNewForm || !this.customer.addresses[this.invoiceAddressIndex]) { delete invoiceAddress.rowGuid; }
    }
    if (this.localAddresses[3].addressLine1 !== null) {
      homeVisitInfoAddress = {
        isHomeAddress: false,
        isMailingDefault: false,
        isInvoiceDefault: false,
        isOtherContact: false,
        isHomeVisitDefault: true,
        address: [
          this.localAddresses[3].addressLine1,
          this.localAddresses[3].addressLine2
        ],
        city: this.localAddresses[3].city,
        // city: this.localAddresses[3].city,
        stateCode: this.localAddresses[3].stateCode,
        countryCode: 'AUS',
        // locality: this.localAddresses[3].locality,
        zipCode: this.localAddresses[3]
          .zipCode /*this.cardCustomerAddressForm.get('zipCode').value*/,
        rowGuid: this.localAddresses[3].rowGuid
      };
      // if (this.isNewForm || !this.customer.addresses[this.homeVisitInfosIndex]) { delete homeVisitInfoAddress.rowGuid; }
    }
    this.cCustAddressData = {
      addresses: [
        {
          isHomeAddress: true,
          isMailingDefault:
            this.localAddresses[1].addressLine1 !== null ? false : true,
          isInvoiceDefault:
            this.localAddresses[2].addressLine1 !== null ? false : true,
          isHomeVisitDefault:
            this.localAddresses[3].addressLine1 !== null ? false : true,
          isOtherContact: false,
          address: [
            this.localAddresses[0].addressLine1,
            this.localAddresses[0].addressLine2
          ],
          city: this.localAddresses[0].city,
          // city: this.localAddresses[0].city,
          stateCode: this.localAddresses[0].stateCode,
          countryCode: 'AUS',
          // locality: this.localAddresses[0].locality,
          zipCode: this.localAddresses[0]
            .zipCode /*this.cardCustomerAddressForm.get('zipCode').value*/,
          rowGuid: this.localAddresses[0].rowGuid,
          poBox: null,
          phones: [
            this.cardCustomerContactForm
              .get('customerPhone')
              .get('customerHomePhone').value !== null
              ? this.cardCustomerContactForm
                  .get('customerPhone')
                  .get('customerHomePhone').value
              : '',
            this.cardCustomerContactForm
              .get('customerPhone')
              .get('customerWorkPhone').value !== null
              ? this.cardCustomerContactForm
                  .get('customerPhone')
                  .get('customerWorkPhone').value
              : '',
            this.cardCustomerContactForm
              .get('customerPhone')
              .get('customerOtherPhone').value !== null
              ? this.cardCustomerContactForm
                  .get('customerPhone')
                  .get('customerOtherPhone').value
              : ''
          ],
          mobile:
            this.cardCustomerContactForm
              .get('customerPhone')
              .get('customerMobile').value !== null
              ? this.cardCustomerContactForm
                  .get('customerPhone')
                  .get('customerMobile').value
              : '',
          eMail: this.cardCustomerContactForm.get('customerEmail').value
        },
        { ...mailingAddress },
        { ...invoiceAddress },
        { ...homeVisitInfoAddress },
        { ...otherContactPhones }
      ]
    };
    if (this.isNewForm) {
      delete this.cCustAddressData.addresses[0].rowGuid;
    }
  }

  assignObjCustomer() {
    Object.assign(this.objCustomer, {
      ...this.cCustContactData,
      ...this.cCustIdentityData,
      ...this.cCustAddressData,
      ...this.cCustAccountData
    });
    delete this.objCustomer['age'];
  }

  assignObjAddress() {
    Object.assign(this.objAddress, {
      ...this.cCustAddressData
    });
  }
  /* TODO: MOVE INTO UTILS */
  emailValidator(control: AbstractControl): { [key: string]: any } | null {
      const nameRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!control.value) {
        return null;
      }
      const valid = nameRe.test(control.value);
      return !valid ? { forbiddenEmail: { value: control.value } } : null;
  }

  /* TODO: MOVE INTO UTILS */
  getPhoneRegexValue(phoneNumber): boolean {
    const onlyNumbersRegex = /^(\s*|[0-9]{10})$/;
    return onlyNumbersRegex.test(phoneNumber);
  }

  /* TODO: MOVE INTO UTILS */
  getMobilePhoneRegexValue(phoneNumber): boolean {
    const onlyNumbersRegex = /^04\d{8}$/;
    return onlyNumbersRegex.test(phoneNumber);
  }

  /* TODO: MOVE INTO UTILS */
  getHomePhoneRegexValue(phoneNumber): boolean {
    const onlyNumbersRegex = /^([0][0-9]{9})$/;
    return onlyNumbersRegex.test(phoneNumber);
  }

  /* TODO: MOVE INTO UTILS */
  getEmailRegexValue(email): boolean {
    const validEmailRegex = /^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+([;.](([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+)*$/;
    return validEmailRegex.test(email);
  }

  /* TODO: MOVE INTO UTILS */
  otherContactRecallMethodValidation() {
    const otherContactEmail = this.cardCustomerOtherContactForm.get(
      'otherContact_eMail'
    );
    const otherContactMobile = this.cardCustomerOtherContactForm.get(
      'otherContact_mobile'
    );
    const otherContactWorkHomePhone = this.cardCustomerOtherContactForm.get(
      'otherContact_workHomePhone'
    );

    const emailValue =
      this.cardCustomerOtherContactForm.get('otherContact_eMail').value === null
        ? ''
        : this.cardCustomerOtherContactForm.get('otherContact_eMail').value;
    const mobileValue =
      this.cardCustomerOtherContactForm.get('otherContact_mobile').value ===
      null
        ? ''
        : this.cardCustomerOtherContactForm.get('otherContact_mobile').value;
    const workHomePhoneValue =
      this.cardCustomerOtherContactForm.get('otherContact_workHomePhone')
        .value === null
        ? ''
        : this.cardCustomerOtherContactForm.get('otherContact_workHomePhone')
            .value;

    const customerMobileHasTenChars =
      mobileValue && mobileValue.length === 10 ? true : false;
    const customerHomePhoneHasTenChars =
      workHomePhoneValue && workHomePhoneValue.length === 10 ? true : false;

    const hasAtLeastOnePhone = mobileValue || workHomePhoneValue;
    const hasAtLeatOnePhoneCharsAsTen =
      customerMobileHasTenChars || customerHomePhoneHasTenChars;

    const otherContactMailIsValid = this.getEmailRegexValue(emailValue)
      ? true
      : false;
    const otherContactMobileIsValid =
      hasAtLeastOnePhone &&
      hasAtLeatOnePhoneCharsAsTen &&
      this.getMobilePhoneRegexValue(mobileValue)
        ? true
        : false;
    const otherContactWorkHomePhoneIsValid =
      hasAtLeastOnePhone &&
      hasAtLeatOnePhoneCharsAsTen &&
      this.getHomePhoneRegexValue(workHomePhoneValue)
        ? true
        : false;

    const areFieldsValid =
      otherContactMailIsValid ||
      otherContactMobileIsValid ||
      otherContactWorkHomePhoneIsValid
        ? true
        : false;
    if (areFieldsValid) {
      if (!otherContactMailIsValid) {
        if (this.cardCustomerOtherContactForm) {
          this.cardCustomerOtherContactForm.controls[
            'otherContact_eMail'
          ].setErrors({ invalidEmail: true });
        }
      }

      if (otherContactMobileIsValid) {
        if (this.cardCustomerOtherContactForm) {
          if (emailValue === '') {
            this.cardCustomerOtherContactForm.controls[
              'otherContact_eMail'
            ].setErrors(null);
          }
          this.cardCustomerOtherContactForm.controls[
            'otherContact_mobile'
          ].setErrors(null);
        }
      } else {
        if (this.cardCustomerOtherContactForm) {
          if (
            (otherContactMailIsValid || otherContactWorkHomePhoneIsValid) &&
            mobileValue === ''
          ) {
            this.cardCustomerOtherContactForm.controls[
              'otherContact_mobile'
            ].setErrors(null);
          } else {
            this.cardCustomerOtherContactForm.controls[
              'otherContact_mobile'
            ].setErrors({ invalidMobile: true });
          }
        }
      }

      if (otherContactWorkHomePhoneIsValid) {
        if (this.cardCustomerOtherContactForm) {
          if (emailValue === '') {
            this.cardCustomerOtherContactForm.controls[
              'otherContact_eMail'
            ].setErrors(null);
          }
          this.cardCustomerOtherContactForm.controls[
            'otherContact_workHomePhone'
          ].setErrors(null);
        }
      } else {
        if (this.cardCustomerOtherContactForm) {
          if (
            (otherContactMailIsValid || otherContactMobileIsValid) &&
            workHomePhoneValue === ''
          ) {
            this.cardCustomerOtherContactForm.controls[
              'otherContact_workHomePhone'
            ].setErrors(null);
          } else {
            this.cardCustomerOtherContactForm.controls[
              'otherContact_workHomePhone'
            ].setErrors({ invalidHomePhone: true });
          }
        }
      }
    } else {
      otherContactEmail.setErrors({ atLeastOneFieldValid: true });
      otherContactMobile.setErrors({ atLeastOneFieldValid: true });
      otherContactWorkHomePhone.setErrors({ atLeastOneFieldValid: true });
    }

    if (!this.contactPreferredIsOtherOne) {
      otherContactEmail.setErrors(null);
      otherContactMobile.setErrors(null);
      otherContactWorkHomePhone.setErrors(null);
    }
  }

  /* TODO: MOVE INTO UTILS */
  validateCustomerPhone(form) {
    const hasCustomerMobile =
      form.get('customerMobile').value === null
        ? ''
        : form.get('customerMobile').value;
    const hasCustomerHomePhone =
      form.get('customerHomePhone').value === null
        ? ''
        : form.get('customerHomePhone').value;
    const hasCustomerWorkPhone =
      form.get('customerWorkPhone').value === null
        ? ''
        : form.get('customerWorkPhone').value;
    const hasCustomerOtherPhone =
      form.get('customerOtherPhone').value === null
        ? ''
        : form.get('customerOtherPhone').value;

    const hasAtLeastOneValidPhonePattern =
      this.getPhoneRegexValue(hasCustomerMobile) ||
      this.getPhoneRegexValue(hasCustomerHomePhone) ||
      this.getPhoneRegexValue(hasCustomerWorkPhone) ||
      this.getPhoneRegexValue(hasCustomerOtherPhone)
        ? true
        : false;
    const hasAtLeastOnePhone =
      hasCustomerMobile ||
      hasCustomerHomePhone ||
      hasCustomerWorkPhone ||
      hasCustomerOtherPhone;

    const customerMobileHasTenChars =
      hasCustomerMobile && hasCustomerMobile.length === 10 ? true : false;
    const customerHomePhoneHasTenChars =
      hasCustomerHomePhone && hasCustomerHomePhone.length === 10 ? true : false;
    const customerWorkPhoneHasTenChars =
      hasCustomerWorkPhone && hasCustomerWorkPhone.length === 10 ? true : false;
    const customerOtherPhoneHasTenChars =
      hasCustomerOtherPhone && hasCustomerOtherPhone.length === 10
        ? true
        : false;
    const hasAtLeatOnePhoneCharsAsTen =
      customerMobileHasTenChars ||
      customerHomePhoneHasTenChars ||
      customerWorkPhoneHasTenChars ||
      customerOtherPhoneHasTenChars;

    const validCustomerMobile =
      this.getMobilePhoneRegexValue(hasCustomerMobile) &&
      hasAtLeastOnePhone &&
      hasAtLeatOnePhoneCharsAsTen
        ? true
        : false;
    const validCustomerHomePhone =
      this.getHomePhoneRegexValue(hasCustomerHomePhone) &&
      hasAtLeastOnePhone &&
      hasAtLeatOnePhoneCharsAsTen
        ? true
        : false;
    const validCustomerWorkPhone =
      this.getPhoneRegexValue(hasCustomerWorkPhone) &&
      hasAtLeastOnePhone &&
      hasAtLeatOnePhoneCharsAsTen
        ? true
        : false;
    const validCustomerOtherPhone =
      this.getPhoneRegexValue(hasCustomerOtherPhone) &&
      hasAtLeastOnePhone &&
      hasAtLeatOnePhoneCharsAsTen
        ? true
        : false;

    if (
      ( hasAtLeastOnePhone &&
      hasAtLeatOnePhoneCharsAsTen &&
      hasAtLeastOneValidPhonePattern )
    ) {
      if (this.cardCustomerContactForm.controls['customerPhone']) {
        this.cardCustomerContactForm.controls['customerEmail'].setErrors(null);
        this.customerPhoneGroup.controls['customerOtherPhone'].setErrors(null);
        this.customerPhoneGroup.controls['customerMobile'].setErrors(null);
        this.customerPhoneGroup.controls['customerHomePhone'].setErrors(null);
        this.customerPhoneGroup.controls['customerWorkPhone'].setErrors(null);
      }
    } else {
      if (this.cardCustomerContactForm.controls['customerPhone']) {
        if (this.cardCustomerContactForm.controls['customerEmail'].value === '') { this.cardCustomerContactForm.controls['customerEmail'].setErrors({email: true}); }
        this.customerPhoneGroup.controls['customerMobile'].setErrors({
          atLeastOnePhoneValid: true
        });
        this.customerPhoneGroup.controls['customerHomePhone'].setErrors({
          atLeastOnePhoneValid: true
        });
        this.customerPhoneGroup.controls['customerWorkPhone'].setErrors({
          atLeastOnePhoneValid: true
        });
        this.customerPhoneGroup.controls['customerOtherPhone'].setErrors({
          atLeastOnePhoneValid: true
        });
      }
    }
    if (validCustomerMobile) {
      if (this.cardCustomerContactForm.controls['customerPhone']) {
        this.customerPhoneGroup.controls['customerMobile'].setErrors(null);
      }
    } else {
      if (this.cardCustomerContactForm.controls['customerPhone']) {
        this.customerPhoneGroup.controls['customerMobile'].setErrors({
          customerMobileInvalid: true,
          atLeastOnePhoneValid: true
        });
        if (
          (hasAtLeastOnePhone &&
          hasAtLeatOnePhoneCharsAsTen &&
          hasAtLeastOneValidPhonePattern)
        ) {
          this.cardCustomerContactForm.controls['customerEmail'].setErrors(null);
          this.removeError(
            this.customerPhoneGroup.controls['customerMobile'],
            'atLeastOnePhoneValid'
          );
        }
        if (hasCustomerMobile === '') {
          this.removeError(
            this.customerPhoneGroup.controls['customerMobile'],
            'customerMobileInvalid'
          );
        }
        if (validCustomerHomePhone) {
          this.removeError(
            this.customerPhoneGroup.controls['customerHomePhone'],
            'customerHomePhoneInvalid'
          );
        }
        if (validCustomerWorkPhone) {
          this.removeError(
            this.customerPhoneGroup.controls['customerWorkPhone'],
            'customerWorkPhoneInvalid'
          );
        }
        if (validCustomerOtherPhone) {
          this.removeError(
            this.customerPhoneGroup.controls['customerOtherPhone'],
            'customerOtherPhoneInvalid'
          );
        }
      }
    }
    if (validCustomerHomePhone) {
      if (this.cardCustomerContactForm.controls['customerPhone']) {
        this.customerPhoneGroup.controls['customerHomePhone'].setErrors(null);
      }
    } else {
      if (this.cardCustomerContactForm.controls['customerPhone']) {
        this.customerPhoneGroup.controls['customerHomePhone'].setErrors({
          customerHomePhoneInvalid: true,
          atLeastOnePhoneValid: true
        });
        if (
          ( hasAtLeastOnePhone &&
            hasAtLeatOnePhoneCharsAsTen &&
            hasAtLeastOneValidPhonePattern )
        ) {
          this.cardCustomerContactForm.controls['customerEmail'].setErrors(null);
          this.removeError(
            this.customerPhoneGroup.controls['customerHomePhone'],
            'atLeastOnePhoneValid'
          );
        }
        if (hasCustomerHomePhone === '') {
          this.removeError(
            this.customerPhoneGroup.controls['customerHomePhone'],
            'customerHomePhoneInvalid'
          );
        }
        if (validCustomerMobile) {
          this.removeError(
            this.customerPhoneGroup.controls['customerMobile'],
            'customerMobileInvalid'
          );
        }
        if (validCustomerWorkPhone) {
          this.removeError(
            this.customerPhoneGroup.controls['customerWorkPhone'],
            'customerWorkPhoneInvalid'
          );
        }
        if (validCustomerOtherPhone) {
          this.removeError(
            this.customerPhoneGroup.controls['customerOtherPhone'],
            'customerOtherPhoneInvalid'
          );
        }
      }
    }
    if (validCustomerWorkPhone) {
      if (this.cardCustomerContactForm.controls['customerPhone']) {
        this.customerPhoneGroup.controls['customerWorkPhone'].setErrors(null);
      }
    } else {
      if (this.cardCustomerContactForm.controls['customerPhone']) {
        this.customerPhoneGroup.controls['customerWorkPhone'].setErrors({
          customerWorkPhoneInvalid: true,
          atLeastOnePhoneValid: true
        });
        if (
          ( hasAtLeastOnePhone &&
            hasAtLeatOnePhoneCharsAsTen &&
            hasAtLeastOneValidPhonePattern )
        ) {
          this.cardCustomerContactForm.controls['customerEmail'].setErrors(null);
          this.removeError(
            this.customerPhoneGroup.controls['customerWorkPhone'],
            'atLeastOnePhoneValid'
          );
        }
        if (hasCustomerWorkPhone === '') {
          this.removeError(
            this.customerPhoneGroup.controls['customerWorkPhone'],
            'customerWorkPhoneInvalid'
          );
        }
        if (validCustomerMobile) {
          this.removeError(
            this.customerPhoneGroup.controls['customerMobile'],
            'customerMobileInvalid'
          );
        }
        if (validCustomerHomePhone) {
          this.removeError(
            this.customerPhoneGroup.controls['customerHomePhone'],
            'customerHomePhoneInvalid'
          );
        }
        if (validCustomerOtherPhone) {
          this.removeError(
            this.customerPhoneGroup.controls['customerOtherPhone'],
            'customerOtherPhoneInvalid'
          );
        }
      }
    }
    if (validCustomerOtherPhone) {
      if (this.cardCustomerContactForm.controls['customerPhone']) {
        this.customerPhoneGroup.controls['customerOtherPhone'].setErrors(null);
      }
    } else {
      if (this.cardCustomerContactForm.controls['customerPhone']) {
        this.customerPhoneGroup.controls['customerOtherPhone'].setErrors({
          customerOtherPhoneInvalid: true,
          atLeastOnePhoneValid: true
        });
        if (
          ( hasAtLeastOnePhone &&
            hasAtLeatOnePhoneCharsAsTen &&
            hasAtLeastOneValidPhonePattern )
        ) {
          this.cardCustomerContactForm.controls['customerEmail'].setErrors(null);
          this.removeError(
            this.customerPhoneGroup.controls['customerOtherPhone'],
            'atLeastOnePhoneValid'
          );
        }
        if (hasCustomerOtherPhone === '') {
          this.removeError(
            this.customerPhoneGroup.controls['customerOtherPhone'],
            'customerOtherPhoneInvalid'
          );
        }
        if (validCustomerMobile) {
          this.removeError(
            this.customerPhoneGroup.controls['customerMobile'],
            'customerMobileInvalid'
          );
        }
        if (validCustomerHomePhone) {
          this.removeError(
            this.customerPhoneGroup.controls['customerHomePhone'],
            'customerHomePhoneInvalid'
          );
        }
        if (validCustomerWorkPhone) {
          this.removeError(
            this.customerPhoneGroup.controls['customerWorkPhone'],
            'customerWorkPhoneInvalid'
          );
        }
      }
    }
  }

  async openInfoModal() {
    if (!this.modalFlag) {
      this.modalFlag = true;
      const clinicAddress = await this.commonService
        .getClinicAddress(this.customer.shopCode)
        .toPromise();
      const initialState = {
        clinicDetails: {
          addressData: clinicAddress,
          clinicName: this.getClinicName()
        }
      };
      this.bsModalRef = this.modalService.show(InfoModalComponent, {
        class: 'modal-dialog modal-dialog-centered modal-lg',
        initialState
      });
    }
  }

  clearCustomer() {
    this.api.updateCustomer(null);
  }


  /* TODO: MOVE INTO UTILS */
  alphaOnly(event) {
    const key = event.keyCode;
    return (key >= 65 && key <= 90) || key == 8;
  }

  removeError(control: AbstractControl, error: string) {
    const err = control.errors; // get control errors
    if (err) {
      delete err[error]; // delete your own error
      if (!Object.keys(err).length) {
        // if no errors left
        control.setErrors(null); // set control errors to null making it VALID
      } else {
        control.setErrors(err); // controls got other errors so set them back
      }
    }
  }
}
