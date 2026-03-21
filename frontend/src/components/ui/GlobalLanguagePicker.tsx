import LanguagePicker from './LanguagePicker.js';
import {useLanguage} from '@/context/languageContext.js';

export default function GlobalLanguagePicker() {
  const {changeLanguage, currentLanguage} = useLanguage();

  return (
    <LanguagePicker
      currentLanguage={currentLanguage}
      onChangeLanguage={(language) => {
        changeLanguage(language);
      }}
    />
  );
}
