// Whitelist of pages where we want to be hiding the sidebar and bottom navi...
// This is because the navigation is at the lowest layout level, and we want
// some pages to appear as "modals", where the navigation isn't visible.

const pathsWithNavigationHidden = ['/dashboard/modal'];

export function shouldHideNavigation(pathname: string) {
  return pathsWithNavigationHidden.some((path) => pathname.startsWith(path));
}
