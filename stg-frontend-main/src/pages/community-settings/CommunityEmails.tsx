import {useEffect, useState} from 'react';
import {useLingui} from '@lingui/react';
import {msg} from '@lingui/macro';
import {useToasts} from '@/components/toasts';
import api from '@/api/ApiClient';
import {type GetCommunityMembersResponse} from '@/api/ApiTypes';

type Props = {
  readonly communityId: string;
};

export default function CommunityEmails(props: Props) {
  const {communityId} = props;
  const [communityMembers, setCommunityMembers] =
    useState<GetCommunityMembersResponse>([]);
  const toasts = useToasts();
  const {_} = useLingui();

  useEffect(() => {
    const getCommunityMembers = async () => {
      try {
        const members = await api.getCommunityMembers({id: communityId});
        setCommunityMembers(members);
      } catch {
        toasts.danger({
          header: _(msg`Oops!`),
          body: _(
            msg`Something went wrong while loading the community members`,
          ),
        });
      }
    };

    void getCommunityMembers();
  }, [communityId, toasts, _]);

  const groupedUsers: Record<'en' | 'fi' | 'sv', string[]> = {
    en: [],
    fi: [],
    sv: [],
  };

  // Populate the groupedUsers object
  for (const user of communityMembers) {
    groupedUsers[user.language].push(user.email);
  }

  const renderEmails = (language: string, emailList: string[]) => {
    if (emailList.length === 0) {
      return null;
    }

    return (
      <div>
        <h2>{language}</h2>
        {emailList.map((email) => (
          <div key={email}>{email}</div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {renderEmails('English', groupedUsers.en)}
      {renderEmails('Finnish', groupedUsers.fi)}
      {renderEmails('Swedish', groupedUsers.sv)}
    </div>
  );
}
