import {createContext, type RefObject} from 'react';
import {type ToastsHandle} from './types.js';

const ToastsContext = createContext<RefObject<ToastsHandle> | undefined>(
  undefined,
);
export default ToastsContext;
