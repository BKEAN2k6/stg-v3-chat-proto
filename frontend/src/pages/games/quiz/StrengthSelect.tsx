/* eslint-disable react/boolean-prop-naming */
import React from 'react';
import {Form} from 'react-bootstrap';
import {Trans} from '@lingui/react/macro';
import {useLingui} from '@lingui/react';
import type {LanguageCode} from '@client/ApiTypes';
import {strengthSlugs, strengthTranslationMap} from '@/helpers/strengths.js';

export type StrengthSlug = (typeof strengthSlugs)[number];

type BaseProperties<T> = {
  readonly value: T;
  readonly onChange: (value: T) => void;
  readonly selectProps?: React.ComponentProps<typeof Form.Select>;
  readonly multiple?: boolean;
  readonly allowUndefined?: boolean;
};

function StrengthSelectBase<
  T extends StrengthSlug | StrengthSlug[] | undefined,
>({
  value,
  onChange,
  selectProps,
  multiple = false,
  allowUndefined = false,
}: BaseProperties<T>) {
  const {i18n} = useLingui();
  const locale = i18n.locale as LanguageCode;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selectedValues = [...event.target.selectedOptions].map(
        (o) => o.value,
      );

      if (allowUndefined && selectedValues.includes('__undefined__')) {
        onChange(undefined as T);
        return;
      }

      const next: StrengthSlug[] = selectedValues.filter(
        (v) => v !== '__undefined__',
      ) as StrengthSlug[];
      onChange(next as T);
    } else {
      const selected = event.target.value;
      if (allowUndefined && selected === '__undefined__') {
        onChange(undefined as T);
        return;
      }

      onChange(selected as T);
    }
  };

  const selectValue = React.useMemo(() => {
    if (multiple) {
      if (!value) return [] as string[];
      return value as unknown as string[];
    }

    if (value === undefined) return allowUndefined ? '__undefined__' : '';
    return value as string;
  }, [multiple, value, allowUndefined]);

  return (
    <Form.Select
      multiple={multiple}
      value={selectValue}
      onChange={handleChange}
      {...selectProps}
    >
      {allowUndefined ? (
        <option value="__undefined__">
          <Trans>— None —</Trans>
        </option>
      ) : null}
      {strengthSlugs.map((slug) => {
        const label = strengthTranslationMap[slug]?.[locale] ?? slug;
        return (
          <option key={slug} value={slug}>
            {label}
          </option>
        );
      })}
    </Form.Select>
  );
}

export type SingleStrengthSelectProperties = {
  readonly value: StrengthSlug;
  readonly onChange: (value: StrengthSlug) => void;
  readonly selectProps?: React.ComponentProps<typeof Form.Select>;
};

export function SingleStrengthSelect(
  properties: SingleStrengthSelectProperties,
) {
  return (
    <StrengthSelectBase
      {...properties}
      multiple={false}
      allowUndefined={false}
    />
  );
}

export type SingleStrengthSelectWithUndefinedProperties = {
  readonly value: StrengthSlug | undefined;
  readonly onChange: (value: StrengthSlug | undefined) => void;
  readonly selectProps?: React.ComponentProps<typeof Form.Select>;
};

export function SingleStrengthSelectWithUndefined(
  properties: SingleStrengthSelectWithUndefinedProperties,
) {
  return <StrengthSelectBase {...properties} allowUndefined multiple={false} />;
}

export type MultiStrengthSelectProperties = {
  readonly value: StrengthSlug[] | undefined;
  readonly onChange: (value: StrengthSlug[] | undefined) => void;
  readonly selectProps?: React.ComponentProps<typeof Form.Select>;
};

export function MultiStrengthSelect(properties: MultiStrengthSelectProperties) {
  return <StrengthSelectBase {...properties} multiple allowUndefined />;
}
