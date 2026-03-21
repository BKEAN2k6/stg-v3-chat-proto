import type {ToastProps} from 'react-bootstrap';

export type ToastIdType = number;

export type ToastPropsOmitBg = Omit<ToastProps, 'bg'>;

export type ToastOptions<T extends ToastProps> = {
  header: string;
  body: string;
  toastProps?: T;
};

export type ToastOptionsWithId = ToastOptions<ToastProps> & {
  id: ToastIdType;
  date: Date;
};

export type ToastsHandle = {
  show: (toastOptionsWithId: ToastOptionsWithId) => void;
  hide: (id: ToastIdType) => void;
};
