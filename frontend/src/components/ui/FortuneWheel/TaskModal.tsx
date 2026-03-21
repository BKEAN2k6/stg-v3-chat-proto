import {Trans} from '@lingui/react/macro';
import {Button, Fade} from 'react-bootstrap';
import {i18n} from '@lingui/core';
import {type StrengthSlug} from '@client/ApiTypes.js';
import stopPropagationHandlers from '../StrengthGoal/stopPropagationHandlers.js';
import StrengthAnimation from './StrengthAnimation.js';
import {strengthName, strengthColorMap} from '@/helpers/strengths.js';

type Properties = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly content: {
    readonly strength: StrengthSlug;
    readonly text: string;
  };
};

export default function TaskModal({isOpen, onClose, content}: Properties) {
  return (
    <Fade mountOnEnter unmountOnExit in={isOpen}>
      <div
        {...stopPropagationHandlers}
        style={{
          zIndex: 10_003,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        onClick={onClose}
      >
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10_004,
            backgroundColor: strengthColorMap[content.strength][300],
            borderRadius: '15px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            width: 600,
            maxWidth: '90%',
            padding: '10px',
          }}
        >
          <div
            className="d-flex flex-column gap-4 p-4"
            style={{
              backgroundColor: 'white',
              borderRadius: '5px',
            }}
          >
            <StrengthAnimation
              strength={content.strength}
              size={160}
              className="m-auto"
            />
            <h5>{strengthName(content.strength, i18n.locale)}</h5>
            <h4>{content.text}</h4>
            <div>
              <Button
                onClick={() => {
                  onClose();
                }}
              >
                <Trans>Done</Trans>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
}
