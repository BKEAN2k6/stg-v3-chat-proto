import {useLingui} from '@lingui/react';
import {
  type UserInfo,
  type Comment,
  type Reaction,
  type ChallengeTheme,
  type LanguageCode,
} from '@client/ApiTypes';
import PostInteractions from './PostInteractions.js';
import ChallengeContent from './ChallengeContent.js';
import ChallengeHeader from './ChallengeHeader.js';
import {languages} from '@/i18n.js';

type Properties = {
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

export default function ChallengeCard(properties: Properties) {
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
  } = properties;
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
