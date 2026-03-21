import {type ChangeEvent, useRef} from 'react';
import {Row, Col, Form, Button} from 'react-bootstrap';
import {type AnimationAudioAsset, type LanguageCode} from '@client/ApiTypes.js';
import {blobToDataUrl, generateVoiceOver} from './assetGenerators.js';

type Properties = {
  readonly asset: AnimationAudioAsset;
  readonly src: Record<LanguageCode, string | undefined>;
  readonly onChange: (asset: AnimationAudioAsset) => void;
  readonly setAsset: (
    lang: LanguageCode,
    assetId: string,
    data: string,
  ) => Promise<void>;
};

const renderTypeOptions: Array<{
  value: AnimationAudioAsset['renderType'];
  label: string;
}> = [
  {value: 'voiceover', label: 'Voice‐Over'},
  {value: 'fileupload', label: 'File Upload'},
  {value: 'hidden', label: 'Hidden'},
];

const generateAsset = async (
  asset: AnimationAudioAsset,
  lang: LanguageCode,
): Promise<string | undefined> => {
  if (asset.renderType === 'voiceover') {
    const textForLang = asset.translations[lang] || '';
    if (!textForLang.trim()) {
      console.warn(`No text provided for voice‐over in ${lang}`);
      return undefined;
    }

    return generateVoiceOver(textForLang, lang);
  }

  return undefined;
};

export default function AudioAssetForm({
  asset,
  src,
  onChange,
  setAsset,
}: Properties) {
  const audioReferences = useRef<
    Partial<Record<LanguageCode, HTMLAudioElement>>
  >({});
  const languages = Object.keys(src) as LanguageCode[];

  return (
    <Row>
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

      {languages.map((lang) => (
        <Col key={lang} md={12 / languages.length}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong>{lang.toUpperCase()} </strong>
            {src[lang]
              ? `${(src[lang].length / 1024).toFixed(1)} kB`
              : 'No audio'}
          </div>

          {asset.renderType === 'fileupload' && (
            <>
              <Form.Group
                controlId={`${asset.assetId}-${lang}-file`}
                className="mb-3"
              >
                <Form.Control
                  type="file"
                  accept="audio/*"
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
              {src[lang] ? (
                <audio controls src={src[lang]} style={{width: '100%'}} />
              ) : null}
            </>
          )}

          {asset.renderType === 'voiceover' && (
            <>
              <Form.Group
                controlId={`${asset.assetId}-${lang}-text`}
                className="mb-3"
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

              <Button
                variant="primary"
                disabled={!asset.translations[lang]?.trim()}
                className="mb-3 w-100"
                onClick={async () => {
                  const generatedData = await generateAsset(asset, lang);
                  if (generatedData) {
                    await setAsset(lang, asset.assetId, generatedData);

                    setTimeout(() => {
                      const player = audioReferences.current[lang];
                      if (player) {
                        void player.play();
                      }
                    }, 0);
                  } else {
                    console.error(
                      `Failed to generate voice‐over for ${asset.assetId} in ${lang}`,
                    );
                  }
                }}
              >
                Generate Voice‐Over
              </Button>
              {src[lang] ? (
                <audio
                  ref={(element) => {
                    audioReferences.current[lang] = element ?? undefined;
                  }}
                  controls
                  src={src[lang]}
                  style={{width: '100%'}}
                />
              ) : null}
            </>
          )}
        </Col>
      ))}
    </Row>
  );
}
