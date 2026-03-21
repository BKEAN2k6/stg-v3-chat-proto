import process from 'node:process';
import configureSidemail from 'sidemail';

const apiKey = process.env.SIDEMAIL_API_KEY;

export default async function sendConfirmNewEmail(
  firstName: string,
  destination: string,
  href: string,
) {
  const sidemail = configureSidemail({apiKey});

  await sidemail.sendEmail({
    fromName: 'See The Good',
    fromAddress: 'support@positive.fi',
    toAddress: destination,
    templateName: 'Confirm your new email (en-US)',
    templateProps: {
      destination,
      firstName,
      url: `${process.env.FRONTEND_URL}${href}`,
    },
  });
}
