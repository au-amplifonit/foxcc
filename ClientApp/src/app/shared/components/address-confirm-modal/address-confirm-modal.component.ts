import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerApiService } from 'src/app/core/services/api/customer/customer-api.service';

@Component({
  selector: 'fcw-address-confirm-modal',
  templateUrl: './address-confirm-modal.component.html',
  styleUrls: ['./address-confirm-modal.component.scss']
})
export class AddressConfirmModalComponent implements OnInit {

  public data: any;
  public Addressform: FormGroup;


  constructor(public bsModalRef: BsModalRef, private formBuilder: FormBuilder, private customerApi: CustomerApiService) { }

  ngOnInit() {
    this.Addressform = this.formBuilder.group({
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      locality: [''],
      city: ['',Validators.required],
      stateCode: ['',Validators.required],
      zipCode: ['',Validators.required]
    });
    this.Addressform.patchValue(this.data);
  }

  onConfirm() {
    const { addressLine1, addressLine2, city, stateCode, zipCode } = this.Addressform.value;
    const payload = {
      customerCode: 'string',
      addressCounter: 0,
      isHomeAddress: true,
      isMailingDefault: true,
      isInvoiceDefault: true,
      isOtherContact: true,
      address: [addressLine1, addressLine2],
      countryCode: 'AUS',
      areaCode: null,
      zipCode: zipCode,
      city: city,
      locality: null,
      poBox: null,
      phones: [],
      mobile: '',
      eMail: '',
      isHomeVisitDefault: true,
      homeVisitContactName: '',
      stateCode: stateCode,
      rowGuid: '00000000-0000-0000-0000-000000000000'
    };
    this.customerApi.addNewAddress(payload)
    .subscribe(() => {
      this.customerApi.addressShare(this.Addressform.value);
      this.bsModalRef.hide();
    });
  }

}
