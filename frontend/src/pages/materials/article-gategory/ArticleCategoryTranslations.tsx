import {Tab, Tabs} from 'react-bootstrap';
import {X} from 'react-bootstrap-icons';
import {
  type LanguageCode,
  type ArticleCategoryTranslation,
} from '@client/ApiTypes';
import TranslationSelect from '../components/TranslationSelect.js';
import ArticleCategoryEdit from './ArticleCategoryEdit.js';
import {confirm} from '@/components/ui/confirm.js';

type Properties = {
  readonly translations: ArticleCategoryTranslation[];
  readonly onChange: (translations: ArticleCategoryTranslation[]) => void;
};

const allLanguages: LanguageCode[] = ['fi', 'en', 'sv'];

export default function ArticleCategoryTranslations(properties: Properties) {
  const {translations, onChange} = properties;
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
            name: '',
            description: '',
          };
          onChange([
            ...translations,
            newTranslation as ArticleCategoryTranslation,
          ]);
        }}
      />
      {translations.length > 0 && (
        <Tabs
          defaultActiveKey={defaultActiveKey}
          id="translations"
          className="mb-3"
        >
          {translations.map((translation) => (
            <Tab
              key={translation.language}
              eventKey={translation.language}
              title={
                <>
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
                </>
              }
            >
              <ArticleCategoryEdit
                category={translation}
                onChange={(category) => {
                  onChange(
                    translations.map((t) =>
                      t.language === category.language ? category : t,
                    ),
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
