import {Dropdown} from 'react-bootstrap';
import {ChevronDown, Globe} from 'react-bootstrap-icons';
import {type LanguageCode, languages} from '@/i18n';

type Props = {
  readonly onChangeLanguage: (languageCode: string) => void;
  readonly currentLanguage: string;
  readonly availableLanguages?: string[];
};

export default function LanguagePicker(props: Props) {
  const {onChangeLanguage, currentLanguage, availableLanguages} = props;
  const languagesToDisplay = availableLanguages ?? Object.keys(languages);

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle
          style={{
            color: 'var(--primary)',
            backgroundColor: '#fff',
            textDecoration: 'none',
            width: 100,
          }}
          className="hide-icon"
        >
          <div>
            <Globe size={14} style={{marginTop: -3}} />
            <span style={{padding: 4}} className="text-uppercase">
              {currentLanguage}
            </span>
            <ChevronDown />
          </div>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {languagesToDisplay.map((languageCode) => (
            <Dropdown.Item
              key={languageCode}
              onClick={() => {
                onChangeLanguage(languageCode as LanguageCode);
              }}
            >
              {languages[languageCode as LanguageCode]}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
