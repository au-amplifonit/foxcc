import {Clinic} from '../../shared/models/clinic.model';

export abstract class AppDetConstants {
  static readonly SALUTATIONLIST = [
    {
      code: '001',
      description: 'Dr',
      rowGuid: '37273d42-2f66-4a81-9933-b67e758e3c1e',
    },
    {
      code: '002',
      description: 'Mr',
      rowGuid: '6579ec8b-6420-48c8-92ba-70cb273b9d5c',
    },
    {
      code: '003',
      description: 'Mrs',
      rowGuid: '17c6ae2a-dd22-4f93-9499-fa8f4725e26c',
    },
    {
      code: '004',
      description: 'Miss',
      rowGuid: 'ce873dbe-6282-4139-a65f-e1d19e51080a',
    },
    {
      code: '005',
      description: 'Ms',
      rowGuid: '029f9f12-f368-4225-8a1e-6c45c628a791',
    },
    {
      code: '006',
      description: 'Brother',
      rowGuid: '32e3a55a-926f-4271-8198-40eb959da069',
    },
    {
      code: '007',
      description: 'Sir',
      rowGuid: '45109a08-b347-4e43-87cc-658fd2ce7c5a',
    },
    {
      code: '008',
      description: 'Sister',
      rowGuid: '6c7ceca5-f9ed-4c22-bfff-f2a93b4b5345',
    },
    {
      code: '009',
      description: 'Rev',
      rowGuid: '1df37422-6420-4fe7-9c78-1de15eaa7f59',
    },
    {
      code: '010',
      description: 'Prof',
      rowGuid: 'd5f25ca6-e8af-4efd-8643-1dc8ccdae1a5',
    },
    {
      code: '011',
      description: 'Fr',
      rowGuid: '3b84f956-42d0-4b64-b370-58f79d0d544d',
    },
    {
      code: '999',
      description: 'unspecified',
      rowGuid: '',
    },
  ];
  static readonly LANGUAGELIST = [
    {
      code: 'af-ZA',
      description: 'African',
      rowGuid: '99e33e1e-9f31-4c9b-ad7d-f396ae4dd214',
    },
    {
      code: 'ar-AE',
      description: 'Arabic',
      rowGuid: 'a3d9495f-25b0-4ba3-9bda-0a3764bcdb40',
    },
    {
      code: 'au-AS',
      description: 'Austrian',
      rowGuid: '1b38ecd8-60cf-4327-b533-92123daccdc4',
    },
    {
      code: 'bg-BG',
      description: 'Bulgarian',
      rowGuid: 'f8567b83-8027-4a95-b062-f2d5375ca12e',
    },
    {
      code: 'br-BR',
      description: 'Burmese',
      rowGuid: 'c7db2f4d-d61c-4917-bfcd-6a22dbe57d8a',
    },
    {
      code: 'bs-BS',
      description: 'Bosnian',
      rowGuid: 'd1be59a4-7aba-4fd9-8bb4-6c9fa388a8de',
    },
    {
      code: 'bv-BV',
      description: 'Bavarian',
      rowGuid: 'dff77fa0-97d8-4a0a-8f69-559588001891',
    },
    {
      code: 'cm-CB',
      description: 'Cambodian',
      rowGuid: '185dc460-9d83-409f-8bbc-a606d69bc3a3',
    },
    {
      code: 'cn-CT',
      description: 'Cantonese',
      rowGuid: '3133c4b3-7c39-487e-8ce5-2cb7873b3f2e',
    },
    {
      code: 'cs-CZ',
      description: 'Czech',
      rowGuid: 'ae7df7a8-e338-4b0b-9182-6220047a5cdd',
    },
    {
      code: 'da-DK',
      description: 'Danish',
      rowGuid: '37d54ade-4e6e-4f1e-898d-7bdf84c0582c',
    },
    {
      code: 'de-DE',
      description: 'German',
      rowGuid: 'e163e954-0b1b-4b20-a091-07263f2a15bf',
    },
    {
      code: 'el-GR',
      description: 'Greek',
      rowGuid: '55575b23-d5cd-43af-a68e-02bee81fdfcb',
    },
    {
      code: 'en-AU',
      description: 'English-AU',
      rowGuid: 'ea177b6c-ee00-4a98-82c0-a3f7d7f160b9',
    },
    {
      code: 'en-US',
      description: 'English',
      rowGuid: 'f28fd305-fa5a-45d6-b21f-e10f014f8062',
    },
    {
      code: 'es-ES',
      description: 'Spanish',
      rowGuid: 'deabdb99-01b1-496d-a3bc-ad1bc6f5cacb',
    },
    {
      code: 'fa-IR',
      description: 'Farsi',
      rowGuid: '2f56cb10-688e-41cd-ba82-5f211901da94',
    },
    {
      code: 'fj-FJ',
      description: 'Fijian',
      rowGuid: 'f8d63820-f70f-4295-9519-0ac392b2a1f5',
    },
    {
      code: 'fl-FP',
      description: 'Filipino',
      rowGuid: 'f34cd827-060b-4e98-b3e2-5924b2b74d6b',
    },
    {
      code: 'fr-FR',
      description: 'French',
      rowGuid: 'bc6a80a8-6225-40c5-9d36-98bfbd737d3e',
    },
    {
      code: 'he-IL',
      description: 'Hebrew',
      rowGuid: 'f3383245-dce4-4160-a3ee-2a97aac1dcb0',
    },
    {
      code: 'hi-IN',
      description: 'Hindi',
      rowGuid: '878d0b22-5bfa-468b-9c6d-0d2446d86756',
    },
    {
      code: 'hk-HK',
      description: 'Hakka',
      rowGuid: 'f7498175-a548-4980-a3b2-7c6033710363',
    },
    {
      code: 'hr-HR',
      description: 'Croatian',
      rowGuid: 'bde9e4ef-fe73-489a-80e3-90f193a4bce8',
    },
    {
      code: 'hu-HU',
      description: 'Hungarian',
      rowGuid: '7982d859-1a90-42d6-80ba-6d5a60fea327',
    },
    {
      code: 'id-ID',
      description: 'Indonesian',
      rowGuid: '1ff5cc6b-626b-4b9b-ba05-1858bea298ac',
    },
    {
      code: 'in-ID',
      description: 'Indian',
      rowGuid: 'caba4c73-20d4-4070-aa30-31403a81f3db',
    },
    {
      code: 'in-NE',
      description: 'Nepali',
      rowGuid: '02d864e1-ea8d-4a21-8e54-6ae5a5f0024e',
    },
    {
      code: 'it-IT',
      description: 'Italiano',
      rowGuid: 'ffd88f43-b9c2-4c62-9015-2de851c5057a',
    },
    {
      code: 'ja-JP',
      description: 'Japanese',
      rowGuid: 'cb622467-e967-4828-b83f-8562af04e7dd',
    },
    {
      code: 'kn-IN',
      description: 'Kannada',
      rowGuid: '8b01ac75-ce4e-42a9-8d97-ac8c79f27130',
    },
    {
      code: 'ko-KR',
      description: 'Korean',
      rowGuid: '3df6f4fd-3714-46ef-8c7d-b511205ff5df',
    },
    {
      code: 'lb-LB',
      description: 'Lebanese',
      rowGuid: 'eda3bc5c-ce68-4289-966d-34f885183ed1',
    },
    {
      code: 'lo-LO',
      description: 'Lao',
      rowGuid: '0e8d21e9-30c1-45b6-a342-273d4aa95894',
    },
    {
      code: 'Lt-sr',
      description: 'Serbian',
      rowGuid: '28c6318b-fdd6-4d3d-b153-35d88e47112b',
    },
    {
      code: 'mc-MD',
      description: 'Macedonian',
      rowGuid: 'db55eb86-bdcb-4256-a1b4-59a9e63fca3c',
    },
    {
      code: 'ml-MT',
      description: 'Maltese',
      rowGuid: 'f8cecce0-301f-491d-a551-dad07cb9d760',
    },
    {
      code: 'mn-CN',
      description: 'Mandarin',
      rowGuid: '356d2b5c-533f-4228-a22f-3bd816c36c03',
    },
    {
      code: 'ms-MY',
      description: 'Malay',
      rowGuid: 'e6f8e2ea-d337-4fa9-889e-d05359321953',
    },
    {
      code: 'nl-BE',
      description: 'Dutch',
      rowGuid: '70db8759-74e4-40c3-b6be-7cab75b5cdd2',
    },
    {
      code: 'nt-NK',
      description: 'Not Known',
      rowGuid: '102dac17-4500-43a4-b7fc-e7ba66ae67cf',
    },
    {
      code: 'ot-OT',
      description: 'Other',
      rowGuid: '2c68ace0-4fba-407e-ab6b-6cedd46c5bfe',
    },
    {
      code: 'pa-IN',
      description: 'Punjabi',
      rowGuid: '155d83b1-dbb5-4327-8ec3-a2890a392b74',
    },
    {
      code: 'pl-PL',
      description: 'Polish',
      rowGuid: 'a27894b2-a42d-4a19-b16e-edfd3afeb159',
    },
    {
      code: 'pr-PS',
      description: 'Persian',
      rowGuid: '91ac50d4-a35e-446f-b1a0-ba19ded8c0a6',
    },
    {
      code: 'ps-PT',
      description: 'Pushto',
      rowGuid: '1db21fcd-ad4a-427a-bb11-286e37b55bea',
    },
    {
      code: 'pt-PT',
      description: 'Portuguese',
      rowGuid: '3acd90e9-2fca-43f5-b452-a11bd3a59b46',
    },
    {
      code: 'ro-RO',
      description: 'Romanian',
      rowGuid: '2272083f-fdf1-4d77-bc26-f7a1c98cf21a',
    },
    {
      code: 'ru-RU',
      description: 'Russian',
      rowGuid: '28a8e670-faf5-40ea-a968-12b46cfb8762',
    },
    {
      code: 'sg-MR',
      description: 'Mauritian',
      rowGuid: '1a0eeaf6-3b9b-49da-9793-104c42795a28',
    },
    {
      code: 'sk-SK',
      description: 'Slovak',
      rowGuid: 'e24ee56d-c36d-4878-a14c-676915b83efe',
    },
    {
      code: 'sm-SO',
      description: 'Samoan',
      rowGuid: 'e2bbfbc1-b2fa-4628-a547-51d3aa899be1',
    },
    {
      code: 'so-SM',
      description: 'Somali',
      rowGuid: 'bb623bc3-49aa-47ae-99a0-b9eb9e925c0e',
    },
    {
      code: 'sq-AL',
      description: 'Albanian',
      rowGuid: 'c6a3d762-e13d-40ba-9dd5-050de4a3a353',
    },
    {
      code: 'sr-SH',
      description: 'Sinhalese',
      rowGuid: 'ff875141-debd-4290-96e6-69a479ea21a3',
    },
    {
      code: 'sr-SR',
      description: 'Sri Lankan',
      rowGuid: '4824291e-9ec3-4adc-9a2c-660ae3b610cd',
    },
    {
      code: 'su-SD',
      description: 'Sudanese',
      rowGuid: 'ff7eb541-ca28-413e-a99d-4ec03af3f4e9',
    },
    {
      code: 'sv-SE',
      description: 'Swedish',
      rowGuid: '9000e264-32d9-4dc5-ac37-4de834f5635f',
    },
    {
      code: 'sw-KE',
      description: 'Swahili',
      rowGuid: 'd6cc19e7-5ff9-4d03-b511-ebd5972e73e9',
    },
    {
      code: 'ta-IN',
      description: 'Tamil',
      rowGuid: '0fdbe0fa-bdfe-48e4-a59b-de8df4e90782',
    },
    {
      code: 'tg-TG',
      description: 'Tongan',
      rowGuid: 'fa2aebe0-f248-46eb-914d-788359d3082c',
    },
    {
      code: 'tg-TL',
      description: 'Tagalog',
      rowGuid: '76398f86-7d67-4d05-a91c-3fa1e0cff930',
    },
    {
      code: 'th-TH',
      description: 'Thai',
      rowGuid: 'aa44c93d-a762-40e9-a7ae-1f4c884311ee',
    },
    {
      code: 'tr-TR',
      description: 'Turkish',
      rowGuid: '18628e7d-edc3-41f7-a88f-be7e94cea9c6',
    },
    {
      code: 'uk-UK',
      description: 'Ukranian',
      rowGuid: '5d1e8dbd-1495-4474-8fd1-7c5ffe75689b',
    },
    {
      code: 'ur-PK',
      description: 'Urdu',
      rowGuid: '1ed73340-4f11-44c7-bc6c-c9b4b81f31a9',
    },
    {
      code: 'vi-VN',
      description: 'Vietnamese',
      rowGuid: 'ead6ab57-f045-451c-9bd1-f80d8bf89f4a',
    },
    {
      code: 'yg-YG',
      description: 'Yugoslav',
      rowGuid: '7c2fc308-b38f-4058-9b9b-316e87b2518d',
    },
    {
      code: 'zh-CN',
      description: 'Chinese',
      rowGuid: '66d72091-e125-48bc-95b6-5915f9c3467b',
    },
    {
      code: 'U',
      description: 'Unspecified',
      rowGuid: '66d72091-e125-48bc-95b6-5915f9c3467b',
    }
  ];
  static readonly GENDERLIST = [
    {
      code: 'C',
      description: 'COMPANY',
      rowGuid: 'e937e1bd-d2f1-49dd-9abf-f2b68fe69684',
    },
    {
      code: 'F',
      description: 'FEMALE',
      rowGuid: 'd429d152-2a63-4309-9923-41ae2e1c02e1',
    },
    {
      code: 'M',
      description: 'MALE',
      rowGuid: 'd76ff0df-1186-4e6a-ac0e-ad1363d00dc1',
    },
    {
      code: 'U',
      description: 'UNSPECIFIED',
      rowGuid: '33422099-7749-4ccd-a888-455d17b3e53d',
    },
  ];
  static readonly TOCLIST = [
    {description: '9am-12pm', code: '01'},
    {description: '12pm-3pm', code: '02'},
    {description: '3pm-6pm', code: '03'},
    {description: 'after 6pm', code: '04'},
    {description: 'No Preferences', code: '05'}
  ];
  static readonly STATUSLIST = [
    {
      code: '00',
      description: 'Active',
      rowGuid: 'a3fc2d30-7709-4896-ab96-dfa793fe2324',
    },
    {
      code: '01',
      description: 'Deceased',
      rowGuid: 'da446b87-7572-468e-abd7-c2bd07269a12',
    },
    {
      code: '02',
      description: 'Transferred',
      rowGuid: '80ee7fac-cc40-4ba2-975c-ed97ea771db1',
    },
    {
      code: '03',
      description: 'Uncontactable',
      rowGuid: '30c28120-e027-491f-ba02-e4328df1fe89',
    },
    {
      code: '04',
      description: 'Do Not Contact',
      rowGuid: 'a46fe3f9-fa09-4a8e-a5a9-9fb89cfa080f',
    },
    {
      code: '05',
      description: 'Deleted',
      rowGuid: '9cdd28e2-92f7-4b2d-a301-14b8580e794e',
    },
    {
      code: '10',
      description: 'Active Lead',
      rowGuid: 'ac0b59e7-fbb0-43e2-b7c9-4775f6aa0b2b',
    },
    {
      code: '30',
      description: 'Lead Converted',
      rowGuid: 'ac0b59e7-fbb0-43e2-b7c9-4776f6aa0b2b',
    },
  ];
  static readonly FUNDINGLIST = [
    {
      code: 'OHS',
      description: 'OHS',
      rowGuid: 'fc0de925-242b-4b9c-a971-79958211961f',
    },
    {
      code: 'PVT',
      description: 'PRIVATE',
      rowGuid: '6f110632-a9cb-4a4e-b38d-95dd58387e41',
    },
    {
      code: 'WKC',
      description: 'WorkCover',
      rowGuid: 'f4596121-2c1c-48b3-b68f-2666902a9f5d',
    },
  ];
  static readonly CLINICLIST: Clinic[] = [
    {
      code: '003',
      description: 'Typical Clinic'
    }
  ];
  static readonly ADDRESSTYPELIST = [
    {code: '001', description: 'Home Address'},
    {code: '002', description: 'Mailing Address'},
    {code: '003', description: 'Invoicing Address'},
    {code: '004', description: 'Home visit information'}
  ];
}
