export interface Appointment {
  code: string;
  description: string;
  serviceTypeCode?: string;
  serviceTypeDescription?: string;
  defaultDuration: number;
  backgroundColor: number;
  foregroundColor: number;
  rowGuid: string;
}
