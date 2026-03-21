import {useId, useState} from 'react';
import {Button, Stack} from 'react-bootstrap';
import {
  AsyncTypeahead,
  type RenderMenuItemChildren,
} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import {type BillingContact} from '@client/ApiTypes';
import {useGetBillingContactsQuery} from '@client/ApiHooks.js';

const minimumSearchLength = 2;

type TypeaheadOption = Parameters<RenderMenuItemChildren>[0];

const isBillingContactOption = (
  option: TypeaheadOption,
): option is BillingContact =>
  typeof option === 'object' &&
  option !== null &&
  'id' in option &&
  'name' in option &&
  'email' in option;

const renderBillingContactMenuItemChildren: RenderMenuItemChildren = (
  option,
) => {
  if (!isBillingContactOption(option)) {
    const fallbackLabel =
      typeof option === 'string'
        ? option
        : typeof option === 'object' && option !== null && 'name' in option
          ? String(option.name)
          : 'Billing contact';
    return <span>{fallbackLabel}</span>;
  }

  return (
    <div>
      <span>{option.name}</span>
      <small className="text-muted">{option.email}</small>
    </div>
  );
};

type BillingContactSelectorProperties = {
  readonly selected?: BillingContact;
  readonly onSelect: (contact: BillingContact | undefined) => void;
  readonly onCreateContact?: (
    onCreated: (contact: BillingContact) => void,
  ) => void;
  readonly isDisabled?: boolean;
};

export function BillingContactSelector({
  selected,
  onSelect,
  onCreateContact,
  isDisabled = false,
}: BillingContactSelectorProperties) {
  const [searchTerm, setSearchTerm] = useState('');
  const trimmedSearch = searchTerm.trim();
  const searchEnabled = trimmedSearch.length >= minimumSearchLength;
  const {data: searchResults = [], isFetching: isSearchLoading} =
    useGetBillingContactsQuery(
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
          placeholder="Search billing contacts"
          isLoading={isSearchLoading}
          clearButton={Boolean(selected)}
          selected={selected ? [selected] : []}
          renderMenuItemChildren={renderBillingContactMenuItemChildren}
          disabled={isDisabled}
          onInputChange={(value) => {
            setSearchTerm(value);
          }}
          onSearch={() => undefined}
          onChange={(items) => {
            const option = items[0];
            if (isBillingContactOption(option)) {
              onSelect(option);
            } else {
              onSelect(undefined);
            }
          }}
        />
      </div>
      {onCreateContact ? (
        <Button
          className="flex-shrink-0"
          disabled={isDisabled}
          onClick={() => {
            onCreateContact((contact) => {
              onSelect(contact);
            });
          }}
        >
          Create
        </Button>
      ) : null}
    </Stack>
  );
}
