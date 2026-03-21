import {useEffect, useState} from 'react';
import {Form, Button, Image, Modal} from 'react-bootstrap';
import {
  type AnimationImageAsset,
  type AnimationAudioAsset,
} from '@client/ApiTypes.js';

type AnimationAsset = AnimationImageAsset | AnimationAudioAsset;

type AssetTypeModalProperties = {
  // eslint-disable-next-line react/boolean-prop-naming
  readonly show: boolean;
  readonly assetSettings: AnimationAsset;
  readonly assetData: string;
  readonly assetNumber: number;
  readonly assetCount: number;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly handleAassetUpdate: (asset: AnimationAsset) => void;
};

enum AnimationAssetType {
  image = 'image',
  audio = 'audio',
  unsupported = 'unsupported',
}

type ImageType =
  | 'hidden'
  | 'text-banner'
  | 'intro-card'
  | 'task-card'
  | 'challenge-card'
  | 'fileupload'
  | 'color-picker'
  | 'button';

type AudioType = 'hidden' | 'voiceover' | 'fileupload';

const ImageOptions: Array<{value: ImageType; label: string}> = [
  {value: 'text-banner', label: 'Text Banner'},
  {value: 'intro-card', label: 'Intro Card'},
  {value: 'task-card', label: 'Task Card'},
  {value: 'challenge-card', label: 'Challenge Card'},
  {value: 'color-picker', label: 'Color Picker'},
  {value: 'button', label: 'Button'},
  {value: 'fileupload', label: 'File Upload'},
  {value: 'hidden', label: 'Hidden'},
];

const AudioOptions: Array<{value: AudioType; label: string}> = [
  {value: 'voiceover', label: 'Voice-Over'},
  {value: 'fileupload', label: 'File Upload'},
  {value: 'hidden', label: 'Hidden'},
];

export default function AssetClassificationModal({
  show,
  assetSettings,
  assetData,
  assetNumber,
  assetCount,
  onPrevious,
  onNext,
  handleAassetUpdate,
}: AssetTypeModalProperties) {
  const mimeMatch = /^data:([^;]+);/.exec(assetData);
  const mimeType = mimeMatch?.[1] ?? 'unknown';
  let type: AnimationAssetType;

  if (mimeType.startsWith('image/')) {
    type = AnimationAssetType.image;
  } else if (mimeType.startsWith('audio/')) {
    type = AnimationAssetType.audio;
  } else {
    type = AnimationAssetType.unsupported;
  }

  const [localRenderType, setLocalRenderType] = useState<string>(
    assetSettings?.renderType ?? 'hidden',
  );
  useEffect(() => {
    if (assetSettings?.renderType) {
      setLocalRenderType(assetSettings.renderType);
    } else {
      setLocalRenderType('hidden');
    }
  }, [assetSettings]);

  function handleNextClicked() {
    if (type === AnimationAssetType.image) {
      const updated = {
        ...assetSettings,
        renderType: localRenderType as ImageType,
      };
      handleAassetUpdate(updated);
    } else if (type === AnimationAssetType.audio) {
      const updatedAudio = {
        ...assetSettings,
        renderType: localRenderType as AudioType,
      };
      handleAassetUpdate(updatedAudio);
    }

    onNext();
  }

  return (
    <Modal show={show} backdrop="static" keyboard={false} size="lg">
      <Modal.Header>
        <Modal.Title>
          {assetNumber} of {assetCount} : {assetSettings.assetId},{' '}
          {assetSettings.name}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Select Asset Type</Form.Label>

          {type === AnimationAssetType.image && (
            <>
              <Form.Select
                value={localRenderType}
                onChange={(event) => {
                  setLocalRenderType(event.target.value);
                }}
              >
                {ImageOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>

              <Image
                fluid
                thumbnail
                className="mx-auto d-block mt-3 mb-3"
                src={assetData}
                alt={`Preview for ${assetSettings.assetId}`}
                style={{maxHeight: '300px', objectFit: 'contain'}}
              />
            </>
          )}

          {type === AnimationAssetType.audio && (
            <>
              <Form.Select
                value={localRenderType}
                onChange={(event) => {
                  setLocalRenderType(event.target.value);
                }}
              >
                {AudioOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>

              <audio controls className="w-100 mt-3 mb-3" src={assetData} />
            </>
          )}

          {type === AnimationAssetType.unsupported && (
            <div className="alert alert-warning mt-3 mb-0">
              Unsupported asset type:{' '}
              <strong>{mimeType === 'unknown' ? 'unknown' : mimeType}</strong>
            </div>
          )}
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          disabled={assetNumber === 1}
          onClick={onPrevious}
        >
          Previous
        </Button>

        <Button
          variant="primary"
          onClick={() => {
            handleNextClicked();
          }}
        >
          {assetNumber < assetCount ? 'Next Asset' : 'Finish Classification'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
