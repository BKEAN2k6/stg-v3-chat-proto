import {Form} from 'react-bootstrap';
import {Trans} from '@lingui/react/macro';
import type {AgeGroup, LanguageCode} from '@client/ApiTypes.js';
import type {Dispatch, SetStateAction} from 'react';
import {useLingui} from '@lingui/react';
import {msg} from '@lingui/core/macro';
import type {OnboardingData} from '../OnboardingModal.js';
import {languages} from '@/i18n.js';
import {ageGroups} from '@/helpers/article.js';

export default function GroupSettingsForm({
  data,
  setData,
}: {
  readonly data: OnboardingData;
  readonly setData: Dispatch<SetStateAction<OnboardingData>>;
}) {
  const {_} = useLingui();

  const ageGroupNameMap: Record<AgeGroup, string> = {
    preschool: _(msg`Preschool`),
    '7-8': _(msg`Class 1 - 2`),
    '9-10': _(msg`Class 3 - 4`),
    '11-12': _(msg`Class 5 - 6`),
    '13-15': _(msg`Class 7 - 9`),
  };

  return (
    <div className="p-4 pb-0">
      <Form.Group className="mb-4">
        <Form.Label className="text-muted fw-bold">
          <Trans>What would you like to call your group?</Trans>
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter group name"
          value={data.name}
          onChange={(event) => {
            setData((d) => ({...d, name: event.target.value}));
          }}
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="text-muted fw-bold">
          <Trans>Which language will your group use?</Trans>
        </Form.Label>
        <Form.Select
          value={data.language}
          onChange={(event) => {
            setData((d) => ({
              ...d,
              language: event.target.value as LanguageCode,
            }));
          }}
        >
          {Object.entries(languages).map(([code, label]) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="text-muted fw-bold">
          <Trans>Which age group best describes your students?</Trans>
        </Form.Label>
        <Form.Select
          value={data.ageGroup}
          onChange={(event) => {
            setData((d) => ({
              ...d,
              ageGroup: event.target.value as AgeGroup,
            }));
          }}
        >
          {ageGroups.map((age) => (
            <option key={age} value={age}>
              {ageGroupNameMap[age]}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </div>
  );
}
