import CommunityDropdown from './CommunityDropdown.js';
import GroupDropdown from './GroupDropdown.js';
import {SideMenuLinks} from './SideMenuLinks.js';
import useBreakpoint from '@/hooks/useBreakpoint.js';

type Properties = {
  readonly isInOffcanvas?: boolean;
  readonly onNavigate?: () => void;
};

export default function SideMenu(properties: Properties) {
  const {isInOffcanvas, onNavigate} = properties;
  const breakpoint = useBreakpoint();

  return (
    <div
      className="border-end d-flex flex-column position-sticky z-2"
      style={{
        top: ['xs', 'sm'].includes(breakpoint) || isInOffcanvas ? 0 : 50,
        height: `calc(100vh - env(safe-area-inset-bottom, 0) - env(safe-area-inset-top, 0) - 50px)`,
      }}
    >
      <div className="d-flex aling-items-center p-2 gap-2 d-block d-md-none border-bottom">
        <CommunityDropdown />
        <GroupDropdown />
      </div>
      <div className="flex-grow-1 overflow-y-auto">
        <SideMenuLinks
          isCompact={!isInOffcanvas && breakpoint !== 'xxl'}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}
