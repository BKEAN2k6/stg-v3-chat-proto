type PageView = {
  action: 'page-view';
  app: string;
  page: string;
  path: string;
  community: string;
  language: string;
};

type Click = {
  action: 'click';
  app: string;
  page: string;
  path: string;
  community: string;
  element: string;
};

type Trackables = PageView | Click;
