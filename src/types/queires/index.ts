export interface QueryProps {
  dateInit?: string;
  dateEnd?: string;
  year?: number;
  month?: number;
  day?: number;
  company?: string[];
  idPeople?: string[];
  sellerSurname?: string;
  idSeller?: string[] | string;
  brands?: string[];
  groups?: string[];
  tables?: string[];
  costsCenters?: string[];
  formsOfPayments?: string[];
  id?: string;
}
