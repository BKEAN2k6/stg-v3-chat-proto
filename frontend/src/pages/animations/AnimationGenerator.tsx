/* eslint-disable complexity */
/* eslint-disable no-alert */
import {useState, useEffect, type ChangeEvent, useCallback} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {unzip} from 'unzipit';
import {gzip} from 'pako';
import {Form, Button, Card} from 'react-bootstrap';
import {
  type AnimationAudioAsset,
  type AnimationImageAsset,
  type AnimationSegment,
  type CreateAnimationResponse,
  type AnimationLottie,
  type LanguageCode,
} from '@client/ApiTypes.js';
import {ArrowDown, ArrowUp} from 'react-bootstrap-icons';
import api from '@client/ApiClient';
import {JsonEditor} from 'json-edit-react';
import ZipUploadCard from './ZipUploadCard.js';
import AssetClassificationModal from './AssetClassificationModal.js';
import AnimationAssetForm from './AnimationAssetForm.js';
import AnimationSegmentsForm from './AnimationSegmentsForm.js';
import EmbedLinksSection from './EmbedLinksSection.js';
import AssetFilename from './AssetFilename.js';
import {
  generateButton,
  generateColor,
  generateIntroCard,
  generateTaskCard,
  generateChallengeCard,
  generateTextBanner,
  generateVoiceOver,
  blobToDataUrl,
} from './assetGenerators.js';
import LottiePlayer from '@/components/ui/LottiePlayer/LottiePlayer.js';
import constants from '@/constants.js';
import PageTitle from '@/components/ui/PageTitle.js';
import {Loader} from '@/components/ui/Loader.js';

type AnimationAsset = AnimationAudioAsset | AnimationImageAsset;

enum AnimationAssetType {
  image = 'image',
  audio = 'audio',
}

const mimeTypes = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
};

const assetTypes = {
  png: AnimationAssetType.image,
  jpg: AnimationAssetType.image,
  jpeg: AnimationAssetType.image,
  mp3: AnimationAssetType.audio,
  wav: AnimationAssetType.audio,
  ogg: AnimationAssetType.audio,
};

