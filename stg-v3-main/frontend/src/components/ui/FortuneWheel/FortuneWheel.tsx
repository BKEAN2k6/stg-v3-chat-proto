import {useState, useRef, useMemo} from 'react';
import fm from 'front-matter';
import {Button, Form} from 'react-bootstrap';
import bezierEasing from 'bezier-easing';
import {type StrengthSlug} from '@client/ApiTypes.js';
import {MarkdownView} from '../MarkdownView.js';
import TaskModal from './TaskModal.js';

const bezierSettings: [number, number, number, number] = [
  0.44, -0.205, 0, 1.13,
];
const easing = bezierEasing(...bezierSettings);
const spinDuration = 10_000;

const initialData = `---
type: spinner  
options:
- strength: creativity
  text: Draw a self-portrait lookin in the mirror. You have one minute.
- strength: love
  text: Hug the nearest person for 30 seconds.
- strength: courage
  text: Tell a secret about yourself.
- strength: humour
  text: Tell a joke.
- strength: kindness
  text: Give a compliment to the person on your left.  
---

## This is some text about some stuff that happened sometime ago.
`;

export default function FortuneWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [dataInput, setDataInput] = useState(initialData);
  const [dataError, setDataError] = useState<string | undefined>(undefined);
  const [parsedData, setParsedData] = useState(() => {
    try {
      return fm<{
        type: string;
        options: Array<{strength: StrengthSlug; text: string}>;
      }>(initialData);
    } catch {
      return null;
    }
  });

  const [selectedTask, setSelectedTask] = useState<{
    strength: StrengthSlug;
    text: string;
  }>({
    strength: 'creativity',
    text: '',
  });
  const wheelReference = useRef<HTMLDivElement>(null);
  const indicatorReference = useRef<HTMLImageElement>(null);
  const cumulativeRotation = useRef(0);

  const dt = 0.001;
  const easingLookup = useMemo(() => {
    const table = [];
    for (let t = 0; t <= 1; t += dt) {
      table.push(easing(t));
    }

    return table;
  }, []);

  const derivativeLookup = useMemo(() => {
    const table = [];
    for (let i = 0; i < easingLookup.length - 1; i++) {
      table.push((easingLookup[i + 1] - easingLookup[i]) / dt);
    }

    table.push(table.at(-1) ?? 0);
    return table;
  }, [easingLookup]);

  const maxDerivative = useMemo(() => {
    let max = 0;
    for (const d of derivativeLookup) {
      max = Math.max(Math.abs(d), max);
    }

    return max;
  }, [derivativeLookup]);

  const handleDataChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {value} = event.target;
    setDataInput(value);
    try {
      const parsed = fm<{
        type: string;
        options: Array<{strength: StrengthSlug; text: string}>;
      }>(value);
      setParsedData(parsed);
      setDataError(undefined);
    } catch {
      setParsedData(null);
      setDataError('Invalid data format');
    }
  };

  const {body, attributes} = parsedData ?? {
    body: '',
    attributes: {options: []},
  };

  const animateIndicator = (startTime: number): void => {
    const step = (time: number): void => {
      const t = Math.min((time - startTime) / spinDuration, 1);
      const index = Math.min(Math.floor(t / dt), derivativeLookup.length - 1);
      const derivative = derivativeLookup[index];
      const tilt = -(derivative / maxDerivative) * 50;
      if (indicatorReference.current) {
        indicatorReference.current.style.transform = `translateX(-50%) rotate(${tilt}deg)`;
      }

      if (t < 1) {
        setTimeout(() => {
          requestAnimationFrame(step);
        }, 1000 / 20);
      } else if (indicatorReference.current) {
        indicatorReference.current.style.transform = `translateX(-50%) rotate(0deg)`;
      }
    };

    requestAnimationFrame(step);
  };

  const spinWheel = () => {
    if (
      isSpinning ||
      !parsedData ||
      !attributes.options ||
      attributes.options.length === 0
    )
      return;
    setIsSpinning(true);

    const randomOffset = Math.random() * 360;
    const rotations = 8 + Math.floor(Math.random() * 3);
    const additionalRotation = rotations * 360 + randomOffset;
    const targetRotation = cumulativeRotation.current + additionalRotation;
    const outcome = Math.floor((targetRotation % 360) / 90);

    if (wheelReference.current) {
      wheelReference.current.style.transition = `transform ${
        spinDuration / 1000
      }s cubic-bezier(${bezierSettings.join(',')})`;
      wheelReference.current.style.transform = `rotate(${targetRotation}deg)`;
      const startTime = performance.now();
      animateIndicator(startTime);

      wheelReference.current.addEventListener(
        'transitionend',
        function () {
          cumulativeRotation.current = targetRotation;
          setIsSpinning(false);
          if (attributes.options && attributes.options.length > 0) {
            const index = outcome % attributes.options.length;
            setSelectedTask(attributes.options[index]);
            setTimeout(() => {
              setIsModalOpen(true);
            }, 500);
          }
        },
        {once: true},
      );
    }
  };

  return (
    <div className="d-flex flex-column gap-3 p-3">
      <Form>
        <Form.Group controlId="dataInput">
          <Form.Label>Configuration Data</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            value={dataInput}
            isInvalid={Boolean(dataError)}
            onChange={handleDataChange}
          />
          <Form.Control.Feedback type="invalid">
            {dataError}
          </Form.Control.Feedback>
        </Form.Group>
      </Form>

      <MarkdownView content={body} />

      <div style={{textAlign: 'center'}}>
        <div
          style={{
            position: 'relative',
            width: '300px',
            height: '300px',
            margin: '30px auto 0',
          }}
        >
          <img
            ref={indicatorReference}
            src="/images/spinner-selector.png"
            alt="Indicator"
            style={{
              position: 'absolute',
              top: '-30px',
              left: '50%',
              transformOrigin: 'top center',
              transform: 'translateX(-50%) rotate(0deg)',
              zIndex: 10,
            }}
          />
          <div
            ref={wheelReference}
            style={{
              width: '300px',
              height: '300px',
              backgroundImage: 'url("/images/spinner-wheel.png")',
              backgroundSize: 'cover',
              borderRadius: '50%',
            }}
          />
        </div>
        <Button
          disabled={isSpinning || Boolean(dataError)}
          style={{marginTop: '20px'}}
          type="button"
          onClick={spinWheel}
        >
          Spin
        </Button>

        <TaskModal
          isOpen={isModalOpen}
          content={selectedTask}
          onClose={() => {
            setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}
