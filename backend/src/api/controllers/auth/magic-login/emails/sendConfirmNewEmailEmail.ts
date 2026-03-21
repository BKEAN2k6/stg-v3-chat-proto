import process from 'node:process';
import configureSidemail from 'sidemail';

const apiKey = process.env.SIDEMAIL_API_KEY;

export default async function sendConfirmNewEmailEmail(
  firstName: string,
  email: string,
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
    toAddress: email,
    templateName: 'Confirm your new email (en-US)',
    templateProps: {
      email,
      firstName,
      url: `${process.env.FRONTEND_URL}${href}`,
    },
  });
}
