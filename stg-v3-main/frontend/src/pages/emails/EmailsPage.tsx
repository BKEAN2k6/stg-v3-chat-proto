import {useState, useEffect} from 'react';
import api from '@client/ApiClient';
import {type GetEmailsResponse} from '@client/ApiTypes';
import {useToasts} from '@/components/toasts/index.js';
import {useTitle} from '@/context/pageTitleContext.js';
import PageTitle from '@/components/ui/PageTitle.js';

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
      <h3>{language}</h3>
      {emailList.map((email) => (
        <div key={email}>{email}</div>
      ))}
    </div>
  );

  return (
    <div className="d-flex flex-column gap-3">
      <PageTitle title="Emails" />

      {renderEmails('English', emails.en)}
      {renderEmails('Finnish', emails.fi)}
      {renderEmails('Swedish', emails.sv)}
    </div>
  );
}
