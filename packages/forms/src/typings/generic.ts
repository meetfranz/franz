import { Classes } from 'jss';

export interface IFormField {
  title?: string;
  showLabel?: boolean;
  isError?: boolean;
}

export interface IWithStyle {
  classes: Classes;
}
