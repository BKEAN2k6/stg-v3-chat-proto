import {Dropdown} from 'react-bootstrap';
import {ChevronDown, Globe} from 'react-bootstrap-icons';
import {type LanguageCode} from '@client/ApiTypes';
import {languages} from '@/i18n.js';

type Properties = {
  readonly onChangeLanguage: (languageCode: LanguageCode) => void;
  readonly currentLanguage: LanguageCode;
  readonly availableLanguages?: LanguageCode[];
  readonly isNormalDropdown?: boolean;
};

export default function LanguagePicker({
  onChangeLanguage,
  currentLanguage,
  availableLanguages,
  isNormalDropdown,
}: Properties) {
  const languagesToDisplay = availableLanguages ?? Object.keys(languages);

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle
          variant="white"
          style={
            isNormalDropdown
              ? {width: 60}
              : {
                  width: 100,
                }
          }
          className={isNormalDropdown ? '' : 'hide-icon'}
        >
          {isNormalDropdown ? (
            <span className="text-uppercase">{currentLanguage}</span>
          ) : (
            <div>
              <Globe size={14} style={{marginTop: -3}} />
              <span style={{padding: 4}} className="text-uppercase">
                {currentLanguage}
              </span>
              <ChevronDown />
            </div>
          )}
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
