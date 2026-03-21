import {useState} from 'react';
import PostInteractions from './PostInteractions';
import MomentHeader from './MomentHeader';
import MomentContent from './MomentContent';
import StrengthList from '@/components/ui/StrengthList';
import MomentForm from '@/components/MomentForm';
import constants from '@/constants';
import {
  type StrengthSlug,
  type UserImage,
  type Moment,
  type UserInfo,
  type Comment,
  type Reaction,
} from '@/api/ApiTypes';
import MediaUpload from '@/components/MediaUpload';

type Props = {
  readonly momentId: string;
  readonly content: string;
  readonly images: UserImage[];
  readonly createdBy: UserInfo;
  readonly strengths: StrengthSlug[];
  readonly createdAt: string;
  readonly comments: Comment[];
  readonly reactions: Reaction[];
  readonly isReference: boolean;
  readonly onUpdate: (moment: Moment) => void;
  readonly onDelete: (momentId: string) => void;
  readonly onClose?: () => void;
};

export default function MomentCard(props: Props) {
  const {
    momentId,
    content,
    images,
    strengths,
    createdBy,
    createdAt,
    comments,
    reactions,
    isReference,
    onUpdate,
    onDelete,
    onClose,
  } = props;
  const [isEditing, setIsEditing] = useState(false);

  const toggleMomentEditor = () => {
    setIsEditing(!isEditing);
  };

  if (isEditing) {
    return (
      <MediaUpload
        existingImages={images.map((image) => ({
          id: image._id,
          previewUrl: `${constants.FILE_HOST}${image.resizedImageUrl}`,
        }))}
      >
        <MomentForm
          className="w-100"
          existingMomentId={momentId}
          existingMomentText={content}
          existingStrengths={strengths}
          onSave={(moment) => {
            onUpdate(moment);
            toggleMomentEditor();
          }}
          onCancelEdit={() => {
            toggleMomentEditor();
          }}
        />
      </MediaUpload>
    );
  }

  return (
    <div className="p-2 p-md-3 d-flex flex-column gap-3 border rounded">
      <MomentHeader
        momentId={momentId}
        createdBy={createdBy}
        createdAt={createdAt}
        toggleEditing={isReference ? undefined : toggleMomentEditor}
        onDelete={onDelete}
        onClose={onClose}
      />
      <MomentContent content={content} images={images} />
      <StrengthList strengths={strengths} />
      <PostInteractions
        postId={momentId}
        postComments={comments}
        postReactions={reactions}
      />
    </div>
  );
}
