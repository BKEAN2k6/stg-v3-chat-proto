import {NavDropdown} from 'react-bootstrap';
import {msg} from '@lingui/core/macro';
import {useLingui} from '@lingui/react';
import {Trans} from '@lingui/react/macro';
import {ChevronDown} from 'react-bootstrap-icons';
import {useActiveGroup} from '@/context/activeGroupContext.js';
import {useCurrentUser} from '@/context/currentUserContext.js';

export default function GroupDropdown() {
  const {_: i18n} = useLingui();
  const {groups, activeGroup, setActiveGroupById} = useActiveGroup();
  const {currentUser} = useCurrentUser();
  if (!groups || !currentUser) return null;

  const sorted = [...groups].sort((a, b) => a.name.localeCompare(b.name));
  const yourGroups = sorted.filter((g) => g.owner.id === currentUser.id);
  const otherGroups = sorted.filter((g) => g.owner.id !== currentUser.id);

  const title = activeGroup
    ? activeGroup.name
    : sorted.length > 0
      ? i18n(msg`Select a group`)
      : '';

  let contents;
  if (yourGroups.length > 0 && otherGroups.length > 0) {
    contents = (
      <>
        <NavDropdown.Header className="text-uppercase fw-bold">
          <Trans>Your groups</Trans>
        </NavDropdown.Header>
        {yourGroups.map((g) => (
          <NavDropdown.Item
            key={g.id}
            active={g.id === activeGroup?.id}
            onClick={() => {
              setActiveGroupById(g.id);
            }}
          >
            {g.name}
          </NavDropdown.Item>
        ))}

        <NavDropdown.Divider />

        <NavDropdown.Header className="text-uppercase fw-bold">
          <Trans>All groups</Trans>
        </NavDropdown.Header>
        {otherGroups.map((g) => (
          <NavDropdown.Item
            key={g.id}
            active={g.id === activeGroup?.id}
            onClick={() => {
              setActiveGroupById(g.id);
            }}
          >
            {g.name}
          </NavDropdown.Item>
        ))}
      </>
    );
  } else {
    contents = sorted.map((g) => (
      <NavDropdown.Item
        key={g.id}
        active={g.id === activeGroup?.id}
        onClick={() => {
          setActiveGroupById(g.id);
        }}
      >
        {g.name}
      </NavDropdown.Item>
    ));
  }

  return (
    <NavDropdown
      title={
        <div>
          {title ? (
            <>
              {title} <ChevronDown />
            </>
          ) : null}
        </div>
      }
      className="d-flex align-items-center hide-icon"
    >
      <div style={{maxHeight: '60vh', overflowY: 'auto'}}>{contents}</div>
    </NavDropdown>
  );
}
