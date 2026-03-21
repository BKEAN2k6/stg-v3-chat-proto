import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useLingui} from '@lingui/react';
import {
  type GetPlayerSprintResponse,
  type StrengthSlug,
} from '@client/ApiTypes';
import StrengthsBar from './StrengthsBar.js';
import ListItem from '@/components/ui/ListItem.js';
import {strengthColorMap, strengthName} from '@/helpers/strengths.js';
import {formatNameList} from '@/helpers/utils.js';
import {SimpleLottiePlayer} from '@/components/ui/SimpleLottiePlayer.js';

type Properties = {
  readonly sprint: GetPlayerSprintResponse;
};

export type StrengthEntry = {
  strength: StrengthSlug;
  count: number;
  nicknames: string[];
};

export default function PlayerResults(properties: Properties) {
  const {_, i18n} = useLingui();
  const {sprint} = properties;
  const {receivedStrengths} = sprint;

  const groupedStrengths: Record<string, Omit<StrengthEntry, 'strength'>> = {};

  for (const {strength, from} of receivedStrengths) {
    if (groupedStrengths[strength]) {
      groupedStrengths[strength].count += 1;
      groupedStrengths[strength].nicknames.push(from.nickname);
    } else {
      groupedStrengths[strength] = {
        count: 1,
        nicknames: [from.nickname],
      };
    }
  }

  const strengthsArray = Object.entries(groupedStrengths).map(
    ([strength, {count, nicknames}]) => ({
      strength: strength as StrengthSlug,
      count,
      nicknames,
    }),
  );

  return (
    <div className="p-3 mx-auto" style={{maxWidth: 600}}>
      <div
        className="rounded-circle mx-auto"
        style={{
          width: '4rem',
          height: '4rem',
          backgroundColor: sprint.player.color,
          margin: '0.5rem',
          border: 'none',
        }}
      >
        <SimpleLottiePlayer
          autoplay
          loop
          src={`/animations/avatars/${sprint.player.avatar}.json`}
        />
      </div>
      <h4 className="text-center mt-4">{sprint.player.nickname}</h4>
      {strengthsArray.length > 0 && (
        <>
          <p className="text-muted text-center fs-5 mt-5">
            <Trans>Received strengths</Trans>
          </p>
          <StrengthsBar strengths={strengthsArray} />
          <div className="mt-4">
            {strengthsArray.map(({strength, count, nicknames}) => (
              <ListItem
                key={strength}
                className="border-0"
                imageUrl={`/images/strengths/${strength}.png`}
                imageAlt={strength}
                imageBackgroundColor={strengthColorMap[strength][300]}
                title={`${strengthName(strength, i18n.locale)} • ${count}`}
                description={formatNameList(nicknames, _(msg`and`))}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
