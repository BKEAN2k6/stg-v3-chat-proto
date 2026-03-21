import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {Button, Form, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {SendFill} from 'react-bootstrap-icons';
import clsx from 'clsx';
import {useState} from 'react';
import {useLingui} from '@lingui/react';
import api from '@client/ApiClient';
import {
  type UpdateCommentResponse,
  type CreatePostCommentResponse,
} from '@client/ApiTypes';
import TextInput from '../TextInput.js';
import {useToasts} from '@/components/toasts/index.js';
import MediaUpload, {useMediaUpload} from '@/components/MediaUpload.js';

type Properties = {
  readonly postId: string;
  readonly className?: string;
  readonly existingCommentId?: string;
  readonly existingCommentText?: string;
  readonly onCreate?: (comment: CreatePostCommentResponse) => void;
  readonly onUpdate?: (comment: UpdateCommentResponse) => void;
  readonly onCancelEdit?: () => void;
};

export default function CommentForm(properties: Properties) {
  const {_} = useLingui();
  const {
    postId,
    className,
    existingCommentId,
    existingCommentText,
    onCancelEdit,
    onCreate,
    onUpdate,
  } = properties;
  const toasts = useToasts();

  const [commentText, setCommentText] = useState(existingCommentText ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {images} = useMediaUpload();

  const isAbleToPost = commentText.length > 0 || images.length > 0;

  const handleCommentTextChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCommentText(event.target.value);
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (existingCommentId) {
        const response = await api.updateComment(
          {id: existingCommentId},
          {
            content: commentText,
            images: images.map((image) => image.id!),
          },
        );
        onUpdate?.(response);
      } else {
        const response = await api.createPostComment(
          {id: postId},
          {
            content: commentText,
            images: images.map((image) => image.id!),
          },
        );
        onCreate?.(response);
      }

      setCommentText('');
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while saving the comment`),
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className={clsx('d-flex flex-column border rounded', className)}>
        <TextInput
          isAutoFocused
          controlId="commentText"
          type="textarea"
          inputStyle={{
            height: '4.5rem',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
          }}
          value={commentText}
          maxLength={5000}
          onChange={handleCommentTextChange}
        />
        <MediaUpload.Preview className="p-2" />
        <div className="d-flex justify-content-between p-2">
          <MediaUpload.Trigger />
          <div className="d-flex gap-2">
            <div className="d-flex flex-column flex-md-row">
              {existingCommentId ? (
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
                    className="px-3 float-end"
                    type="submit"
                    disabled={!isAbleToPost || isSubmitting}
                  >
                    <div className="d-flex gap-2">
                      <span>
                        {existingCommentId ? _(msg`Save`) : _(msg`Send`)}
                      </span>
                      <span
                        className={clsx(
                          'd-none',
                          !existingCommentId && 'd-sm-inline',
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
      </div>
    </Form>
  );
}
