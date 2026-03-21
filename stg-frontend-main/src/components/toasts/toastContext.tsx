import {createContext, type RefObject} from 'react';
import {type ToastsHandle} from './types';

const ToastsContext = createContext<RefObject<ToastsHandle> | undefined>(
  undefined,
);
export default ToastsContext;
