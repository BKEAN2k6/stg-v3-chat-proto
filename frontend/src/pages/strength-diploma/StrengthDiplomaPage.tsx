import {type ReactNode, useMemo, useState} from 'react';
import {Button, Dropdown} from 'react-bootstrap';
import {
  Calendar,
  Download,
  FileEarmark,
  Globe,
  Pencil,
  X,
} from 'react-bootstrap-icons';
import {format} from 'date-fns';
import {type StrengthSlug} from '@client/ApiTypes';
import './StrengthDiplomaPage.scss';
import StrengthModal from '@/components/ui/StrengthModal.js';
import {slugToListItem, strengthColorMap} from '@/helpers/strengths.js';

type DiplomaLanguageCode = 'en' | 'fi' | 'sv';

const diplomaLanguages: Record<DiplomaLanguageCode, string> = {
  en: 'English',
  fi: 'Suomi',
  sv: 'Svenska',
};

const diplomaTranslations: Record<
  DiplomaLanguageCode,
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
  },
  fi: {
    strengthDiploma: 'VAHVUUSDIPLOMI',
    diplomaAwardedTo: 'Tämä diplomi on myönnetty henkilölle',
    studentName: 'Nimi',
    forUsingStrengths: 'näiden vahvuuksien käytön ja kehittämisen ansiosta:',
    clickToAddStrengths: 'Klikkaa lisätäksesi vahvuuksia',
    removeStrength: 'Poista vahvuus',
    signature: 'Allekirjoitus',
    date: 'Päivämäärä',
    downloadDiploma: 'Lataa',
    dayMonthYear: 'Päivä-Kuukausi-Vuosi',
    monthDayYear: 'Kuukausi-Päivä-Vuosi',
    yearMonthDay: 'Vuosi-Kuukausi-Päivä',
    paperRecommendation: 'Suositeltu paperi: A4 tai US Letter vaakasuunnassa',
    paperSize: 'Paperikoko',
    a4: 'A4',
    letter: 'Letter',
    fileName: 'Vahvuusdiplomi',
  },
  sv: {
    strengthDiploma: 'STYRKE DIPLOM',
    diplomaAwardedTo: 'Detta diplom delas ut till',
    studentName: 'Namn',
    forUsingStrengths: 'för användning och utveckling av dessa styrkor:',
    clickToAddStrengths: 'Klicka för att lägga till styrkor',
    removeStrength: 'Avlägsna styrka',
    signature: 'Signatur',
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
    fileName: 'Styrke diplom',
  },
};

function getBrowserLanguage(): DiplomaLanguageCode {
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  if (browserLang === 'fi' || browserLang === 'sv') {
    return browserLang;
  }

  return 'en';
}

type DateFormatOption = 'DMY' | 'MDY' | 'YMD';

type StrengthDiplomaContentProperties = {
  readonly logoSource: string;
  readonly studentName: string;
  readonly onStudentNameChange?: (value: string) => void;
  readonly signatureName: string;
  readonly onSignatureNameChange?: (value: string) => void;
  readonly selectedStrengths: StrengthSlug[];
  readonly onStrengthsAreaClick?: () => void;
  readonly onRemoveStrength?: (slug: StrengthSlug) => void;
  readonly date: string;
  readonly onDateChange?: (value: string) => void;
  readonly locale: string;
  readonly dateFormat: DateFormatOption;
  readonly isInteractive?: boolean;
  readonly translations: (typeof diplomaTranslations)[DiplomaLanguageCode];
};

function formatDateForDisplay(
  value: string,
  formatOption: DateFormatOption,
): string {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  ) {
    return value;
  }

  const dateValue = new Date(year, month - 1, day);
  if (Number.isNaN(dateValue.getTime())) return value;

  const displayDay = String(dateValue.getDate()).padStart(2, '0');
  const displayMonth = String(dateValue.getMonth() + 1).padStart(2, '0');
  const displayYear = String(dateValue.getFullYear());

  switch (formatOption) {
    case 'DMY': {
      return `${displayDay}.${displayMonth}.${displayYear}`;
    }

    case 'MDY': {
      return `${displayMonth}/${displayDay}/${displayYear}`;
    }

    case 'YMD': {
      return `${displayYear}-${displayMonth}-${displayDay}`;
    }
  }
}

function StrengthDiplomaFrame({children}: {readonly children: ReactNode}) {
  return (
    <div className="strength-diploma-frame" role="presentation">
      <div className="strength-diploma-frame__content">{children}</div>
    </div>
  );
}

