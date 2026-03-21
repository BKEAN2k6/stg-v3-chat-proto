import {LockFill} from 'react-bootstrap-icons';
import {Trans} from '@lingui/react/macro';

export default function LockedOverlay() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(30, 30, 30, 0.5)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 1,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'max(1.5cqw, 0.5rem)',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '50%',
          width: 'max(8cqw, 2.5rem)',
          height: 'max(8cqw, 2.5rem)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        }}
      >
        <LockFill
          style={{width: 'max(4cqw, 1.25rem)', height: 'max(4cqw, 1.25rem)'}}
          color="black"
        />
      </div>
      <span
        style={{
          color: 'white',
          fontSize: 'clamp(0.75rem, 2.5cqw, 2.5rem)',
          textAlign: 'center',
          textShadow:
            '0 2px 6px rgba(0, 0, 0, 0.8), 0 0 12px rgba(0, 0, 0, 0.4)',
        }}
      >
        <Trans>Active subscription required</Trans>
      </span>
    </div>
  );
}
