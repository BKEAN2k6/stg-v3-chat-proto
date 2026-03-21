import {LockFill} from 'react-bootstrap-icons';
import {Trans} from '@lingui/react/macro';

export default function LockedArticleOverlay() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 60%)',
        zIndex: 1,
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: '2rem',
        gap: '0.5rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '50%',
          width: '2.5rem',
          height: '2.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        <LockFill style={{width: '1.25rem', height: '1.25rem'}} color="black" />
      </div>
      <span
        style={{
          color: 'black',
          fontSize: '1rem',
          textAlign: 'center',
        }}
      >
        <Trans>Active subscription required</Trans>
      </span>
    </div>
  );
}