export default function AnimationGenerator() {
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [loop, setLoop] = useState<boolean>(false);
  const [rawMode, setRawMode] = useState<boolean>(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState<boolean>(false);
  const [assetSettings, setAssetSettings] = useState<
    Array<AnimationAudioAsset | AnimationImageAsset>
  >([]);
  const [baseAnimation, setBaseAnimation] = useState<
    AnimationLottie | undefined
  >(undefined);
  const [animations, setAnimations] = useState<Record<string, AnimationLottie>>(
    {},
  );
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('en');
  const [assetsToModify, setAssetsToModify] = useState<string[]>([]);
  const {animationId} = useParams<{animationId?: string}>();
  const [showClassificationModal, setShowClassificationModal] = useState(false);
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);
  const [processingZip, setProcessingZip] = useState<boolean>(
    Boolean(animationId),
  );
  const [segments, setSegments] = useState<AnimationSegment[]>([]);
  useEffect(() => {
    async function loadExistingAnimation() {
      if (!animationId) return;

      setProcessingZip(true);
      try {
        const metaData = await api.getAnimation({id: animationId});
        setName(metaData.name || '');
        setLoop(metaData.loop || false);
        setIsChecked(metaData.isChecked || false);
        setAssetSettings(metaData.assetSettings || []);
        setAssetsToModify(metaData.assetSettings.map((asset) => asset.assetId));
        setSegments(metaData.segments || []);

        const fetchedAnimations: Record<string, AnimationLottie> = {};
        const langs: LanguageCode[] = ['en', 'fi', 'sv'];
        for (const lang of langs) {
          try {
            const baseUrl = constants.FILE_HOST;
            const url = `${baseUrl}animation-${animationId}-${lang}.json`;
            // eslint-disable-next-line no-await-in-loop
            const animationResponse = await fetch(url);
            if (!animationResponse.ok) {
              console.warn(
                `No JSON found for lang ${lang}: ${animationResponse.status}`,
              );
              continue;
            }

            const animationJson =
              // eslint-disable-next-line no-await-in-loop
              (await animationResponse.json()) as AnimationLottie;
            fetchedAnimations[lang] = animationJson;
          } catch (error) {
            console.error(`Error fetching animation JSON for ${lang}:`, error);
          }
        }

        const availableLangs = Object.keys(fetchedAnimations);
        if (availableLangs.length > 0) {
          const primaryLang = availableLangs[0];
          setBaseAnimation(fetchedAnimations[primaryLang]);
          setAnimations(fetchedAnimations);
        }
      } catch (error) {
        console.error('Error loading existing animation:', error);
        alert(
          `Error loading existing animation: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      } finally {
        setProcessingZip(false);
      }
    }

    void loadExistingAnimation();
  }, [animationId]);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProcessingZip(true);
    try {
      const blobUrl = URL.createObjectURL(file);
      const {entries} = await unzip(blobUrl);
      URL.revokeObjectURL(blobUrl);

      const jsonEntryPair = Object.entries(entries).find(([name]) =>
        name.toLowerCase().endsWith('.json'),
      );
      if (!jsonEntryPair) throw new Error('No JSON file found in ZIP');

      const [, jsonFileEntry] = jsonEntryPair;
      const buffer = await jsonFileEntry.arrayBuffer();
      const baseJson = JSON.parse(
        new TextDecoder().decode(buffer),
      ) as AnimationLottie;

      const assetProcessingPromises = baseJson.assets.map(async (asset) => {
        if (!asset.p || !asset.u) {
          return asset;
        }

        const assetEntryPair = Object.entries(entries).find(
          ([name]) => name === asset.p || name.endsWith(`/${asset.p}`),
        );
        if (!assetEntryPair) {
          console.warn(`Asset not found in ZIP: ${asset.p}`);
          return asset;
        }

        const blob = await assetEntryPair[1].blob();
        const fileExtension = asset.p.split('.').pop()?.toLowerCase();
        const mimeType =
          mimeTypes[fileExtension! as keyof typeof mimeTypes] ||
          'application/octet-stream';
        const dataUrl = await blobToDataUrl(blob.slice(0, blob.size, mimeType));

        if (
          !fileExtension ||
          (fileExtension !== 'png' &&
            fileExtension !== 'jpg' &&
            fileExtension !== 'jpeg' &&
            fileExtension !== 'mp3' &&
            fileExtension !== 'wav' &&
            fileExtension !== 'ogg')
        ) {
          throw new Error('File extension not supported: ' + fileExtension);
        }

        setAssetsToModify((previous) => [...previous, asset.id]);

        const assetType = assetTypes[fileExtension];

        switch (assetType) {
          case AnimationAssetType.image: {
            setAssetSettings((previous) => [
              ...previous,
              {
                assetType: 'image',
                assetId: asset.id,
                renderType: 'fileupload',
                name: asset.p!,
                translations: {
                  en: '',
                  fi: '',
                  sv: '',
                },
                width: asset.w!,
                height: asset.h!,
                color: {r: 0, g: 0, b: 0, a: 1},
                fontSize: 80,
              },
            ]);

            break;
          }

          case AnimationAssetType.audio: {
            setAssetSettings((previous) => [
              ...previous,
              {
                assetType: AnimationAssetType.audio,
                assetId: asset.id,
                renderType: 'fileupload',
                name: asset.p!,
                translations: {
                  en: '',
                  fi: '',
                  sv: '',
                },
              },
            ]);
            break;
          }
        }

        return {
          ...asset,
          p: dataUrl,
          u: '',
        };
      });

      const results = await Promise.all(assetProcessingPromises);
      baseJson.assets = results;

      setBaseAnimation(baseJson);
      setAnimations(() => ({
        en: structuredClone(baseJson),
        fi: structuredClone(baseJson),
        sv: structuredClone(baseJson),
      }));
      setSelectedLang('en');
      setModalCurrentIndex(0);
      setShowClassificationModal(true);
    } catch (error) {
      console.error('ZIP load failed:', error);
      alert(
        `ZIP load failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    } finally {
      setProcessingZip(false);
    }
  };

  const handleModalNext = () => {
    if (modalCurrentIndex < assetsToModify.length - 1) {
      setModalCurrentIndex((i) => i + 1);
    } else {
      setShowClassificationModal(false);
    }
  };

  const handleModalPrevious = () => {
    if (modalCurrentIndex > 0) setModalCurrentIndex((i) => i - 1);
  };

  const handleReclassify = () => {
    const hiddenAssetIds = assetSettings
      .filter((a) => a.renderType === 'hidden')
      .map((a) => a.assetId);

    setAssetsToModify(hiddenAssetIds);
    setModalCurrentIndex(0);
    setShowClassificationModal(true);
  };

  const handleAassetUpdate = useCallback((asset: AnimationAsset) => {
    setAssetSettings((previous) => {
      const existingIndex = previous.findIndex(
        (a) => a.assetId === asset.assetId,
      );
      if (existingIndex !== -1) {
        const updatedAssets = [...previous];
        updatedAssets[existingIndex] = asset;
        return updatedAssets;
      }

      return [...previous, asset];
    });
  }, []);

  const assetToModify = baseAnimation?.assets.find(
    (asset) => asset.id === assetsToModify[modalCurrentIndex],
  );

  const setDataToJson = useCallback(
    async (lang: LanguageCode, assetId: string, data: string) => {
      const updatedAnimations = {...animations};
      const assetIndex = updatedAnimations[lang].assets.findIndex(
        (a) => a.id === assetId,
      );
      if (assetIndex === -1) {
        console.warn(
          `Asset with ID ${assetId} not found in ${lang} animations`,
        );
        return;
      }

      const asset = updatedAnimations[lang].assets[assetIndex];
      asset.p = data;
      updatedAnimations[lang].assets[assetIndex] = asset;
      setAnimations(updatedAnimations);
    },
    [animations],
  );

  const applySegments = useCallback(() => {
    const updatedAnimations: Record<string, AnimationLottie> = {};

    for (const lang of Object.keys(animations)) {
      updatedAnimations[lang] = {
        ...animations[lang],
        customSegments: segments,
      };
    }

    setAnimations(updatedAnimations);
  }, [animations, segments]);

  const assetSettingsToModify = assetSettings.find(
    (a) => a.assetId === assetToModify?.id,
  );

  const handleLoopChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLoop(event.target.checked);
    const updatedAnimations: Record<string, AnimationLottie> = {};
    for (const lang of Object.keys(animations)) {
      updatedAnimations[lang] = {
        ...animations[lang],
        loop: event.target.checked,
      };
    }

    setAnimations(updatedAnimations);
  };

  if (
    baseAnimation &&
    showClassificationModal &&
    assetToModify?.p &&
    assetSettingsToModify
  ) {
    return (
      <AssetClassificationModal
        show={showClassificationModal}
        assetSettings={assetSettingsToModify}
        assetData={assetToModify.p}
        assetNumber={modalCurrentIndex + 1}
        assetCount={assetsToModify.length}
        handleAassetUpdate={handleAassetUpdate}
        onPrevious={handleModalPrevious}
        onNext={handleModalNext}
      />
    );
  }

  if (processingZip) {
    return <Loader />;
  }

  const handleSaveAnimation = async (asCopy = false) => {
    applySegments();
    const body = {
      name,
      isChecked,
      animations: [
        {language: 'en', data: animations.en},
        {language: 'fi', data: animations.fi},
        {language: 'sv', data: animations.sv},
      ],
      assetSettings,
      segments,
      loop,
    };
    const compressedPayload = gzip(JSON.stringify(body));
    const isUpdate = Boolean(animationId) && !asCopy;
    const url = isUpdate
      ? `/api/v1/animations/${animationId}`
      : '/api/v1/animations';
    const method = isUpdate ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Encoding': 'gzip',
        },
        body: compressedPayload,
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Save failed: ${response.status} - ${errorData}`);
      }

      const result = (await response.json()) as CreateAnimationResponse;
      if (asCopy || !isUpdate) {
        navigate(`/animations/${result.id}`);
      } else {
        alert('Animation saved successfully!');
      }
    } catch (error) {
      console.error('Error saving animation:', error);
      alert(
        `Error saving animation: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  };

  const handleCreateVideoProcessingJob = async (lang: LanguageCode) => {
    const fileNameBase = name
      .toLowerCase()
      .replaceAll(/[^a-z\d\s-]/g, '')
      .replaceAll(/\s+/g, '-')
      .replaceAll(/-+/g, '-');

    try {
      const lastSegment = segments.length > 0 ? segments.at(-1) : undefined;
      const fr = animations[lang]?.fr ?? 30;
      const coverFrameTimestamp = lastSegment ? lastSegment.start / fr : 0;

      await api.createVideoProcessingJob({
        url: `${constants.FILE_HOST}animation-${animationId}-${lang}.json`,
        type: 'lottie',
        source: 'file',
        fileName: `${fileNameBase}-${lang}`,
        loop,
        // start of last segment in seconds
        coverFrameTimestamp,
        videoSegments: segments.map((segment) => ({
          start: segment.start / fr,
          stop: segment.stop / fr,
          loop: segment.loop,
          showToolbar: Boolean(segment.showToolbar),
          autoplay: Boolean(segment.autoplay),
        })),
        lottieSegments: segments,
      });
      alert(`Video processing job created for ${lang.toUpperCase()}!`);
    } catch (error) {
      alert(
        `Error creating video processing job: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  };

  const handleMoveAssetUp = (assetId: string) => {
    setAssetSettings((previous) => {
      const index = previous.findIndex((a) => a.assetId === assetId);
      if (index <= 0) return previous;
      const newAssets = [...previous];
      [newAssets[index - 1], newAssets[index]] = [
        newAssets[index],
        newAssets[index - 1],
      ];
      return newAssets;
    });
  };

  const handleMoveAssetDown = (assetId: string) => {
    setAssetSettings((previous) => {
      const index = previous.findIndex((a) => a.assetId === assetId);
      if (index === -1 || index >= previous.length - 1) return previous;
      const newAssets = [...previous];
      [newAssets[index + 1], newAssets[index]] = [
        newAssets[index],
        newAssets[index + 1],
      ];
      return newAssets;
    });
  };

  const handleGenerateAll = async () => {
    setIsGeneratingAll(true);
    try {
      const languages: LanguageCode[] = ['en', 'fi', 'sv'];

      for (const asset of assetSettings) {
        // skip hidden or fileupload assets
        if (
          asset.renderType === 'hidden' ||
          asset.renderType === 'fileupload'
        ) {
          continue;
        }

        for (const lang of languages) {
          let generatedData: string | undefined;

          if (asset.assetType === 'image') {
            const text = asset.translations[lang];
            // eslint-disable-next-line max-depth, @typescript-eslint/switch-exhaustiveness-check
            switch (asset.renderType) {
              case 'text-banner': {
                // eslint-disable-next-line no-await-in-loop
                generatedData = await generateTextBanner(
                  text,
                  asset.fontSize,
                  asset.width,
                  asset.height,
                );
                break;
              }

              case 'intro-card': {
                // eslint-disable-next-line no-await-in-loop
                generatedData = await generateIntroCard(
                  text,
                  asset.fontSize,
                  asset.width,
                  asset.height,
                );
                break;
              }

              case 'task-card': {
                // eslint-disable-next-line no-await-in-loop
                generatedData = await generateTaskCard(
                  text,
                  asset.fontSize,
                  asset.width,
                  asset.height,
                );
                break;
              }

              case 'challenge-card': {
                // eslint-disable-next-line no-await-in-loop
                generatedData = await generateChallengeCard(
                  text,
                  asset.fontSize,
                  asset.width,
                  asset.height,
                  asset.color,
                );
                break;
              }

              case 'button': {
                // eslint-disable-next-line no-await-in-loop
                generatedData = await generateButton(
                  text,
                  asset.fontSize,
                  asset.width,
                  asset.height,
                );
                break;
              }

              case 'color-picker': {
                generatedData = generateColor(
                  asset.color,
                  asset.width,
                  asset.height,
                );
                break;
              }
            }
          } else if (asset.assetType === 'audio') {
            const text = asset.translations[lang];
            // eslint-disable-next-line max-depth
            if (asset.renderType === 'voiceover' && text?.trim()) {
              // eslint-disable-next-line no-await-in-loop
              generatedData = await generateVoiceOver(text, lang);
            }
          }

          if (generatedData) {
            // wait for this write to finish before moving to the next
            // eslint-disable-next-line no-await-in-loop
            await setDataToJson(lang, asset.assetId, generatedData);
          }
        }
      }

      alert('All assets generated successfully!');
    } catch (error) {
      console.error('Failed to generate all assets:', error);
      alert(
        `Failed to generate all assets: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    } finally {
      setIsGeneratingAll(false);
    }
  };

  const assetsToShow = assetSettings.filter(
    (asset) => asset.renderType !== 'hidden',
  );

  return (
    <>
      <PageTitle
        title={animationId ? 'Animation Settings' : 'Create New Animation'}
      >
        {baseAnimation ? (
          <div className="d-flex justify-content-end gap-1">
            {animationId ? (
              <Button
                variant="secondary"
                disabled={!name}
                onClick={async () => handleSaveAnimation(true)}
              >
                Save As Copy
              </Button>
            ) : null}
            <Button
              variant="primary"
              disabled={!name}
              onClick={async () => handleSaveAnimation(false)}
            >
              Save
            </Button>

            <Button
              variant="warning"
              disabled={!assetSettings.some((a) => a.renderType === 'hidden')}
              onClick={handleReclassify}
            >
              Reclassify Hidden
            </Button>
          </div>
        ) : null}
      </PageTitle>

      {!baseAnimation && <ZipUploadCard onFileUpload={handleFileUpload} />}
      {animationId ? <EmbedLinksSection animationId={animationId} /> : null}

      {baseAnimation ? (
        <>
          <h5>Name</h5>
          <Form.Group controlId="nameInput" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </Form.Group>
          <h5>Status</h5>
          <Form.Group controlId="isCheckedCheckbox" className="mb-3">
            <Form.Check
              type="checkbox"
              label="Mark as checked"
              checked={isChecked}
              onChange={(event) => {
                setIsChecked(event.target.checked);
              }}
            />
          </Form.Group>
          {assetSettings.some((asset) => asset.renderType !== 'hidden') && (
            <h5>Assets</h5>
          )}
          <div className="d-flex justify-content-between mb-3">
            <Button
              variant={rawMode ? 'secondary' : 'outline-secondary'}
              onClick={() => {
                setRawMode(!rawMode);
              }}
            >
              {rawMode ? 'Close JSON' : 'Edit JSON'}
            </Button>
            <Button
              variant="primary"
              disabled={!name || isGeneratingAll}
              onClick={handleGenerateAll}
            >
              {isGeneratingAll ? 'Generating...' : 'Generate All Assets'}
            </Button>
          </div>
          {rawMode ? (
            <JsonEditor
              restrictDelete
              restrictAdd
              restrictTypeSelection
              rootName="assets"
              data={assetsToShow}
              setData={(data) => {
                for (const asset of data as AnimationAsset[]) {
                  handleAassetUpdate(asset);
                }
              }}
              maxWidth="100%"
            />
          ) : (
            <>
              {assetsToShow.map((asset, index) => (
                <Card key={asset.assetId} className="mb-3">
                  <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                      <AssetFilename
                        asset={asset}
                        className="flex-grow-1 me-2"
                        onAssetUpdate={handleAassetUpdate}
                      />
                      <div>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="me-2"
                          disabled={index === 0}
                          title="Move Up"
                          onClick={() => {
                            handleMoveAssetUp(asset.assetId);
                          }}
                        >
                          <ArrowUp />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          title="Move Down"
                          disabled={index === assetsToShow.length - 1}
                          onClick={() => {
                            handleMoveAssetDown(asset.assetId);
                          }}
                        >
                          <ArrowDown />
                        </Button>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <AnimationAssetForm
                      key={asset.assetId}
                      src={{
                        en: animations.en?.assets.find(
                          (a) => a.id === asset.assetId,
                        )?.p,
                        fi: animations.fi?.assets.find(
                          (a) => a.id === asset.assetId,
                        )?.p,
                        sv: animations.sv?.assets.find(
                          (a) => a.id === asset.assetId,
                        )?.p,
                      }}
                      asset={asset}
                      setAsset={setDataToJson}
                      onChange={handleAassetUpdate}
                    />
                  </Card.Body>
                </Card>
              ))}
            </>
          )}

          <h5>Loop</h5>
          <Form.Group controlId="loopCheckbox" className="mb-3">
            <Form.Check
              type="checkbox"
              label="Loop whole animation"
              checked={loop}
              onChange={handleLoopChange}
            />
          </Form.Group>

          <h5>Segments</h5>
          <AnimationSegmentsForm
            segments={segments}
            setSegments={setSegments}
            maxFrame={
              baseAnimation && typeof baseAnimation.op === 'number'
                ? baseAnimation.op - 1
                : 0
            }
            applyChanges={applySegments}
          />
        </>
      ) : null}
      <h5 className="mt-4">Preview</h5>
      {baseAnimation && Object.keys(animations).length > 0 ? (
        <>
          <Form.Group controlId="languageSelect" className="mb-3">
            <Form.Label>Select Language</Form.Label>
            <Form.Select
              value={selectedLang}
              onChange={(event) => {
                setSelectedLang(event.target.value as LanguageCode);
              }}
            >
              {Object.keys(animations).map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {!isGeneratingAll && animations[selectedLang] ? (
            <LottiePlayer data={animations[selectedLang]} />
          ) : null}
        </>
      ) : null}
      <h5 className="mt-4">Convert to video</h5>
      {animationId ? (
        <div>
          {(['en', 'fi', 'sv'] as LanguageCode[]).map((lang) => (
            <Button
              key={lang}
              variant="primary"
              className="me-2 mb-2"
              onClick={async () => handleCreateVideoProcessingJob(lang)}
            >
              Create {lang.toUpperCase()}
            </Button>
          ))}
        </div>
      ) : (
        <p>Please save the animation before creating video processing jobs.</p>
      )}
    </>
  );
}
