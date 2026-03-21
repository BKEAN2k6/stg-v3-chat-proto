import React, {useState, useEffect} from 'react';
import {Button, Form} from 'react-bootstrap';
import LanguagePicker from '@/components/ui/LanguagePicker';

type Props = {
  readonly availableLanguages: string[];
  readonly onSelect: (language: string) => void;
};

export default function TranslationSelect(props: Props) {
  const {availableLanguages, onSelect} = props;
  const [language, setLanguage] = useState<string>(availableLanguages[0]);

  useEffect(() => {
    setLanguage(availableLanguages[0]);
  }, [availableLanguages]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSelect(language);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="d-flex justify-content-end mb-3 gap-1">
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
