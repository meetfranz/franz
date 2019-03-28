import { Theme } from '@meetfranz/theme/lib';
import { Classes } from 'jss';

export interface IFormField {
  showLabel?: boolean;
  label?: string;
  error?: string;
}

export interface IWithStyle {
  classes: Classes;
  theme: Theme;
}

export type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