function StrengthDiplomaContent({
  logoSource,
  studentName,
  onStudentNameChange,
  signatureName,
  onSignatureNameChange,
  selectedStrengths,
  onStrengthsAreaClick,
  onRemoveStrength,
  date,
  onDateChange,
  locale,
  dateFormat,
  isInteractive = false,
  translations,
}: StrengthDiplomaContentProperties) {
  const title = translations.strengthDiploma;
  const formattedDate = formatDateForDisplay(date, dateFormat);
  const strengthsClassName = [
    'strength-diploma__strengths',
    isInteractive && 'strength-diploma__strengths--interactive',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="strength-diploma">
      <img src={logoSource} alt="Positive" className="strength-diploma__logo" />

      <div className="strength-diploma__title">
        <span className="strength-diploma__title-text">{title}</span>
      </div>

      <h3 className="strength-diploma__text strength-diploma__text--muted">
        {translations.diplomaAwardedTo}
      </h3>

      <div className="strength-diploma__input-container">
        <input
          className="strength-diploma__input"
          value={studentName}
          placeholder={translations.studentName.toUpperCase()}
          aria-label={translations.studentName}
          onChange={(event) => {
            const uppercaseValue = event.target.value.toUpperCase();
            onStudentNameChange?.(uppercaseValue);
          }}
        />
        <Pencil className="strength-diploma__edit-icon" />
      </div>

      <h3 className="strength-diploma__text strength-diploma__text--muted">
        {translations.forUsingStrengths}
      </h3>

      <div
        className={strengthsClassName}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onClick={
          isInteractive
            ? () => {
                onStrengthsAreaClick?.();
              }
            : undefined
        }
        onKeyDown={
          isInteractive
            ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onStrengthsAreaClick?.();
                }
              }
            : undefined
        }
      >
        {selectedStrengths.length === 0 && (
          <span className="strength-diploma__strengths-placeholder">
            {translations.clickToAddStrengths}
          </span>
        )}

        {selectedStrengths.map((slug) => {
          const item = slugToListItem(slug, locale);
          return (
            <div key={slug} className="strength-diploma__strength">
              {isInteractive ? (
                <button
                  type="button"
                  className="strength-diploma__strength-remove"
                  aria-label={translations.removeStrength}
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemoveStrength?.(slug);
                  }}
                >
                  <X />
                </button>
              ) : undefined}
              <img
                alt={item.title}
                src={item.imageUrl}
                style={{
                  backgroundColor: item.color,
                  borderColor: strengthColorMap[slug][500],
                }}
              />
              <span>{item.title}</span>
            </div>
          );
        })}

        {isInteractive && selectedStrengths.length < 3 ? (
          <div className="strength-diploma__add-strength">+</div>
        ) : undefined}
      </div>

      <div className="strength-diploma__footer d-flex flex-column-reverse flex-md-row justify-content-between gap-4 gap-md-5">
        <div className="strength-diploma__footer-item">
          <div className="strength-diploma__footer-signature-wrapper">
            <input
              className="strength-diploma__signature-input"
              value={signatureName}
              readOnly={!onSignatureNameChange}
              onChange={(event) => {
                onSignatureNameChange?.(event.target.value);
              }}
            />
            <Pencil className="strength-diploma__edit-icon strength-diploma__edit-icon--small" />
          </div>
          <span>{translations.signature}</span>
        </div>
        <div className="strength-diploma__footer-item">
          <div
            className="strength-diploma__footer-date-wrapper"
            data-value={formattedDate || '\u00A0'}
          >
            <input
              type="date"
              className="strength-diploma__footer-date"
              value={date}
              readOnly={!onDateChange}
              aria-label={translations.date}
              onChange={
                onDateChange
                  ? (event) => {
                      onDateChange(event.target.value);
                    }
                  : undefined
              }
              onClick={
                onDateChange
                  ? (event) => {
                      try {
                        event.currentTarget.showPicker();
                      } catch {
                        // Ignore unsupported browsers
                      }
                    }
                  : undefined
              }
            />
            <Pencil className="strength-diploma__edit-icon strength-diploma__edit-icon--small" />
          </div>
          <span>{translations.date}</span>
        </div>
      </div>
    </div>
  );
}

