import {useLingui} from '@lingui/react';
import {Trans, msg} from '@lingui/macro';
import StrengthsBar from './StrengthsBar';
import {type GetPlayerSprintResponse, type StrengthSlug} from '@/api/ApiTypes';
import ListItem from '@/components/ui/ListItem';
import {strengthColorMap, strengthName} from '@/helpers/strengths';
import {formatNameList} from '@/helpers/utils';

type Props = {
  readonly sprint: GetPlayerSprintResponse;
};

export type StrengthEntry = {
  strength: StrengthSlug;
  count: number;
  nicknames: string[];
};

export default function PlayerResults(props: Props) {
  const {_, i18n} = useLingui();
  const {sprint} = props;
  const receivedStrengths = sprint.receivedStrengths;

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
      />
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
