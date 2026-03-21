import {useContext, useEffect, useMemo, useState} from 'react';
import type {ToastProps} from 'react-bootstrap';
import type {
  ToastIdType,
  ToastOptions,
  ToastOptionsWithId,
  ToastPropsOmitBg,
} from './types';
import ToastsContext from './toastContext';

let toastId: ToastIdType = 0;

const useToasts = () => {
  const [toastOptionsQueue, setToastOptionsQueue] = useState<
    ToastOptionsWithId[]
  >([]);

  const ctx = useContext(ToastsContext);
  if (ctx === undefined) {
    throw new Error(
      '`useToasts` must be used inside of a `ToastsProvider`, ' +
        'otherwise it will not function correctly.',
    );
  }

  const api = useMemo(() => {
    const show = (toastOptions: ToastOptions<ToastProps>): ToastIdType => {
      const id = toastId++;
      setToastOptionsQueue((q) => [
        ...q,
        {...toastOptions, date: new Date(), id},
      ]);
      return id;
    };

    const hide = (id: ToastIdType) => {
      ctx.current?.hide(id);
    };

    const success = (toastOptions: ToastOptions<ToastPropsOmitBg>) => {
      const toastProps = toastOptions.toastProps ?? {};
      const autohide = toastProps.autohide ?? true;
      toastOptions.toastProps = {
        ...toastProps,
        autohide,
      };
      return show(_withType(toastOptions, 'success'));
    };

    const danger = (toastOptions: ToastOptions<ToastPropsOmitBg>) => {
      return show(_withType(toastOptions, 'danger'));
    };

    const _withType = (
      toastOptions: ToastOptions<ToastPropsOmitBg>,
      type: 'success' | 'danger',
    ) => {
      const {toastProps} = toastOptions;
      const toastPropsWithBg = {...toastProps, className: `${type}-toast`};
      return {
        ...toastOptions,
        toastProps: toastPropsWithBg,
      };
    };

    return {
      show,
      hide,
      success,
      danger,
    };
  }, [ctx]);

  useEffect(() => {
    const {current} = ctx;
    if (current !== null && toastOptionsQueue.length > 0) {
      for (const options of toastOptionsQueue) {
        current.show(options);
      }

      setToastOptionsQueue([]);
    }
  }, [ctx, toastOptionsQueue]);

  return api;
};

export default useToasts;
