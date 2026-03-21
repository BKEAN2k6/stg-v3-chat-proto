export type SlideLayout =
  | 'default'
  | 'centered'
  | 'full'
  | 'notes'
  | 'half'
  | 'padRight'
  | 'story'
  | 'media';

export type SlideAttributes = {
  layout?: SlideLayout;
  color: string;
  background: string;
  backgroundColor: string;
  paddingTop?: string | number;
  paddingBottom?: string | number;
  paddingLeft?: string | number;
  paddingRight?: string | number;
  scrollable: boolean;
};
