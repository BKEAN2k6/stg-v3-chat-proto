import {type AgeGroup, type StrengthSlug} from '@client/ApiTypes';
import {slugToListItem} from '@/helpers/strengths.js';
import StrengthAvatar from '@/components/ui/StrengthAvatar.js';
import {ageGroupsTranslationMap} from '@/helpers/article.js';
import {useActiveGroup} from '@/context/activeGroupContext.js';

type Properties = {
  readonly selectedStrength: StrengthSlug;
  readonly selectedAgeGroup: AgeGroup;
};

export default function StrengthCarouselHeader({
  selectedStrength,
  selectedAgeGroup,
}: Properties) {
  const {activeGroup} = useActiveGroup();

  if (!activeGroup) {
    return null;
  }

  const {title} = slugToListItem(selectedStrength, activeGroup.language);

  return (
    <div className="d-flex gap-3 align-items-center">
      <StrengthAvatar
        strength={selectedStrength}
        size={60}
        tooltipPlacement="bottom"
      />
      <div>
        <div className="fs-5 fw-bold">{title}</div>
        {ageGroupsTranslationMap[selectedAgeGroup][activeGroup.language]}
      </div>
    </div>
  );
}
