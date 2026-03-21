import React, {useState, useEffect} from 'react';
import {Button, Form} from 'react-bootstrap';
import {type LanguageCode} from '@client/ApiTypes';
import LanguagePicker from '@/components/ui/LanguagePicker.js';

type Properties = {
  readonly availableLanguages: LanguageCode[];
  readonly onSelect: (language: LanguageCode) => void;
};

export default function TranslationSelect(properties: Properties) {
  const {availableLanguages, onSelect} = properties;
  const [language, setLanguage] = useState<LanguageCode>(availableLanguages[0]);

  useEffect(() => {
    setLanguage(availableLanguages[0]);
  }, [availableLanguages]);

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSelect(language);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="d-flex justify-content-end gap-1">
        {availableLanguages.length > 0 && (
          <div>
            <LanguagePicker
              currentLanguage={language}
              availableLanguages={availableLanguages.sort()}
              onChangeLanguage={(language) => {
                setLanguage(language);
              }}
            />
          </div>
        )}
        <div>
          <Button disabled={availableLanguages.length === 0} type="submit">
            Add Translation
          </Button>
        </div>
      </div>
    </Form>
  );
}
