export interface LastHAItemHistory {
  productCode: string;
  serialNumber: string;
  side: string;
  fittingDate: string;
  productCommercialDescription: string;
  productDescription: string;
  sideDescription: string;
  rowGuid: string;
}

export interface MainAddress {
  customerCode: string;
  addressCounter: number;
  isMailingDefault: boolean;
  isInvoiceDefault: boolean;
  isOtherContact: boolean;
  address: string[];
  countryCode: string;
  areaCode: string;
  zipCode: string;
  city: string;
  locality: string;
  poBox: string;
  phones: string[];
  mobile: string;
  eMail: string;
  isPreferred: boolean;
  preferredContactMethod: number;
  isHomeVisitDefault: boolean;
  homeVisitContactName: string;
  stateCode: string;
  rowGuid: string;
}

export interface CustomerListItem {
	id: string;
	xid: string;
  isLead: boolean;
  firstname: string;
  lastname: string;
  genderCode: 'M' | 'F' | 'U' | '';
  salutationCode: '001' | '002' | '003' | '004' | '005';
  birthday: string | Date;
  fundingType: string;
  // the space on '04 ' is not an error, it is how it is represented in the DB
  statusCode: '00' | '01' | '02' | '03' | '04 ' | '05';
  lastHAItemHistory: LastHAItemHistory[];
  practiceName: string;
  practitionerNumber: string;
  practitionerName: string;
  genderDescription: 'MALE'| 'FEMALE' | 'UNSPECIFIED' | '';
  statusDescription: string;
  salutationDescription: '' |'Mr' | 'Mrs' | 'Miss' | 'Ms';
  mainAddress: MainAddress;
  age: number;
  rowGuid: string;
}

export interface CustomerList {
  recordCount: number;
  pageCount: number;
  pageRequested: number;
  pageItems: CustomerListItem[];
}

/* for /customers/:id  GET */
export interface Address {
  customerCode: string;
  addressCounter: number;
  isHomeAddress: boolean;
  isMailingDefault: boolean;
  isInvoiceDefault: boolean;
  isOtherContact: boolean;
  address: string[];
  countryCode: string;
  // areaCode: string;
  zipCode: string;
  city: string;
  locality: string;
  poBox: string;
  phones: string[];
  mobile: string;
  eMail: string;
  preferredContactMethod: number;
  isHomeVisitDefault: boolean;
  homeVisitContactName: string;
  stateCode: string;
  rowGuid: string;
}

export interface Customer {
  id: string;
  firstname: string;
  lastname: string;
  birthday: string | Date;
  fundingType: string;
  statusCode: string;
  practiceName: string;
  practitionerNumber: string;
  practitionerName: string;
  age: number;
  middleName: string;
  preferredName: string;
  otherContact_Firstname: string;
  otherContact_Lastname: string;
  relation: string;
  genderCode: string;
  birthPlace: string;
  tax_ID_Number: string;
  titleCode: string;
  salutationCode: string;
  allowPrivacy: boolean;
  allowSensData: boolean;
  allowAdvertising: boolean;
  allowProfiling: boolean;
  statusUpdateDate: string;
  categoryCode: string;
  customerTypeCode: string;
  customerTypeUpdateDate: string;
  occupationCode: string;
  occupationOther: string;
  isRetired: boolean;
  practiceCode: string;
  practitionerCode: string;
  languageCode: string;
  preferredContactMethod: number;
  isOtherContactPreferred: boolean;
  preferredTimeOfContactCode: string;
  genderDescription: string;
  titleDescription: string;
  salutationDescription: string;
  statusDescription: string;
  categoryDescription: string;
  customerTypeDescription: string;
  occupationDescription: string;
  languageDescription: string;
  preferredTimeOfContactDescription: string;
  addresses: Address[];
  lastHAItemHistory: LastHAItemHistory[];
  shopCode: string;
  rowGuid: string;
  shopDescription?: string;
  sourceCode?: string;
  subsourceCode?: string;
  referralSourceCode?: string;
  callID?: string;
}
/* for /customers/:id  GET */


/*
 *
# Description:
- lastname  	    string
- customerCode  	string
- voucherID	      string
- phoneNumber	    string
- birthdate	      string($date-time)
- pageSize	      integer($int32) [Default value : 20]
- pageNumber	    integer($int32)
- SortAscending   boolean
 * */

export interface CustParam {

  firstname?: string;
  lastname?: string;
  customerCode?: string;
  voucherID?: string;
  phoneNumber?: string;
  birthdate?: string;
  pageSize?: string;
  pageNumber?: string;

  pageCount?: string;
  pageRequested?: string;
  recordCount?: string;
  SortAscending?: string;
}

/*
#  range of  statusCodes
00    Active
01    Deceased
02    Transferred
03    Uncontactable
04    Do Not Contact
05    Deleted
10    Active Lead
30    Lead Converted
*/

