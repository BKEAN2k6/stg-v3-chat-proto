'use client';

import {type ChangeEvent, useState} from 'react';
import {useCookies} from 'next-client-cookies';
import TextareaAutosize from 'react-textarea-autosize';
import {getLocaleCode} from '@/lib/locale';
import useAnalytics from '@/hooks/useAnalytics';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/atomic/atoms/Dialog';
import {NoteIcon} from '@/components/atomic/atoms/NoteIcon';

const texts = {
  placeholderText: {
    'en-US': 'Write your own text',
    'sv-SE': 'Skriv din egen text',
    'fi-FI': 'Kirjoita oma tekstisi',
  },
  dialogTitle: {
    'en-US': 'Add a note',
    'sv-SE': 'Lägg till en anteckning',
    'fi-FI': 'Lisää viesti',
  },
  dialogDescription: {
    'en-US': 'Describe what you saw in the moment',
    'sv-SE': 'Beskriv vad du såg i ögonblicket',
    'fi-FI': 'Kuvaile mitä näit hetkessä',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

// This matches the database
const MAX_CHARACTERS = 250;

type Props = {
  readonly onNoteChange: (note: string) => void;
};

export const NoteButton = (props: Props) => {
  const {recordEvent} = useAnalytics();
  const {onNoteChange} = props;
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const [note, setNote] = useState('');
  const [finalNote, setFinalNote] = useState<undefined | string>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = (event?: any) => {
    event?.preventDefault();
    setFinalNote(note);
    setDialogOpen(false);
    onNoteChange(note);
    if (note && note.length > 0) {
      recordEvent('seethegood:add_note_with_content', {length: note.length});
    }
  };

  const handleOpenChange = (newOpenState: boolean) => {
    if (newOpenState) {
      recordEvent('seethegood:start_add_note');
    }

    if (!newOpenState) {
      handleSubmit();
    }

    setDialogOpen(newOpenState);
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    if (value.length <= MAX_CHARACTERS) {
      setNote(value);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger className="flex w-full flex-col rounded-lg border border-gray-200 bg-gray-100 p-4">
        <div className="flex w-full items-center justify-between text-left">
          <div>
            {finalNote ? (
              <p>{finalNote}</p>
            ) : (
              <span className="font-bold">{t('dialogTitle', locale)}</span>
            )}
          </div>
          <div
            className="flex items-center justify-center text-left"
            style={{width: 32, height: 32}}
          >
            <NoteIcon style={{width: 16, height: 16}} />
          </div>
        </div>
        {!finalNote && (
          <div className="mt-2 text-left">
            <span className="text-gray-600">
              {t('dialogDescription', locale)}
            </span>
          </div>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dialogTitle', locale)}</DialogTitle>
          <DialogDescription>
            {t('dialogDescription', locale)}
          </DialogDescription>
        </DialogHeader>
        <div>
          <form className="w-full max-w-md text-right" onSubmit={handleSubmit}>
            <TextareaAutosize
              className="mb-2 w-full resize-none rounded-lg border-2 border-gray-200 p-4"
              minRows={4}
              value={note}
              placeholder={t('placeholderText', locale)}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="rounded-lg border border-gray-400 px-2 pt-0.5"
            >
              Ok
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
