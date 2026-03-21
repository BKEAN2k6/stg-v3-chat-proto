import {Trans} from '@lingui/react/macro';
import {msg} from '@lingui/core/macro';
import {useEffect, useState, useCallback} from 'react';
import {Button} from 'react-bootstrap';
import api from '@client/ApiClient';
import {useLingui} from '@lingui/react';
import {useToasts} from './toasts/index.js';
import {socket, CONNECT, JOIN, LEAVE} from '@/socket.js';

const UI_VERSION_ROOM = '/ui-version'; // eslint-disable-line @typescript-eslint/naming-convention
const UPDATE_UI_VERSION_EVENT = 'UpdateUiVersionEvent'; // eslint-disable-line @typescript-eslint/naming-convention

type Properties = {
  readonly children: React.ReactNode;
};

export default function UiVersionCheck({
  children,
}: Properties): React.ReactNode {
  const toasts = useToasts();
  const {_} = useLingui();
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [versionMismatchDetected, setVersionMismatchDetected] = useState(false);
  const [toastId, setToastId] = useState<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (toastId !== undefined) {
        toasts.hide(toastId);
      }
    };
  }, [toastId, toasts]);

  const joinVersionRoom = useCallback(() => {
    socket.emit(JOIN, UI_VERSION_ROOM);
  }, []);

  const leaveVersionRoom = useCallback(() => {
    socket.emit(LEAVE, UI_VERSION_ROOM);
  }, []);

  const handleUiVersionUpdate = useCallback((version: string) => {
    if (version !== UI_VERSION) {
      setVersionMismatchDetected(true);
    }
  }, []);

  const fetchUiVersion = useCallback(async () => {
    try {
      const version = await api.getUiVersion();
      handleUiVersionUpdate(version);
    } catch (error) {
      console.error('Failed to fetch UI version:', error);
    }
  }, [handleUiVersionUpdate]);

  useEffect(() => {
    void fetchUiVersion();
    socket.on(UPDATE_UI_VERSION_EVENT, handleUiVersionUpdate);
    socket.on(CONNECT, joinVersionRoom);
    return () => {
      leaveVersionRoom();
      socket.off(UPDATE_UI_VERSION_EVENT, handleUiVersionUpdate);
      socket.off(CONNECT, joinVersionRoom);
    };
  }, [
    fetchUiVersion,
    joinVersionRoom,
    leaveVersionRoom,
    handleUiVersionUpdate,
  ]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void fetchUiVersion();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchUiVersion]);

  useEffect(() => {
    if (versionMismatchDetected) {
      setShouldUpdate(true);
    }
  }, [versionMismatchDetected]);

  useEffect(() => {
    if (shouldUpdate) {
      setToastId(
        toasts.success({
          header: _(msg`New version available`),
          body: (
            <>
              <Trans>
                A new version of the app is available. Please reload the page to
                update.
              </Trans>

              <br />
              <Button
                variant="success"
                className="mt-2 w-100"
                onClick={() => {
                  globalThis.location.reload();
                }}
              >
                <Trans>Reload</Trans>
              </Button>
            </>
          ),
          toastProps: {
            autohide: false,
            onClick() {
              globalThis.location.reload();
            },
          },
        }),
      );
    }
  }, [shouldUpdate, toasts, _]);

  return children;
}
