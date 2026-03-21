import {Tab, Tabs} from 'react-bootstrap';
import {X} from 'react-bootstrap-icons';
import TranslationSelect from './TranslationSelect';
import ArticleCategoryEdit from './ArticleCategoryEdit';
import {type ArticleCategoryTranslation} from '@/api/ApiTypes';
import {confirm} from '@/components/ui/confirm';

type Props = {
  readonly translations: ArticleCategoryTranslation[];
  readonly onChange: (translations: ArticleCategoryTranslation[]) => void;
};

export default function ArticleCategoryTranslations(props: Props) {
  const {translations, onChange} = props;
  const handleRemove = async (language: string) => {
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
        availableLanguages={['fi', 'en', 'sv'].filter(
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
