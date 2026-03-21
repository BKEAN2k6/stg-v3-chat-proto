import {useState, useEffect} from 'react';
import {createPortal} from 'react-dom';
import {useWindowSize} from 'react-use';
import ArticleProgessGoalButton from './ArticleProgessGoalButton.js';
import {type GroupedGoal} from '@/components/ui/StrengthGoal/useGroupedGoals.js';

type Properties = {
  readonly goal: GroupedGoal;
};

export default function ArticleProgressGoal({goal}: Properties) {
  const {events, target} = goal;
  const [portalContainer, setPortalContainer] = useState<Element>(
    document.fullscreenElement ?? document.body,
  );
  const {width: viewportWidth, height: viewportHeight} = useWindowSize();

  useEffect(() => {
    const handleFullscreenChange = () => {
      setPortalContainer(document.fullscreenElement ?? document.body);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const slideWidth =
    viewportWidth > 0 && viewportHeight > 0
      ? viewportWidth / viewportHeight > 16 / 9
        ? viewportHeight * (16 / 9)
        : viewportWidth
      : 1280;
  const goalButtonSize = slideWidth / 8;

  return (
    <>
      {createPortal(
        <ArticleProgessGoalButton
          strength={goal.strength}
          events={events}
          target={target}
          goalButtonSize={goalButtonSize}
        />,
        portalContainer,
      )}
    </>
  );
}
