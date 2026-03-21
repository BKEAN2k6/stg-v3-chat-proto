import {useState, useRef} from 'react';
import {Button, Dropdown, Overlay, Popover} from 'react-bootstrap';
import {Gear} from 'react-bootstrap-icons';
import {type AgeGroup, type LanguageCode} from '@client/ApiTypes';
import {useLingui} from '@lingui/react';
import {msg} from '@lingui/core/macro';
import {
  type ArticleSelection,
  type CompletedArticles,
} from '@shared/timelineProgress.js';
import StrengthDropdownItem from './StrengthDropdownItem.js';
import {CrossFade} from '@/components/ui/CrossFade/CrossFade.js';
import {languages} from '@/i18n.js';
import {ageGroups} from '@/helpers/article.js';
import {useActiveGroup} from '@/context/activeGroupContext.js';
import {useUpdateGroupMutation} from '@/hooks/useApi.js';

type Properties = {
  readonly completedArticles: CompletedArticles[];
  readonly selection: ArticleSelection;
  readonly setSelection: React.Dispatch<
    React.SetStateAction<ArticleSelection | undefined>
  >;
};

export default function SettingsPopover({
  completedArticles,
  selection,
  setSelection,
}: Properties) {
  const {i18n, _} = useLingui();
  const targetReference = useRef(null);
  const [show, setShow] = useState(false);
  const {activeGroup} = useActiveGroup();
  const updateGroup = useUpdateGroupMutation();

  const languagesToDisplay = Object.keys(languages) as LanguageCode[];

  const ageGroupNameMap: Record<AgeGroup, string> = {
    preschool: _(msg`Preschool`),
    '7-8': _(msg`Class 1 - 2`),
    '9-10': _(msg`Class 3 - 4`),
    '11-12': _(msg`Class 5 - 6`),
    '13-15': _(msg`Class 7 - 9`),
  };

  if (!activeGroup) {
    return null;
  }

  const popover = (
    <Popover id="settings-popover" style={{width: 320}}>
      <Popover.Header
        className="d-flex gap-2"
        style={{backgroundColor: 'white'}}
      >
        <Dropdown className="flex-shrink-0">
          <Dropdown.Toggle variant="white" style={{width: 70}}>
            <span className="text-uppercase">{activeGroup.language}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {languagesToDisplay.map((language) => (
              <Dropdown.Item
                key={language}
                active={language === activeGroup?.language}
                onClick={async () => {
                  if (language !== activeGroup.language) {
                    await updateGroup.mutateAsync({
                      pathParameters: {id: activeGroup.id},
                      payload: {
                        language,
                      },
                    });
                  }
                }}
              >
                {languages[language]}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className="flex-grow-1">
          <Dropdown.Toggle variant="white" className="w-100">
            {ageGroupNameMap[selection.ageGroup]}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {ageGroups.map((age) => (
              <Dropdown.Item
                key={age}
                active={age === selection.ageGroup}
                onClick={async () => {
                  if (age !== activeGroup?.ageGroup) {
                    await updateGroup.mutateAsync({
                      pathParameters: {id: activeGroup.id},
                      payload: {
                        ageGroup: age,
                      },
                    });
                  }

                  setSelection((previous) =>
                    previous ? {...previous, ageGroup: age} : previous,
                  );
                }}
              >
                {ageGroupNameMap[age]}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Popover.Header>

      <Popover.Body className="p-0">
        <CrossFade contentKey={selection.ageGroup}>
          <div
            className="d-flex gap-2 flex-column p-2"
            style={{maxHeight: '40vh', overflowY: 'auto'}}
          >
            {completedArticles.map((group) => (
              <StrengthDropdownItem
                key={group.strength}
                articles={group}
                language={i18n.locale as LanguageCode}
                isSelected={group.strength === selection.strength}
                onClick={() => {
                  setSelection((previous) =>
                    previous
                      ? {...previous, strength: group.strength}
                      : previous,
                  );
                }}
              />
            ))}
          </div>
        </CrossFade>

        <div className="d-flex justify-content-end p-2 border-top">
          <Button
            variant="primary"
            onClick={() => {
              setShow(false);
            }}
          >
            Close
          </Button>
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <Button
        ref={targetReference}
        variant="white"
        style={{width: 46, height: 46}}
        className="hide-icon"
        onClick={() => {
          setShow((previous) => !previous);
        }}
      >
        <Gear />
      </Button>
      <Overlay
        rootClose
        target={targetReference.current}
        show={show}
        placement="bottom"
        onHide={() => {
          setShow(false);
        }}
      >
        {popover}
      </Overlay>
    </>
  );
}
