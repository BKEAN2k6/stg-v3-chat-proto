declare module 'sidemail' {
  type SidemailConfig = {
    apiKey: string;
  };

  type EmailTemplateProperties = Record<string, string>;
  type CustomProperties = Record<string, string>;

  type SendEmailOptions = {
    fromName: string;
    fromAddress: string;
    toAddress: string;
    templateName: string;
    templateProps: EmailTemplateProperties;
  };

  type CreateOrUpdateProperties = {
    emailAddress?: string;
    identifier?: string;
    customProps: CustomProperties;
  };

  type Sidemail = {
    contacts: {
      createOrUpdate(properties: CreateOrUpdateProperties): Promise<void>;
    };
    sendEmail(options: SendEmailOptions): Promise<void>;
  };

  function configureSidemail(config: SidemailConfig): Sidemail;

  export = configureSidemail;
}
