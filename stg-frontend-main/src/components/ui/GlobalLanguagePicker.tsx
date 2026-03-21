import LanguagePicker from './LanguagePicker';
import {useLanguage} from '@/context/languageContext';
import {type LanguageCode} from '@/i18n';

export default function GlobalLanguagePicker() {
  const {changeLanguage, currentLanguage} = useLanguage();

  return (
    <LanguagePicker
      currentLanguage={currentLanguage}
      onChangeLanguage={(language) => {
        changeLanguage(language as LanguageCode);
      }}
    />
  );
}
