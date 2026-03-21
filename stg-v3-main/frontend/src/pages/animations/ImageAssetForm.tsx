import {useState, type ChangeEvent} from 'react';
import {Row, Col, Form, Button, Image} from 'react-bootstrap';
import {
  type StrengthSlug,
  type AnimationImageAsset,
  type LanguageCode,
} from '@client/ApiTypes.js';
import {ShiftFill} from 'react-bootstrap-icons';
import {
  generateTextBanner,
  generateIntroCard,
  generateTaskCard,
  generateChallengeCard,
  generateColor,
  generateButton,
  blobToDataUrl,
} from './assetGenerators.js';
import {
  strengthColorMap,
  strengthSlugs,
  strengthTranslationMap,
} from '@/helpers/strengths.js';

type Properties = {
  readonly asset: AnimationImageAsset;
  readonly src: Record<LanguageCode, string | undefined>;
  readonly onChange: (asset: AnimationImageAsset) => void;
  readonly setAsset: (
    lang: LanguageCode,
    assetId: string,
    data: string,
  ) => Promise<void>;
};

const renderTypeOptions: Array<{
  value: AnimationImageAsset['renderType'];
  label: string;
}> = [
  {value: 'text-banner', label: 'Text Banner'},
  {value: 'intro-card', label: 'Intro Card'},
  {value: 'task-card', label: 'Task Card'},
  {value: 'challenge-card', label: 'Challenge Card'},
  {value: 'color-picker', label: 'Color Picker'},
  {value: 'button', label: 'Button'},
  {value: 'fileupload', label: 'File Upload'},
  {value: 'hidden', label: 'Hidden'},
];

const rgbaToHex = (color: {r: number; g: number; b: number; a: number}) => {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
};

const generateAsset = async (
  asset: AnimationImageAsset,
  lang: LanguageCode,
): Promise<string | undefined> => {
  switch (asset.renderType) {
    case 'text-banner': {
      return generateTextBanner(
        asset.translations[lang],
        asset.fontSize,
        asset.width,
        asset.height,
      );
    }

    case 'intro-card': {
      return generateIntroCard(
        asset.translations[lang],
        asset.fontSize,
        asset.width,
        asset.height,
      );
    }

    case 'task-card': {
      return generateTaskCard(
        asset.translations[lang],
        asset.fontSize,
        asset.width,
        asset.height,
      );
    }

    case 'challenge-card': {
      return generateChallengeCard(
        asset.translations[lang],
        asset.fontSize,
        asset.width,
        asset.height,
        asset.color,
      );
    }

    case 'color-picker': {
      return generateColor(asset.color, asset.width, asset.height);
    }

    case 'button': {
      return generateButton(
        asset.translations[lang],
        asset.fontSize,
        asset.width,
        asset.height,
      );
    }

    default: {
      console.warn(`Unsupported render type: ${asset.renderType}`);
      return undefined;
    }
  }
};

