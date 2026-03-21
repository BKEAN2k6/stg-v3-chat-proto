import process from 'node:process';
import configureSidemail from 'sidemail';

const apiKey = process.env.SIDEMAIL_API_KEY;

export default async function sendWelcomeToNewUserEmail(
  firstName: string,
  toAddress: string,
  href: string,
) {
  const sidemail = configureSidemail({apiKey});

  await sidemail.sendEmail({
    fromName: 'See The Good',
    fromAddress: 'support@positive.fi',
    toAddress,
    templateName: 'Welcome New User (en-US)',
    templateProps: {
      firstName,
      url: `${process.env.FRONTEND_URL}${href}`,
    },
  });
}
