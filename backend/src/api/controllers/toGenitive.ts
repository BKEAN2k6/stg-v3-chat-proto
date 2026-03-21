import {type LanguageCode} from '../client/ApiTypes.js';

const groupTranslations = {
  en: 'group',
  fi: 'ryhmä',
  sv: 'grupp',
};

const communityTranslations = {
  en: 'community',
  fi: 'yhteisö',
  sv: 'gemenskap',
};

export function toGenitiveCommunityName(
  lang: LanguageCode,
  firstName: string,
): string {
  return `${toGenitive(lang, firstName)} ${communityTranslations[lang]}`;
}

export function toGenitiveCommunitDescription(
  lang: LanguageCode,
  firstName: string,
  lastName: string,
): string {
  return `${firstName} ${toGenitive(lang, lastName)} ${communityTranslations[lang]}.`;
}

export function toGenitiveGroupName(
  lang: LanguageCode,
  firstName: string,
): string {
  return `${toGenitive(lang, firstName)} ${groupTranslations[lang]}`;
}

export function toGenitiveGroupDescription(
  lang: LanguageCode,
  firstName: string,
  lastName: string,
): string {
  return `${firstName} ${toGenitive(lang, lastName)} ${groupTranslations[lang]}.`;
}

// eslint-disable-next-line complexity
export function toGenitive(lang: LanguageCode, name: string): string {
  if (!name) return '';

  switch (lang) {
    case 'fi': {
      const lowerName = name.toLowerCase();
      const vowels = 'aeiouyäöAEIOUYÄÖ'; // Used for checking if a char is a vowel
      const shortVowelsLower = 'aeiouyäö'; // Used for specific vowel checks (lowercase only)

      // 0. Handle single-letter names (e.g., A -> A:n)
      if (name.length === 1 && /^[a-zA-ZäöÄÖ]$/.test(name)) {
        return name + ':n';
      }

      const lastCharOriginal = name.slice(-1);
      const lastCharLower = lastCharOriginal.toLowerCase();

      // Rule 0.5: Specific e-stems (Säde -> Säteen, Kate -> Katteen)
      if (name.length >= 2 && lastCharLower === 'e') {
        const charBeforeELower = lowerName.slice(-2, -1);
        const originalCharBeforeE = name.slice(-2, -1);

        if (charBeforeELower === 'd') {
          const base = name.slice(0, -2);
          const tChar = originalCharBeforeE === 'D' ? 'T' : 't';
          return base + tChar + 'een';
        }

        if (
          charBeforeELower === 't' &&
          (lowerName.length < 3 || lowerName.slice(-3, -2) !== 't')
        ) {
          const stem = name.slice(0, -1);
          return stem + 'een';
        }
      }

      // Rule 1: Words ending in -nen -> -sen
      if (lowerName.endsWith('nen')) {
        const base = name.slice(0, -3);
        return base + 'sen';
      }

      // Rule 2: Words ending in Vowel+s -> -Vksen
      if (lastCharLower === 's' && name.length >= 2) {
        const charBeforeSOriginal = name.slice(-2, -1);
        if (vowels.includes(charBeforeSOriginal)) {
          const base = name.slice(0, -1);
          return base + 'ksen';
        }
      }

      // Rule 3: Consonant-final names -> add -in
      if (!vowels.includes(lastCharOriginal)) {
        return name + 'in';
      }

      // Rule 4: Vowel-final names
      const stem = name.slice(0, -1);
      const finalVowel = lastCharOriginal;
      let finalStemForGenitive = stem;

      if (stem.length > 0) {
        let basePartOfStem = '';
        let strongConsOriginal = '';
        let weakConsCore = '';

        if (stem.length >= 2) {
          strongConsOriginal = stem.slice(-2);
          const currentStrongConsLower = strongConsOriginal.toLowerCase();
          basePartOfStem = stem.slice(0, -2);

          switch (currentStrongConsLower) {
            case 'kk': {
              weakConsCore = 'k';
              break;
            }

            case 'pp': {
              weakConsCore = 'p';
              break;
            }

            case 'tt': {
              weakConsCore = 't';
              break;
            }

            case 'nt': {
              weakConsCore = 'nn';
              break;
            }

            case 'mp': {
              weakConsCore = 'mm';
              break;
            }

            default: {
              break;
            }
          }
        }

        if (!weakConsCore && stem.length > 0) {
          strongConsOriginal = stem.slice(-1);
          const currentStrongConsLower = strongConsOriginal.toLowerCase();
          basePartOfStem = stem.slice(0, -1);
          // Const charBeforeStrongLower = basePartOfStem.slice(-1).toLowerCase();
          const finalVowelLower = finalVowel.toLowerCase();

          const charBeforeStrongForContext = basePartOfStem
            .slice(-1)
            .toLowerCase();
          const isPrecededByAllowedContext =
            basePartOfStem.length === 0 ||
            shortVowelsLower.includes(charBeforeStrongForContext) ||
            charBeforeStrongForContext === 'r' ||
            charBeforeStrongForContext === 'l' ||
            charBeforeStrongForContext === 'h';

          switch (currentStrongConsLower) {
            case 't': {
              weakConsCore = 't'; // Default: t stays t
              const charBeforeStrongLowerT = basePartOfStem
                .slice(-1)
                .toLowerCase(); // Specific for t-context
              if (
                isPrecededByAllowedContext &&
                !basePartOfStem.toLowerCase().endsWith('s')
              ) {
                if (finalVowelLower === 'u') {
                  const isLongEeBeforeTu = basePartOfStem
                    .toLowerCase()
                    .endsWith('ee');
                  weakConsCore = isLongEeBeforeTu ? 't' : 'd';
                } else if (finalVowelLower === 'i') {
                  const isDiphthongOuTiPattern = basePartOfStem
                    .toLowerCase()
                    .endsWith('ou');
                  const isAhtiLike = charBeforeStrongLowerT === 'h';
                  if (isDiphthongOuTiPattern) {
                    weakConsCore = 't';
                  } else if (isAhtiLike) {
                    weakConsCore = 'd';
                  } else if (
                    shortVowelsLower.includes(charBeforeStrongLowerT)
                  ) {
                    weakConsCore = 'd';
                  }
                }
              }

              break;
            }

            case 'p': {
              weakConsCore = currentStrongConsLower; // Default: 'p' (or original case) stays 'p'
              const baseStemLower = basePartOfStem.toLowerCase(); // E.g., "Roo" for Roope, "Vir" for Virpi
              // finalVowelLower is already defined

              // Check if single 'p' is in a context where it *could* gradate
              if (isPrecededByAllowedContext && !baseStemLower.endsWith('p')) {
                // Default assumption for gradable 'p' in this context is that it becomes 'v'
                let determinedWeakP = 'v';

                // Check for specific patterns where 'p' should remain 'p' (its original strong form)
                // Note: baseStemLower is the part *before* the 'p'.
                // strongConsOriginal is 'p' (or 'P')
                // finalVowelLower is the lowercase version of the vowel *after* 'p'.

                if (
                  (baseStemLower === 'roo' && finalVowelLower === 'e') || // Roope (Roo-p-e -> Roo-p-en)
                  (baseStemLower === 'aa' && finalVowelLower === 'o') || // Aapo (Aa-p-o -> Aa-p-on)
                  (baseStemLower === 'to' && finalVowelLower === 'i') || // Topi (To-p-i -> To-p-in)
                  (baseStemLower === 'vir' && finalVowelLower === 'i') || // Virpi (Vir-p-i -> Vir-p-in)
                  (baseStemLower === 'sir' && finalVowelLower === 'a')
                ) {
                  // Sirpa (Sir-p-a -> Sir-p-an)
                  determinedWeakP = currentStrongConsLower; // 'p' stays
                }
                // Special case for 'siipi' pattern (e.g. Sii-p-i -> Sii-v-en)
                // where 'ii' + p -> 'iiv'
                else if (
                  baseStemLower.endsWith('sii') &&
                  finalVowelLower === 'i'
                ) {
                  determinedWeakP = 'v'; // 'p' becomes 'v'
                }

                // If none of the above specific patterns match, the default 'v'
                // for a gradable 'p' in an isPrecededByAllowedContext applies (e.g. Lupa -> Luvan, Käpy -> Kävyn).
                weakConsCore = determinedWeakP;
              }

              break;
            }

            case 'k': {
              weakConsCore = 'k';
              break;
            }

            default: {
              break;
            }
          }
        }

        if (
          weakConsCore &&
          (strongConsOriginal.toLowerCase() !== weakConsCore ||
            weakConsCore.length !== strongConsOriginal.length ||
            (strongConsOriginal.toLowerCase() === 'k' && weakConsCore === ''))
        ) {
          let casedWeakCons = weakConsCore;
          if (strongConsOriginal.length > 0) {
            if (
              strongConsOriginal === strongConsOriginal.toUpperCase() &&
              strongConsOriginal !== strongConsOriginal.toLowerCase()
            ) {
              casedWeakCons = weakConsCore.toUpperCase();
            } else if (
              strongConsOriginal.charAt(0) === // eslint-disable-line @typescript-eslint/prefer-string-starts-ends-with
                strongConsOriginal.charAt(0).toUpperCase() &&
              strongConsOriginal.charAt(0) !== // eslint-disable-line @typescript-eslint/prefer-string-starts-ends-with
                strongConsOriginal.charAt(0).toLowerCase()
            ) {
              casedWeakCons =
                weakConsCore.length > 0
                  ? casedWeakCons.charAt(0).toUpperCase() +
                    casedWeakCons.slice(1)
                  : '';
            }
          }

          finalStemForGenitive = basePartOfStem + casedWeakCons;
        }
      }

      let effectiveFinalVowel = finalVowel;
      if (finalVowel.toLowerCase() === 'i') {
        if (finalStemForGenitive.toLowerCase() === 'sin') {
          effectiveFinalVowel = finalVowel === 'I' ? 'E' : 'e';
        } else if (
          name.toLowerCase().endsWith('iipi') &&
          finalStemForGenitive.toLowerCase().endsWith('iiv')
        ) {
          effectiveFinalVowel = finalVowel === 'I' ? 'E' : 'e';
        }
      }

      return finalStemForGenitive + effectiveFinalVowel + 'n';
    }

    case 'sv': {
      const lowerNameSv = name.toLowerCase();
      if (
        lowerNameSv.endsWith('s') ||
        lowerNameSv.endsWith('x') ||
        lowerNameSv.endsWith('z')
      ) {
        return name + "'";
      }

      return name + 's';
    }

    case 'en': {
      if (name.endsWith('s') || name.endsWith('S')) {
        return name + "'";
      }

      return name + "'s";
    }
  }

  return name;
}
