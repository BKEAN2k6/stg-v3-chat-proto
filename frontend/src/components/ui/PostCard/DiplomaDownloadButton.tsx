import {Trans} from '@lingui/react/macro';
import {format} from 'date-fns';
import {Dropdown} from 'react-bootstrap';
import {type StrengthSlug, type Group} from '@client/ApiTypes';
import {type ButtonVariant} from 'react-bootstrap/esm/types';
import {strengthColorMap, strengthTranslationMap} from '@/helpers/strengths.js';
import {diplomaTranslations} from '@/helpers/diplomaTranslations.js';

type Properties = {
  readonly strength: StrengthSlug;
  readonly group: Group;
  readonly date: string;
  readonly variant?: ButtonVariant;
  readonly isFullWidth?: boolean;
};

export default function DiplomaDownloadButton({
  strength,
  group,
  date,
  variant = 'primary',
  isFullWidth = false,
}: Properties) {
  const handleDownloadDiploma = async (paperSize: 'A4' | 'Letter') => {
    try {
      const targetLang = group.language || 'en';
      const translations = diplomaTranslations[targetLang];
      const strengthTitle = strengthTranslationMap[strength][targetLang];
      const strengthColor = strengthColorMap[strength][500];
      const strengthBadgeColor = strengthColorMap[strength][300];
      const formattedDate = format(new Date(date), 'yyyy-MM-dd');

      const response = await fetch(
        `/api/v1/groups/${group.id}/strength-diploma/download`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: formattedDate,
            strength,
            paperSize,
            translations: {
              strengthDiploma: translations.strengthDiploma,
              diplomaAwardedTo: translations.diplomaAwardedToGroup,
              forUsingStrengths: translations.forUsingStrengths,
              forCompletingStrength: translations.forCompletingStrength,
              signature: translations.signature,
              date: translations.date,
              strengthTitle,
              diploma: translations.diploma,
            },
            signerName: translations.signedByStrengthCrow,
            strengthColor,
            strengthBadgeColor,
          }),
        },
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = globalThis.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const groupName = group.name;
        const namePart = groupName ? ` - ${groupName}` : '';
        const strengthPart = strengthTitle ? ` - ${strengthTitle}` : '';
        a.download = `${translations.fileName}${strengthPart}${namePart}.pdf`;
        document.body.append(a);
        a.click();
        globalThis.URL.revokeObjectURL(url);
        a.remove();
      } else {
        console.error('Diploma download failed');
      }
    } catch (error) {
      console.error('Error downloading diploma:', error);
    }
  };

  const fullWidthClass = isFullWidth ? 'w-100' : undefined;

  return (
    <Dropdown className={fullWidthClass}>
      <Dropdown.Toggle variant={variant} className={fullWidthClass}>
        <Trans>Download diploma</Trans>
      </Dropdown.Toggle>
      <Dropdown.Menu className={fullWidthClass}>
        <Dropdown.Item onClick={async () => handleDownloadDiploma('A4')}>
          <Trans>A4</Trans>
        </Dropdown.Item>
        <Dropdown.Item onClick={async () => handleDownloadDiploma('Letter')}>
          <Trans>Letter</Trans>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
