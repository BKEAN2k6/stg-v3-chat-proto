import {msg} from '@lingui/core/macro';
import React, {useState} from 'react';
import {useLingui} from '@lingui/react';
import RegisterForm from './RegisterForm.js';
import TextInput from '@/components/ui/TextInput.js';
import SelectInput from '@/components/ui/SelectInput.js';
import countries from '@/countries.js';

type Properties = {
  readonly onSubmit: (
    country: string,
    organization: string,
    organizationType: string,
    organizationRole: string,
  ) => void;
};

export default function OrganizationForm(properties: Properties) {
  const {_} = useLingui();
  const {onSubmit} = properties;

  const [country, setCountry] = useState('');
  const [organization, setOrganization] = useState('');
  const [organizationType, setOrganizationType] = useState('');
  const [organizationRole, setOrganizationRole] = useState('');

  const [organizationInvalid, setOrganizationInvalid] = useState<
    boolean | undefined
  >();

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(event.target.value);
  };

  const handleOrganizationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const {value} = event.target;
    setOrganization(value);
    setOrganizationInvalid(!value);
  };

  const handleOrganizationTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setOrganizationType(event.target.value);
  };

  const handleOrganizationRoleChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setOrganizationRole(event.target.value);
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(country, organization, organizationType, organizationRole);
  };

  return (
    <RegisterForm
      title={_(msg`Add your organization details`)}
      onSubmit={handleSubmit}
    >
      <SelectInput
        isRequired
        controlId="country"
        label={_(msg`Country`)}
        className="mb-3"
        value={country}
        chooseText={_(msg`Select your country`)}
        options={countries.map(({code, name}) => ({
          value: code,
          label: name,
        }))}
        onChange={handleCountryChange}
      />
      <TextInput
        isRequired
        controlId="organization"
        label={_(msg`Organization name`)}
        placeholder={_(msg`Enter your organization`)}
        value={organization}
        className="mb-3"
        isInvalid={organizationInvalid}
        maxLength={100}
        onChange={handleOrganizationChange}
        onBlur={() => {
          setOrganization(organization.trim());
        }}
      />
      <SelectInput
        isRequired
        controlId="organizationType"
        label={_(msg`Organization type`)}
        className="mb-3"
        value={organizationType}
        chooseText={_(msg`Select your organization type`)}
        options={[
          {
            value: 'Early childhood education',
            label: _(msg`Early childhood education`),
          },
          {value: 'School', label: _(msg`School`)},
          {value: 'Other', label: _(msg`Other`)},
        ]}
        onChange={handleOrganizationTypeChange}
      />
      <SelectInput
        isRequired
        controlId="organizationRole"
        label={_(msg`Role in organization`)}
        className="mb-3"
        chooseText={_(msg`Select your role in organization`)}
        value={organizationRole}
        options={[
          {value: 'Principal / Manager', label: _(msg`Principal / Manager`)},
          {value: 'Teacher / Instructor', label: _(msg`Teacher / Instructor`)},
          {value: 'Other', label: _(msg`Other`)},
        ]}
        onChange={handleOrganizationRoleChange}
      />
    </RegisterForm>
  );
}
