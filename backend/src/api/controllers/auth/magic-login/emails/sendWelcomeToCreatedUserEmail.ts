import process from 'node:process';
import configureSidemail from 'sidemail';

const apiKey = process.env.SIDEMAIL_API_KEY;

export default async function sendWelcomeToCreatedUserEmail(
  firstName: string,
  toAddress: string,
  communityName: string,
  href: string,
) {
  const sidemail = configureSidemail({apiKey});

  if (process.env.NODE_ENV === 'development') {
    console.log(href); // eslint-disable-line no-console
    return;
  }

  await sidemail.sendEmail({
    fromName: 'See The Good',
    fromAddress: 'support@positive.fi',
    toAddress,
    templateName: 'Welcome Created User (en-US)',
    templateProps: {
      firstName,
      communityName,
      url: `${process.env.FRONTEND_URL}${href}`,
    },
  });
}
