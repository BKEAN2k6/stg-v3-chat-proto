import React, {useState, useEffect} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import {type LanguageCode, type Article} from '@client/ApiTypes';

type SaveModalProperties = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly article: Article;
  readonly onSave: (updatedArticle: Article, changeLog: string) => void;
};

export default function SaveModal({
  isOpen,
  onClose,
  article,
  onSave,
}: SaveModalProperties) {
  const [changeLog, setChangeLog] = useState('');
  const [translationUpdates, setTranslationUpdates] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (article?.translations) {
      const initialUpdates: Record<LanguageCode, boolean> = {
        en: false,
        fi: false,
        sv: false,
      };
      for (const translation of article.translations) {
        initialUpdates[translation.language] = translation.requiresUpdate;
      }

      setTranslationUpdates(initialUpdates);
    }
  }, [article]);

  const handleCheckboxChange = (language: string) => {
    setTranslationUpdates((previous) => ({
      ...previous,
      [language]: !previous[language],
    }));
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedTranslations = article.translations.map((translation) => ({
      ...translation,
      requiresUpdate:
        translationUpdates[translation.language] ?? translation.requiresUpdate,
    }));

    const updatedArticle = {
      ...article,
      translations: updatedTranslations,
    };

    onSave(updatedArticle, changeLog);
    setChangeLog('');
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Save Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="changeLog">
            <Form.Label>Changelog Message</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={3}
              placeholder="Enter changelog message"
              value={changeLog}
              onChange={(event) => {
                setChangeLog(event.target.value);
              }}
            />
          </Form.Group>
          <Form.Group controlId="requiresUpdateOptions" className="mt-3">
            <Form.Label>Mark translations as requiring update</Form.Label>
            {article.translations.map((translation) => (
              <Form.Check
                key={translation.language}
                type="checkbox"
                id={`update-${translation.language}`}
                label={translation.language}
                checked={translationUpdates[translation.language] || false}
                onChange={() => {
                  handleCheckboxChange(translation.language);
                }}
              />
            ))}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
