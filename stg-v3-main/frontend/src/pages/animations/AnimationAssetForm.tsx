import {
  type AnimationImageAsset,
  type AnimationAudioAsset,
  type LanguageCode,
} from '@client/ApiTypes.js';
import ImageAssetForm from './ImageAssetForm.js';
import AudioAssetForm from './AudioAssetForm.js';

type AnimationAsset = AnimationImageAsset | AnimationAudioAsset;

type Properties = {
  readonly asset: AnimationAsset;
  readonly src: Record<LanguageCode, string | undefined>;
  readonly onChange: (asset: AnimationAsset) => void;
  readonly setAsset: (
    lang: LanguageCode,
    assetId: string,
    data: string,
  ) => Promise<void>;
};

export default function AnimationAssetForm({
  asset,
  src,
  onChange,
  setAsset,
}: Properties) {
  if (asset.renderType === 'hidden') {
    return null;
  }

  switch (asset.assetType) {
    case 'image': {
      return (
        <ImageAssetForm
          asset={asset}
          src={src}
          setAsset={setAsset}
          onChange={onChange}
        />
      );
    }

    case 'audio': {
      return (
        <AudioAssetForm
          asset={asset}
          src={src}
          setAsset={setAsset}
          onChange={onChange}
        />
      );
    }
  }
}
