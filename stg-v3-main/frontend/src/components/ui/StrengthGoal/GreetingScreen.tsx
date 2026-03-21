import {useState, useEffect, useMemo} from 'react';
import {useLingui} from '@lingui/react';
import {msg} from '@lingui/core/macro';
import {Button} from 'react-bootstrap';
import {Trans} from '@lingui/react/macro';

type Properties = {
  readonly onClose: () => void;
};

export default function GreetingScreen({onClose}: Properties) {
  const [greeting, setGreeting] = useState('');
  const {_} = useLingui();
  const greetings = useMemo(
    () => [
      _(msg`What were the benefits of practising the skill?`),
      _(msg`How did the practised strength show in your group?`),
      _(msg`How will you use this skill in future?`),
      _(msg`Where did you succeed in practising the skill?`),
    ],
    [_],
  );

  useEffect(() => {
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
  }, [greetings]);

  return (
    <div style={{position: 'relative', padding: '5%'}}>
      <div className="d-flex">
        <img
          src="/images/varis-think.png"
          alt="Goal end"
          style={{width: '40%', marginRight: '5%'}}
        />
        <div style={{margin: 'auto'}}>
          <h1
            style={{
              fontFamily: "'Luckiest Guy', cursive",
              fontSize: 'clamp(24px, 6cqw, 48px)',
              color: 'white',
              WebkitTextStroke: 'clamp(1px, 0.4cqw, 2px) black',
              textShadow:
                'clamp(2px, 0.7cqw, 4px) clamp(2px, 0.7cqw, 4px) 0 #000',
              textTransform: 'uppercase',
              textAlign: 'left',
            }}
          >
            {greeting}
          </h1>
        </div>
      </div>
      <Button size="lg" className="mt-3" variant="primary" onClick={onClose}>
        <Trans>Close</Trans>
      </Button>
    </div>
  );
}
