import React, {useEffect, useState} from 'react';
import {Card} from 'react-bootstrap';
import {i18n} from '@lingui/core';
import {type StrengthSlug} from '@client/ApiTypes.js';
import GoalCardContent from '@/components/ui/StrengthGoal/GoalCardContent.js';
import {slugToListItem, strengthSlugs} from '@/helpers/strengths.js';
import {CrossFade} from '@/components/ui/CrossFade/CrossFade.js';

type CardState = {
  strength: StrengthSlug;
  events: Array<{createdAt: string}>;
  targetDate: string;
  title: string;
  description: string;
  target: number;
  completedCount: number;
};

function generateEvents() {
  const eventCount = Math.floor(Math.random() * 7) + 3; // between 3 and 9 events
  return Array.from({length: eventCount}, () => ({
    createdAt: new Date().toJSON(),
  }));
}

function generateTargetDate() {
  const now = new Date();
  const days = 24 * 60 * 60 * 1000 * (Math.floor(Math.random() * 6) + 1);
  const hours = 60 * 60 * 1000 * (Math.floor(Math.random() * 23) + 1);
  const minutes = 60 * 1000 * (Math.floor(Math.random() * 59) + 1);
  return new Date(now.getTime() + days + hours + minutes).toJSON();
}

function generateCard(strength: StrengthSlug): CardState {
  const content = slugToListItem(strength, i18n.locale);
  return {
    strength,
    events: generateEvents(),
    targetDate: generateTargetDate(),
    title: content.title,
    description: content.description,
    target: 10,
    completedCount: 0,
  };
}

export default function DemoCard() {
  const fadeDuration = 3000;
  const changeInterval = 7500;

  const [activeCard, setActiveCard] = useState<CardState>(
    generateCard(strengthSlugs[0]),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = strengthSlugs.indexOf(activeCard.strength);
      const nextIndex = (currentIndex + 1) % strengthSlugs.length;
      setActiveCard(generateCard(strengthSlugs[nextIndex]));
    }, changeInterval);

    return () => {
      clearInterval(interval);
    };
  }, [activeCard]);

  const cardStyle: React.CSSProperties = {
    transform: 'rotateX(-9deg) rotateY(-10deg) rotateZ(1deg) scale(0.85)',
    transformStyle: 'preserve-3d',
    width: '100%',
    boxShadow:
      '7px 7px 7px rgba(0, 0, 0, 0.1), -1px -1px 1px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#f9fafb',
  };

  return (
    <div
      style={{
        perspective: '400px',
        marginTop: -60,
        marginBottom: -20,
      }}
    >
      <Card style={cardStyle}>
        <div style={{position: 'relative', height: '100%'}}>
          <CrossFade contentKey={activeCard.strength} duration={fadeDuration}>
            <GoalCardContent
              key={activeCard.strength}
              isAnimated
              id="placeholder"
              description={`${activeCard.description}.`}
              title={activeCard.title}
              strength={activeCard.strength}
              target={activeCard.target}
              targetDate={activeCard.targetDate}
              events={activeCard.events}
              completedCount={activeCard.completedCount}
              descriptionHeight={72}
            />
          </CrossFade>
        </div>
      </Card>
    </div>
  );
}
