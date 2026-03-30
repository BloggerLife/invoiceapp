export type CategoryProps = {
  title: string;
  slug: string;
  imageUrl: string;
  description: string;
};
export type SavingProps = {
  amount: number;
  month: string;
  name: string;
  userId: string;
  paymentDate: any;
};
export type UserProps = {
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  image: string;
  email: string;
  password: string;
};
export type LoginProps = {
  email: string;
  password: string;
};
export type ForgotPasswordProps = {
  email: string;
};
