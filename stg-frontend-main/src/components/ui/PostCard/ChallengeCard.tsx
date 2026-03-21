import {useLingui} from '@lingui/react';
import PostInteractions from './PostInteractions';
import ChallengeContent from './ChallengeContent';
import ChallengeHeader from './ChallengeHeader';
import {
  type UserInfo,
  type Comment,
  type Reaction,
  type ChallengeTheme,
} from '@/api/ApiTypes';
import {type LanguageCode} from '@/i18n';
import {languages} from '@/i18n';

type Props = {
  readonly challengeId: string;
  readonly createdAt: string;
  readonly participants: UserInfo[];
  readonly translations: Record<LanguageCode, string>;
  readonly theme: ChallengeTheme;
  readonly comments: Comment[];
  readonly reactions: Reaction[];
  readonly onDelete: (challengeId: string) => void;
  readonly onClose?: () => void;
};

export default function ChallengeCard(props: Props) {
  const {i18n} = useLingui();
  const {
    challengeId,
    createdAt,
    participants,
    translations,
    theme,
    comments,
    reactions,
    onDelete,
    onClose,
  } = props;
  let locale = i18n.locale as LanguageCode;
  if (!Object.keys(languages).includes(locale)) {
    locale = 'en';
  }

  return (
    <div className="p-2 p-md-3 d-flex flex-column gap-3 border rounded">
      <ChallengeHeader
        theme={theme}
        challengeId={challengeId}
        createdAt={createdAt}
        onDelete={onDelete}
        onClose={onClose}
      />
      <ChallengeContent
        theme={theme}
        createdAt={createdAt}
        challengeId={challengeId}
        participants={participants}
        content={translations[locale]}
      />
      <PostInteractions
        postId={challengeId}
        postComments={comments}
        postReactions={reactions}
      />
    </div>
  );
}
