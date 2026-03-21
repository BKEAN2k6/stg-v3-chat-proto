import {Trans} from '@lingui/react/macro';
import React from 'react';
import Form from 'react-bootstrap/Form';
import {Button} from 'react-bootstrap';
import RegisterFormHeading from './RefisterFormHeading.js';

type Properties = {
  readonly title: string;
  readonly onSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => void;
  readonly children: React.ReactNode;
};

export default function RegisterForm(properties: Properties) {
  const {title, onSubmit, children} = properties;

  return (
    <Form className="w-100 text-center" onSubmit={onSubmit}>
      <RegisterFormHeading title={title} />
      <div className="text-start w-100 m-auto mb-5" style={{maxWidth: 300}}>
        {children}
      </div>
      <Button type="submit" style={{width: 150}}>
        <Trans>Continue</Trans>
      </Button>
    </Form>
  );
}