export default function ImageAssetForm({
  asset,
  src,
  onChange,
  setAsset,
}: Properties) {
  const languages = Object.keys(src) as LanguageCode[];
  const [selectedStrength, setSelectedStrength] = useState<StrengthSlug | ''>(
    '',
  );
  const [selectedShade, setSelectedShade] = useState<
    '100' | '300' | '500' | ''
  >('');

  const parseHex = (hexWithHash: string) => {
    const hex = hexWithHash.replace(/^#/, '');
    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);
    return {r, g, b, a: asset.color.a};
  };

  const applyStrengthColor = (
    slug: StrengthSlug,
    shade: '100' | '300' | '500',
  ) => {
    const hex = strengthColorMap[slug][shade];
    if (!hex) return;
    const {r, g, b, a} = parseHex(hex);
    onChange({
      ...asset,
      color: {r, g, b, a},
    });
  };

  const generateAllLanguages = async () => {
    for (const lang of languages) {
      // eslint-disable-next-line no-await-in-loop
      const generatedData = await generateAsset(asset, lang);
      if (generatedData) {
        // eslint-disable-next-line no-await-in-loop
        await setAsset(lang, asset.assetId, generatedData);
      } else {
        console.error(
          `Failed to generate asset for ${asset.assetId} in ${lang}`,
        );
      }
    }
  };

  const capitalizeForLang = (lang: LanguageCode) => {
    const current = asset.translations[lang] || '';
    const upper = current.toLocaleUpperCase(lang);
    onChange({
      ...asset,
      translations: {
        ...asset.translations,
        [lang]: upper,
      },
    });
  };

  const isTextBasedType =
    asset.renderType === 'text-banner' ||
    asset.renderType === 'intro-card' ||
    asset.renderType === 'task-card' ||
    asset.renderType === 'challenge-card' ||
    asset.renderType === 'button';

  const showColorControls =
    asset.renderType === 'color-picker' ||
    asset.renderType === 'challenge-card';

  return (
    <>
      <Form.Group controlId={`${asset.assetId}-renderType`} className="mb-3">
        <Form.Label>Render Type</Form.Label>
        <Form.Select
          value={asset.renderType}
          onChange={(event) => {
            const newType = event.target.value;
            onChange({
              ...asset,
              renderType: newType,
            });
          }}
        >
          {renderTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {showColorControls ? (
        <>
          <Form.Group controlId={`${asset.assetId}-strength`} className="mb-2">
            <Form.Label>Pick Strength</Form.Label>
            <Form.Select
              value={selectedStrength}
              onChange={(event) => {
                const slug = event.target.value as StrengthSlug;
                setSelectedStrength(slug);
                if (slug && selectedShade) {
                  applyStrengthColor(slug, selectedShade);
                }
              }}
            >
              <option value="">–– Select Strength ––</option>
              {strengthSlugs.map((slug) => (
                <option key={slug} value={slug}>
                  {(strengthTranslationMap as any)[slug].en}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId={`${asset.assetId}-shade`} className="mb-2">
            <Form.Label>Or Enter a Custom Color</Form.Label>
            <Form.Select
              value={selectedShade}
              onChange={(event) => {
                const shade = event.target.value as '100' | '300' | '500';
                setSelectedShade(shade || '');
                if (shade && selectedStrength) {
                  applyStrengthColor(selectedStrength, shade);
                }
              }}
            >
              <option value="">–– Select Shade ––</option>
              <option value="100">100</option>
              <option value="300">300</option>
              <option value="500">500</option>
            </Form.Select>
          </Form.Group>

          <Form.Group
            controlId={`${asset.assetId}-custom-color`}
            className="mb-2"
          >
            <Form.Label>Or Enter a Custom Color</Form.Label>
            <Form.Control
              type="color"
              value={rgbaToHex(asset.color)}
              onChange={(event) => {
                setSelectedStrength('');
                setSelectedShade('');
                const {r, g, b, a} = parseHex(event.target.value);
                onChange({
                  ...asset,
                  color: {r, g, b, a},
                });
              }}
            />
          </Form.Group>

          <Button
            variant="primary"
            className="mb-3"
            onClick={generateAllLanguages}
          >
            Generate All Languages
          </Button>
        </>
      ) : null}

      <Row>
        {languages.map((lang) => (
          <Col key={lang} md={12 / languages.length}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center gap-2">
                <strong>{lang.toUpperCase()}</strong>
                {isTextBasedType ? (
                  <Button
                    variant="outline-secondary"
                    aria-label={`Capitalize ${lang} text`}
                    title="Capitalize text"
                    className="px-1"
                    style={{
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: -3,
                      overflow: 'visible', // allow icon to extend outside
                    }}
                    onClick={() => {
                      capitalizeForLang(lang);
                    }}
                  >
                    <ShiftFill size={10} />
                  </Button>
                ) : null}
              </div>
              <div>
                {src[lang]
                  ? `${(src[lang].length / 1024).toFixed(1)} kB`
                  : 'No audio'}
              </div>
            </div>
            {asset.renderType === 'fileupload' && (
              <Form.Group
                controlId={`${asset.assetId}-${lang}-file`}
                className="mt-2 mb-2"
              >
                <Form.Control
                  type="file"
                  onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    try {
                      const dataUrl = await blobToDataUrl(file);
                      await setAsset(lang, asset.assetId, dataUrl);
                    } catch (error) {
                      console.error(
                        'Failed to convert file to data URL',
                        error,
                      );
                    }
                  }}
                />
              </Form.Group>
            )}
            {isTextBasedType ? (
              <>
                <Form.Group
                  controlId={`${asset.assetId}-${lang}-text`}
                  className="mt-2 mb-2"
                >
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={asset.translations[lang] || ''}
                    onChange={(event) => {
                      onChange({
                        ...asset,
                        translations: {
                          ...asset.translations,
                          [lang]: event.target.value,
                        },
                      });
                    }}
                  />
                </Form.Group>

                <Form.Group
                  controlId={`${asset.assetId}-${lang}-fs`}
                  className="mb-2"
                >
                  <Form.Label>Font Size</Form.Label>
                  <Form.Control
                    type="number"
                    value={asset.fontSize}
                    onChange={(event) => {
                      const newSize =
                        Number(event.target.value) || asset.fontSize;
                      onChange({
                        ...asset,
                        fontSize: newSize,
                      });
                    }}
                  />
                </Form.Group>
              </>
            ) : null}

            {isTextBasedType ? (
              <Button
                variant="primary"
                disabled={!src[lang]}
                className="mt-2 mb-3 w-100"
                onClick={async () => {
                  const generatedData = await generateAsset(asset, lang);
                  if (generatedData) {
                    await setAsset(lang, asset.assetId, generatedData);
                  } else {
                    console.error(
                      `Failed to generate asset for ${asset.assetId} in ${lang}`,
                    );
                  }
                }}
              >
                Generate
              </Button>
            ) : null}
            <Image
              thumbnail
              fluid
              src={src[lang]}
              alt={`Preview for ${asset.assetId} in ${lang}`}
            />
          </Col>
        ))}
      </Row>
    </>
  );
}
