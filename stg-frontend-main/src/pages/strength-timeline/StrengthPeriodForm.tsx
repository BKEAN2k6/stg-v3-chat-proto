import 'react-datepicker/dist/react-datepicker.css';
import SingleStrengthSelect from './SingleStrengthSelect';
import StrengthTimelineForm from './StrengthTimelineForm';
import {
  type StrengthPeriod,
  type StrengthSlug,
  type ArticleCategoryListItem,
} from '@/api/ApiTypes';

type Props = {
  readonly period: StrengthPeriod;
  readonly onChange: (period: StrengthPeriod) => void;
  readonly categories: ArticleCategoryListItem[];
};

const timelineStates = ['Start', 'Speak', 'Act', 'Assess'];

export default function StrengthPeriodForm(props: Props) {
  const {period, categories: articleCategories, onChange} = props;
  const {strength, timeline} = period;

  const onStrengthChange = async (updatedStrength: StrengthSlug) => {
    onChange({...period, strength: updatedStrength});
  };

  const onTimelineItemChange = (updatedTimelineItem: {
    _id: string;
    start: string;
    articleId: string;
    rootCategoryId: string;
  }) => {
    const updatedTimeline = timeline.map((timelineItem) =>
      timelineItem._id === updatedTimelineItem._id
        ? updatedTimelineItem
        : timelineItem,
    );

    onChange({...period, timeline: updatedTimeline});
  };

  return (
    <div>
      <SingleStrengthSelect
        strength={strength}
        className="mb-3"
        onChange={onStrengthChange}
      />
      {timeline.map((timelineItem, index) => {
        return (
          <StrengthTimelineForm
            key={timelineItem._id}
            stateName={timelineStates[index]}
            timelineItem={timelineItem}
            categories={articleCategories}
            onChange={onTimelineItemChange}
          />
        );
      })}
    </div>
  );
}
