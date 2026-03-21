declare let umami: umami.umami;

// eslint-disable-next-line @typescript-eslint/no-redeclare
declare namespace umami {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  type umami = {
    track(
      event_name_or_payload_or_callback?:
        | string
        | {[key: string]: any; website: string}
        | ((properties: {
            hostname: string;
            language: string;
            referrer: string;
            screen: string;
            title: string;
            url: string;
            website: string;
          }) => {[key: string]: any; website: string}),
      event_data?: Record<string, any>,
    ): Promise<string> | undefined;
    identify(custom_payload: Record<string, any>);
  };
}
