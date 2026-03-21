import {useState, useEffect} from 'react';
import {useToasts} from '@/components/toasts';
import api from '@/api/ApiClient';
import {type GetEmailsResponse} from '@/api/ApiTypes';
import {useTitle} from '@/context/pageTitleContext';

export default function EmailsPage() {
  const toasts = useToasts();
  const [emails, setEmails] = useState<GetEmailsResponse>();
  const {setTitle} = useTitle();

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const emails = await api.getEmails();
        setEmails(emails);
      } catch {
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while fetching the emails',
        });
      }
    };

    void fetchEmails();
  }, [toasts]);

  useEffect(() => {
    setTitle('Emails');
  }, [setTitle]);

  if (!emails) {
    return null;
  }

  const renderEmails = (language: string, emailList: string[]) => (
    <div>
      <h2>{language}</h2>
      {emailList.map((email) => (
        <div key={email}>{email}</div>
      ))}
    </div>
  );

  return (
    <div>
      {renderEmails('English', emails.en)}
      {renderEmails('Finnish', emails.fi)}
      {renderEmails('Swedish', emails.sv)}
    </div>
  );
}
