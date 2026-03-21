declare module 'sidemail' {
  type SidemailConfig = {
    apiKey: string;
  };

  type EmailTemplateProperties = Record<string, string>;

  type SendEmailOptions = {
    fromName: string;
    fromAddress: string;
    toAddress: string;
    templateName: string;
    templateProps: EmailTemplateProperties;
  };

  type Sidemail = {
    sendEmail(options: SendEmailOptions): Promise<void>;
  };

  function configureSidemail(config: SidemailConfig): Sidemail;

  export = configureSidemail;
}
