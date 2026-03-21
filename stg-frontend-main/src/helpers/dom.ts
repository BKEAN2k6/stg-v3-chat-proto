export function getFullHeight(element?: HTMLElement): number {
  if (!element) return 0;
  const style = window.getComputedStyle(element);
  const marginTop = Number.parseInt(style.marginTop, 10);
  const marginBottom = Number.parseInt(style.marginBottom, 10);
  const totalHeight = element.offsetHeight + marginTop + marginBottom;
  return totalHeight;
}