export default function StrengthDiplomaPage() {
  const [diplomaLanguage, setDiplomaLanguage] =
    useState<DiplomaLanguageCode>(getBrowserLanguage);
  const [studentName, setStudentName] = useState('');
  const [signatureName, setSignatureName] = useState('');
  const [selectedStrengths, setSelectedStrengths] = useState<StrengthSlug[]>(
    [],
  );
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isStrengthModalOpen, setIsStrengthModalOpen] = useState(false);
  const [dateFormat, setDateFormat] = useState<DateFormatOption>('DMY');
  const [paperSize, setPaperSize] = useState<'A4' | 'Letter'>('A4');
  const languageChoices = useMemo(
    () =>
      Object.entries(diplomaLanguages) as Array<[DiplomaLanguageCode, string]>,
    [],
  );

  const translations = diplomaTranslations[diplomaLanguage];

  const logoSource =
    diplomaLanguage === 'fi' ? '/images/logo/fi.svg' : '/images/logo/en.svg';

  const handleAddStrength = (slug: StrengthSlug) => {
    if (selectedStrengths.includes(slug)) return;
    if (selectedStrengths.length >= 3) return;
    setSelectedStrengths([...selectedStrengths, slug]);
    setIsStrengthModalOpen(false);
  };

  const handleRemoveStrength = (slug: StrengthSlug) => {
    setSelectedStrengths(selectedStrengths.filter((item) => item !== slug));
  };

  const handlePrint = async () => {
    try {
      const response = await fetch('/api/v1/strength-diploma/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName,
          signatureName,
          date,
          selectedStrengths: selectedStrengths.map((slug) => {
            const item = slugToListItem(slug, diplomaLanguage);
            return {
              slug,
              title: item.title,
              color: strengthColorMap[slug][300],
              borderColor: strengthColorMap[slug][500],
            };
          }),
          translations: {
            strengthDiploma: translations.strengthDiploma,
            diplomaAwardedTo: translations.diplomaAwardedTo,
            forUsingStrengths: translations.forUsingStrengths,
            signature: translations.signature,
            date: translations.date,
          },
          paperSize,
          dateFormat,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = globalThis.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const namePart = studentName ? ` - ${studentName}` : '';
        a.download = `${translations.fileName}${namePart} - ${paperSize}.pdf`;
        document.body.append(a);
        a.click();
        globalThis.URL.revokeObjectURL(url);
        a.remove();
      } else {
        const text = await response.text();
        console.error('Print request failed:', text);
      }
    } catch (error) {
      console.error('Network error during print:', error);
    }
  };

  return (
    <>
      <div className="strength-diploma-page strength-diploma-page--standalone">
        <div className="strength-diploma-page__actions">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary">
              <Globe className="me-2" />
              {diplomaLanguages[diplomaLanguage]}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {languageChoices.map(([code, label]) => (
                <Dropdown.Item
                  key={code}
                  active={code === diplomaLanguage}
                  onClick={() => {
                    setDiplomaLanguage(code);
                  }}
                >
                  {label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary">
              <Calendar />
              <span className="d-none d-md-inline ms-2">
                {dateFormat === 'DMY' && translations.dayMonthYear}
                {dateFormat === 'MDY' && translations.monthDayYear}
                {dateFormat === 'YMD' && translations.yearMonthDay}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                active={dateFormat === 'DMY'}
                onClick={() => {
                  setDateFormat('DMY');
                }}
              >
                {translations.dayMonthYear}
              </Dropdown.Item>
              <Dropdown.Item
                active={dateFormat === 'MDY'}
                onClick={() => {
                  setDateFormat('MDY');
                }}
              >
                {translations.monthDayYear}
              </Dropdown.Item>
              <Dropdown.Item
                active={dateFormat === 'YMD'}
                onClick={() => {
                  setDateFormat('YMD');
                }}
              >
                {translations.yearMonthDay}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary">
              <FileEarmark />
              <span className="d-none d-md-inline ms-2">
                {paperSize === 'A4' ? translations.a4 : translations.letter}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                active={paperSize === 'A4'}
                onClick={() => {
                  setPaperSize('A4');
                }}
              >
                {translations.a4}
              </Dropdown.Item>
              <Dropdown.Item
                active={paperSize === 'Letter'}
                onClick={() => {
                  setPaperSize('Letter');
                }}
              >
                {translations.letter}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button className="ms-auto" variant="primary" onClick={handlePrint}>
            <Download />
            <span className="d-none d-md-inline ms-2">
              {translations.downloadDiploma}
            </span>
          </Button>
        </div>

        <div className="strength-diploma-page__preview">
          <StrengthDiplomaFrame>
            <StrengthDiplomaContent
              isInteractive
              logoSource={logoSource}
              studentName={studentName}
              signatureName={signatureName}
              selectedStrengths={selectedStrengths}
              date={date}
              locale={diplomaLanguage}
              dateFormat={dateFormat}
              translations={translations}
              onStudentNameChange={setStudentName}
              onSignatureNameChange={setSignatureName}
              onStrengthsAreaClick={() => {
                if (selectedStrengths.length < 3) {
                  setIsStrengthModalOpen(true);
                }
              }}
              onRemoveStrength={handleRemoveStrength}
              onDateChange={setDate}
            />
          </StrengthDiplomaFrame>
        </div>
      </div>

      <StrengthModal
        isOpen={isStrengthModalOpen}
        locale={diplomaLanguage}
        selectedStrengthSlugs={selectedStrengths}
        onClose={() => {
          setIsStrengthModalOpen(false);
        }}
        onStrengthSelected={handleAddStrength}
      />
    </>
  );
}
