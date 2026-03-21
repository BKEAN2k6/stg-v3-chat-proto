import {useId, useState} from 'react';
import {Button, Stack} from 'react-bootstrap';
import {
  AsyncTypeahead,
  type RenderMenuItemChildren,
} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import {type BillingGroup} from '@client/ApiTypes';
import {useGetBillingGroupsQuery} from '@client/ApiHooks.js';

const minimumSearchLength = 2;

type TypeaheadOption = Parameters<RenderMenuItemChildren>[0];

const isBillingGroupOption = (
  option: TypeaheadOption,
): option is BillingGroup =>
  typeof option === 'object' &&
  option !== null &&
  'id' in option &&
  'name' in option &&
  'billingContact' in option;

const renderBillingGroupMenuItemChildren: RenderMenuItemChildren = (option) => {
  if (!isBillingGroupOption(option)) {
    const fallbackLabel =
      typeof option === 'string'
        ? option
        : typeof option === 'object' && option !== null && 'name' in option
          ? String(option.name)
          : 'Billing group';
    return <span>{fallbackLabel}</span>;
  }

  const contactSummary = option.billingContact.email
    ? `${option.billingContact.name} · ${option.billingContact.email}`
    : option.billingContact.name;

  return (
    <div>
      <span>{option.name}</span>
      <small className="text-muted">{contactSummary}</small>
    </div>
  );
};

type BillingGroupSelection = BillingGroup;

type BillingGroupSelectorProperties = {
  readonly selected?: BillingGroupSelection;
  readonly onSelect: (group: BillingGroup | undefined) => void;
  readonly onCreateGroup?: () => void;
  readonly isCreateDisabled?: boolean;
  readonly createDisabledReason?: string;
  readonly isDisabled?: boolean;
};

export function BillingGroupSelector({
  selected,
  onSelect,
  onCreateGroup,
  isCreateDisabled = false,
  createDisabledReason,
  isDisabled = false,
}: BillingGroupSelectorProperties) {
  const [searchTerm, setSearchTerm] = useState('');
  const trimmedSearch = searchTerm.trim();
  const searchEnabled = trimmedSearch.length >= minimumSearchLength;
  const {data: searchResults = [], isFetching: isSearchLoading} =
    useGetBillingGroupsQuery(
      searchEnabled ? {search: trimmedSearch, limit: '25'} : undefined,
      {enabled: searchEnabled},
    );
  const typeaheadOptions = searchEnabled ? searchResults : [];
  const typeaheadId = useId();

  return (
    <Stack direction="horizontal" gap={2}>
      <div className="flex-grow-1">
        <AsyncTypeahead
          id={typeaheadId}
          filterBy={() => true}
          labelKey="name"
          minLength={minimumSearchLength}
          options={typeaheadOptions}
          placeholder="Search billing groups"
          isLoading={isSearchLoading}
          clearButton={Boolean(selected)}
          selected={selected ? [selected] : []}
          renderMenuItemChildren={renderBillingGroupMenuItemChildren}
          disabled={isDisabled}
          onInputChange={(value) => {
            setSearchTerm(value);
          }}
          onSearch={() => undefined}
          onChange={(items) => {
            const option = items[0];
            if (isBillingGroupOption(option)) {
              onSelect(option);
            } else {
              onSelect(undefined);
            }
          }}
        />
      </div>
      {onCreateGroup ? (
        <Button
          className="flex-shrink-0"
          disabled={isDisabled || isCreateDisabled}
          title={isCreateDisabled ? createDisabledReason : undefined}
          onClick={onCreateGroup}
        >
          Create
        </Button>
      ) : null}
    </Stack>
  );
}
