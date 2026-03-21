import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {Button, Form, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {PlusCircle, SendFill, X} from 'react-bootstrap-icons';
import clsx from 'clsx';
import {useState} from 'react';
import {useLingui} from '@lingui/react';
import {type StrengthSlug, type Moment} from '@client/ApiTypes';
import api from '@client/ApiClient';
import TextInput from './ui/TextInput.js';
import StrengthModal from './ui/StrengthModal.js';
import {useToasts} from './toasts/index.js';
import MediaUpload, {useMediaUpload} from './MediaUpload.js';
import {slugToListItem, strengthColorMap} from '@/helpers/strengths.js';

const maxImages = 5;
const maxStrengths = 5;

export type Properties = {
  readonly className?: string;
  readonly existingMomentText?: string;
  readonly existingStrengths?: StrengthSlug[];
  readonly onSave: (moment: Moment) => void;
  readonly onCancelEdit?: () => void;
} & (
  | {readonly communityId: string; readonly existingMomentId?: never}
  | {readonly existingMomentId: string; readonly communityId?: never}
);
export default function MomentForm(properties: Properties) {
  const {_, i18n} = useLingui();
  const {
    className,
    communityId,
    existingMomentId,
    existingMomentText,
    existingStrengths,
    onCancelEdit,
    onSave,
  } = properties;
  const toasts = useToasts();
  const {isUploading, images, setImages} = useMediaUpload();

  const [selectedStrengths, setSelectedStrengths] = useState<StrengthSlug[]>(
    existingStrengths ?? [],
  );
  const [isStrengthModalOpen, setIsStrengthModalOpen] = useState(false);
  const [momentText, setMomentText] = useState(existingMomentText ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAbleToPost = momentText.length > 0 || images.length > 0;

  const handleStrengthModalOpen = () => {
    setIsStrengthModalOpen(true);
  };

  const handleStrengthModalClose = () => {
    setIsStrengthModalOpen(false);
  };

  const handleStrengthSelected = (selectedStrength: StrengthSlug) => {
    setSelectedStrengths((items) => [...items, selectedStrength]);
    setIsStrengthModalOpen(false);
  };

  const handleStrengthDeselected = (selectedSlug: StrengthSlug) => {
    setSelectedStrengths((items) =>
      items.filter((item) => item !== selectedSlug),
    );
  };

  const handleMomentTextChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setMomentText(event.target.value);
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const body = {
        content: momentText,
        strengths: selectedStrengths,
        images: images.map((image) => image.id!),
      };

      const moment = existingMomentId
        ? await api.updateMoment({id: existingMomentId}, body)
        : await api.createCommunityMoment({id: communityId!}, body);
      onSave(moment);

      setSelectedStrengths([]);
      setMomentText('');
      setImages([]);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while saving the moment`),
      });
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <div
          className={clsx(
            'd-flex flex-column gap-3 border rounded p-2 p-md-3',
            className,
          )}
        >
          <TextInput
            controlId="momentText"
            type="textarea"
            placeholder={_(msg`Post a message to your community's wall.`)}
            inputStyle={{height: '4.5rem'}}
            value={momentText}
            maxLength={5000}
            onChange={handleMomentTextChange}
          />
          <MediaUpload.Preview />
          {selectedStrengths.length > 0 && (
            <div className="d-flex flex-wrap gap-2 align-items-start">
              {selectedStrengths.map((strength) => (
                <div
                  key={strength}
                  className="d-flex gap-2 justify-content-center align-items-center p-2 border border-primary rounded-5"
                >
                  <img
                    src={`/images/strengths/${strength}.png`}
                    alt="placeholder"
                    className="rounded-circle"
                    style={{
                      width: '32px',
                      height: '32px',
                      objectFit: 'cover',
                      backgroundColor: strengthColorMap[strength][300],
                    }}
                  />
                  <small>{slugToListItem(strength, i18n.locale).title}</small>
                  <Button variant="link" className="m-0 p-0">
                    <X
                      style={{
                        marginTop: -3,
                        marginLeft: -1,
                        width: '1.5rem',
                        height: '1.5rem',
                      }}
                      onClick={() => {
                        handleStrengthDeselected(strength);
                      }}
                    />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div>
            <div className="d-flex gap-2 w-100">
              {images.length < maxImages && (
                <MediaUpload.Trigger className="w-50 d-flex justify-content-center" />
              )}
              {selectedStrengths.length < maxStrengths && (
                <Button
                  variant="outline-secondary w-50 d-flex justify-content-center"
                  onClick={() => {
                    handleStrengthModalOpen();
                  }}
                >
                  <div className="d-flex gap-2 align-items-center">
                    <PlusCircle />
                    <div style={{marginBottom: -2}}>
                      <Trans>
                        <span className="d-none d-sm-inline">Add</span>{' '}
                        <span className="text-sm-lowercase">Strength</span>
                      </Trans>
                    </div>
                  </div>
                </Button>
              )}
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <div className="d-flex flex-column flex-md-row">
              {existingMomentId ? (
                <Button
                  variant="link"
                  className="pb-0 text-end order-2 order-md-1"
                  onClick={onCancelEdit}
                >
                  <Trans>Cancel edit</Trans>
                </Button>
              ) : null}
              <OverlayTrigger
                overlay={
                  <Tooltip className={clsx('z-1', isAbleToPost && 'd-none')}>
                    <Trans>Add text or image to post</Trans>
                  </Tooltip>
                }
              >
                <div className="order-1 order-md-2">
                  <Button
                    className="px-5"
                    type="submit"
                    disabled={!isAbleToPost || isUploading || isSubmitting}
                  >
                    <div className="d-flex gap-2">
                      <span>
                        {existingMomentId ? _(msg`Save`) : _(msg`Post`)}
                      </span>
                      <span
                        className={clsx(
                          'd-none',
                          !existingMomentId && 'd-sm-inline',
                        )}
                      >
                        <SendFill />
                      </span>
                    </div>
                  </Button>
                </div>
              </OverlayTrigger>
            </div>
          </div>
        </div>
      </Form>
      <StrengthModal
        isOpen={isStrengthModalOpen}
        selectedStrengthSlugs={selectedStrengths}
        onClose={handleStrengthModalClose}
        onStrengthSelected={handleStrengthSelected}
      />
    </>
  );
}
