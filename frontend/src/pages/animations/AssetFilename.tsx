import {useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import {Pencil, Check, ArrowCounterclockwise} from 'react-bootstrap-icons';
import {
  type AnimationAudioAsset,
  type AnimationImageAsset,
} from '@client/ApiTypes.js';

type AnimationAssetSetting = AnimationAudioAsset | AnimationImageAsset;

type Properties = {
  readonly asset: AnimationAssetSetting;
  readonly onAssetUpdate: (updated: AnimationAssetSetting) => void;
  readonly className?: string;
};

export default function AssetFilename({
  asset,
  onAssetUpdate,
  className = '',
}: Properties) {
  const {name} = asset;
  const [isEditing, setIsEditing] = useState(false);
  const [temporaryName, setTemporaryName] = useState(name);

  const startEdit = () => {
    setTemporaryName(name);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const saveEdit = () => {
    onAssetUpdate({
      ...asset,
      name: temporaryName.trim() || name,
    });
    setIsEditing(false);
  };

  return (
    <div className={`d-flex align-items-center ${className}`}>
      {isEditing ? (
        <>
          <Form.Control
            type="text"
            size="sm"
            value={temporaryName}
            className="me-2"
            onChange={(event) => {
              setTemporaryName(event.target.value);
            }}
          />
          <Button
            variant="outline-success"
            size="sm"
            className="me-1"
            onClick={saveEdit}
          >
            <Check />
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={cancelEdit}>
            <ArrowCounterclockwise />
          </Button>
        </>
      ) : (
        <>
          <span className="me-2">{name}</span>
          <Button
            variant="link"
            size="sm"
            title="Rename"
            className="p-0"
            onClick={startEdit}
          >
            <Pencil />
          </Button>
        </>
      )}
    </div>
  );
}
