import {Tab, Tabs} from 'react-bootstrap';
import {X} from 'react-bootstrap-icons';
import {type ArticleTranslation, type LanguageCode} from '@client/ApiTypes';
import TranslationSelect from '../components/TranslationSelect.js';
import ArticleTranslationEdit from './ArticleTranslationEdit.js';
import {confirm} from '@/components/ui/confirm.js';

type Properties = {
  readonly translations: ArticleTranslation[];
  readonly onChange: (translations: ArticleTranslation[]) => void;
  readonly onTranslate?: (source: LanguageCode, target: LanguageCode) => void;
  readonly isTranslating?: boolean;
};

const allLanguages: LanguageCode[] = ['fi', 'en', 'sv'];

export default function CategoryTranslations(properties: Properties) {
  const {translations, onChange, onTranslate, isTranslating} = properties;
  const handleRemove = async (language: LanguageCode) => {
    const confirmed = await confirm({
      title: 'Are you sure?',
      text: 'Do you really want to remove this translation?',
      confirm: 'Remove',
      cancel: 'Cancel',
    });

    if (!confirmed) {
      return;
    }

    onChange(translations.filter((t) => t.language !== language));
  };

  const defaultActiveKey = translations[0]?.language;

  return (
    <>
      <TranslationSelect
        availableLanguages={allLanguages.filter(
          (lang) => !translations.some((t) => t.language === lang),
        )}
        onSelect={(language) => {
          const newTranslation = {
            language,
            title: '',
            content: [''],
            description: '',
            requiresUpdate: false,
          };
          onChange([...translations, newTranslation as ArticleTranslation]);
        }}
      />
      {translations.length > 0 && (
        <Tabs
          defaultActiveKey={defaultActiveKey}
          id="translations"
          className="mb-3"
        >
          {translations
            .sort((a, b) => a.language.localeCompare(b.language))
            .map((translation) => (
              <Tab
                key={translation.language}
                eventKey={translation.language}
                title={
                  <div
                    style={{
                      ...(translation.requiresUpdate && {
                        color: 'var(--bs-danger)',
                      }),
                    }}
                  >
                    {translation.language}
                    <X
                      style={{
                        marginLeft: '8px',
                        padding: '0',
                      }}
                      onClick={async () => {
                        await handleRemove(translation.language);
                      }}
                    />
                  </div>
                }
              >
                <ArticleTranslationEdit
                  translation={translation}
                  isTranslating={isTranslating}
                  availableTranslations={translations
                    .filter((t) => t.language !== translation.language)
                    .map((t) => t.language)}
                  onTranslate={(source) => {
                    if (!onTranslate) {
                      return;
                    }

                    onTranslate(source, translation.language);
                  }}
                  onChange={(article) => {
                    onChange(
                      translations.map((t) => {
                        if (t.language === translation.language) {
                          return article;
                        }

                        return t;
                      }),
                    );
                  }}
                />
              </Tab>
            ))}
        </Tabs>
      )}
    </>
  );
}
