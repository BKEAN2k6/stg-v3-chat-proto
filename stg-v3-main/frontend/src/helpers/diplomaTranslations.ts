import {type LanguageCode} from '@client/ApiTypes';

export const diplomaTranslations: Record<
  LanguageCode,
  {
    strengthDiploma: string;
    diplomaAwardedTo: string;
    studentName: string;
    forUsingStrengths: string;
    clickToAddStrengths: string;
    removeStrength: string;
    signature: string;
    date: string;
    downloadDiploma: string;
    dayMonthYear: string;
    monthDayYear: string;
    yearMonthDay: string;

    paperRecommendation: string;
    paperSize: string;
    a4: string;
    letter: string;
    fileName: string;

    // New fields for group diploma
    signedByStrengthCrow: string;
    forCompletingStrength: string;
    diplomaAwardedToGroup: string;
    diploma: string;
  }
> = {
  en: {
    strengthDiploma: 'STRENGTH DIPLOMA',
    diplomaAwardedTo: 'This diploma is awarded to',
    studentName: 'Name',
    forUsingStrengths: 'for using and developing these strengths:',
    clickToAddStrengths: 'Click to add strengths',
    removeStrength: 'Remove strength',
    signature: 'Signature',
    date: 'Date',
    downloadDiploma: 'Download',
    dayMonthYear: 'Day-Month-Year',
    monthDayYear: 'Month-Day-Year',
    yearMonthDay: 'Year-Month-Day',
    paperRecommendation:
      'Recommended paper: A4 or US Letter in landscape orientation',
    paperSize: 'Paper Size',
    a4: 'A4',
    letter: 'Letter',
    fileName: 'Strength Diploma',
    signedByStrengthCrow: 'Strength Crow',
    forCompletingStrength: 'for completing',
    diplomaAwardedToGroup: 'This diploma is awarded to',
    diploma: 'DIPLOMA',
  },
  fi: {
    strengthDiploma: 'VAHVUUSDIPLOMI',
    diplomaAwardedTo: 'Tämä diplomi on myönnetty',
    studentName: 'Nimi',
    forUsingStrengths:
      'seuraavien vahvuuksien käyttämisestä ja kehittämisestä:',
    clickToAddStrengths: 'Klikkaa lisätäksesi vahvuuksia',
    removeStrength: 'Poista vahvuus',
    signature: 'Allekirjoitus',
    date: 'Päiväys',
    downloadDiploma: 'Lataa',
    dayMonthYear: 'Päivä-Kuukausi-Vuosi',
    monthDayYear: 'Kuukausi-Päivä-Vuosi',
    yearMonthDay: 'Vuosi-Kuukausi-Päivä',
    paperRecommendation: 'Suositeltu paperi: A4 tai US Letter vaaka-asennossa',
    paperSize: 'Paperin koko',
    a4: 'A4',
    letter: 'Letter',
    fileName: 'Vahvuusdiplomi',
    signedByStrengthCrow: 'Vahvuusvaris',
    forCompletingStrength: 'vahvuudesta',
    diplomaAwardedToGroup: 'Tämä diplomi on myönnetty ryhmälle',
    diploma: '-DIPLOMI',
  },
  sv: {
    strengthDiploma: 'STYRKEDIPLOM',
    diplomaAwardedTo: 'Detta diplom tilldelas',
    studentName: 'Namn',
    forUsingStrengths: 'för användning och utveckling av dessa styrkor:',
    clickToAddStrengths: 'Klicka för att lägga till styrkor',
    removeStrength: 'Avlägsna styrka',
    signature: 'Underskrift',
    date: 'Datum',
    downloadDiploma: 'Ladda ner',
    dayMonthYear: 'Dag-Månad-År',
    monthDayYear: 'Månad-Dag-År',
    yearMonthDay: 'År-Månad-Dag',
    paperRecommendation:
      'Rekommenderat papper: A4 eller US Letter i liggande format',
    paperSize: 'Pappersstorlek',
    a4: 'A4',
    letter: 'Letter',
    fileName: 'Styrkediplom',
    signedByStrengthCrow: 'Styrkekråkan',
    forCompletingStrength: 'för slutförandet av',
    diplomaAwardedToGroup: 'Detta diplom tilldelas',
    diploma: 'DIPLOM',
  },
};
