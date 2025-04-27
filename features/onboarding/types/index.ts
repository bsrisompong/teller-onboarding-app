export interface Customer {
  id: string;
  citizenId: string;
  name: string;
  surname: string;
  accountNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}
export type CreateAppicationPayload = Pick<
  Customer,
  'citizenId' | 'name' | 'surname' | 'accountNumber'
>;

export interface CreateApplicationResponse {
  applicationId: string;
  status: string;
  received: CreateAppicationPayload;
  customer: Customer;
  application: Application;
}
