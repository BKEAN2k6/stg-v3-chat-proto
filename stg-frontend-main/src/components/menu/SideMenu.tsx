import CommunityDropdown from './CommunityDropdown';
import {SideMenuLinks} from './SideMenuLinks';
import useBreakpoint from '@/hooks/useBreakpoint';

type Props = {
  readonly isInOffcanvas?: boolean;
  readonly onNavigate?: () => void;
};

export default function SideMenu(props: Props) {
  const {isInOffcanvas, onNavigate} = props;
  const breakpoint = useBreakpoint();

  return (
    <div
      className="border-end d-flex flex-column position-sticky z-2"
      style={{
        top: ['xs', 'sm'].includes(breakpoint) || isInOffcanvas ? 0 : 50,
        height: `calc(100vh - env(safe-area-inset-bottom, 0) - env(safe-area-inset-top, 0) - 50px)`,
      }}
    >
      <div className="px-3 py-2 d-block d-md-none">
        <CommunityDropdown isCompact={!isInOffcanvas} />
      </div>
      <div className="flex-grow-1 overflow-y-auto mt-2 mt-xxl-3">
        <SideMenuLinks
          isCompact={!isInOffcanvas && breakpoint !== 'xxl'}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}
