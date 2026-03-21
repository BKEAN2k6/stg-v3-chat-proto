import {Tab, Tabs} from 'react-bootstrap';
import {X} from 'react-bootstrap-icons';
import ArticleTranslationEdit from './ArticleTranslationEdit';
import TranslationSelect from './TranslationSelect';
import {type ArticleTranslation} from '@/api/ApiTypes';
import {confirm} from '@/components/ui/confirm';

type Props = {
  readonly translations: ArticleTranslation[];
  readonly onChange: (translations: ArticleTranslation[]) => void;
};

export default function CategoryTranslations(props: Props) {
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
            title: '',
            content: [''],
            description: '',
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
                <ArticleTranslationEdit
                  article={translation}
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
