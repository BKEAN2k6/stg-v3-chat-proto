import {useState} from 'react';
import {Form, Tabs, Tab, InputGroup, Button} from 'react-bootstrap';
import PostTextArea from './PostTextArea';
import ChallengeContent from '@/components/ui/PostCard/ChallengeContent';
import StrengthModal from '@/components/ui/StrengthModal';
import {type ChallengeData, type ChallengeTheme} from '@/api/ApiTypes';
import {type LanguageCode} from '@/i18n';

type Props = {
  readonly challengeData: ChallengeData;
  readonly onUpdate: (updatedChallenge: ChallengeData) => void;
};

export function ChallengeForm({challengeData, onUpdate}: Props) {
  const [isStrengthModalOpen, setIsStrengthModalOpen] = useState(false);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    onUpdate({...challengeData, [name]: value});
  };

  const handleTranslateChange = (lang: LanguageCode, value: string) => {
    const translations = {
      fi: challengeData.translations?.fi ?? '',
      en: challengeData.translations?.en ?? '',
      sv: challengeData.translations?.sv ?? '',
      [lang]: value,
    };

    onUpdate({
      ...challengeData,
      translations,
    });
  };

  const handleThemeChange = (theme: ChallengeTheme) => {
    onUpdate({...challengeData, theme});
  };

  return (
    <Tabs defaultActiveKey="edit" className="mb-3">
      <Tab eventKey="edit" title="Edit">
        <Form>
          <Form.Group controlId="translationEN" className="mb-3">
            <Form.Label>English</Form.Label>
            <PostTextArea
              content={challengeData.translations?.en}
              onChange={(value) => {
                handleTranslateChange('en', value);
              }}
            />
          </Form.Group>
          <Form.Group controlId="translationFI" className="mb-3">
            <Form.Label>Finnish</Form.Label>
            <PostTextArea
              content={challengeData.translations?.fi}
              onChange={(value) => {
                handleTranslateChange('fi', value);
              }}
            />
          </Form.Group>
          <Form.Group controlId="translationSV" className="mb-3">
            <Form.Label>Swedish</Form.Label>
            <PostTextArea
              content={challengeData.translations?.sv}
              onChange={(value) => {
                handleTranslateChange('sv', value);
              }}
            />
          </Form.Group>
          <Form.Group controlId="theme" className="mb-3">
            <Form.Label>Theme</Form.Label>
            <Form.Control
              as="select"
              name="theme"
              value={challengeData.theme}
              onChange={(event) => {
                handleThemeChange(event.target.value as ChallengeTheme);
              }}
            >
              <option value="default">Default</option>
              <option value="holiday-calendar">Holiday Calendar</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="challengeSrength" className="mb-3">
            <Form.Label>Strength</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                disabled
                type="text"
                name="strength"
                value={challengeData.strength ?? 'love'}
              />
              <Button
                variant="primary"
                onClick={() => {
                  setIsStrengthModalOpen(true);
                }}
              >
                Select
              </Button>
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="showDate" className="mb-3">
            <Form.Label>Show Date</Form.Label>
            <Form.Control
              type="date"
              name="showDate"
              value={
                challengeData.showDate
                  ? challengeData.showDate.slice(0, 10)
                  : ''
              }
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
        <StrengthModal
          isOpen={isStrengthModalOpen}
          selectedStrengthSlugs={[challengeData.strength]}
          onClose={() => {
            setIsStrengthModalOpen(false);
          }}
          onStrengthSelected={(strength) => {
            onUpdate({...challengeData, strength});
            setIsStrengthModalOpen(false);
          }}
        />
      </Tab>
      <Tab eventKey="preview" title="Preview">
        {['en', 'fi', 'sv'].map((lang) => (
          <div
            key={lang}
            style={{
              maxWidth: 700,
            }}
            className="text-center border mb-3"
          >
            <ChallengeContent
              participants={[]}
              challengeId=""
              theme={challengeData.theme}
              createdAt={challengeData.showDate}
              content={challengeData.translations?.[lang as LanguageCode] ?? ''}
            />
          </div>
        ))}
      </Tab>
    </Tabs>
  );
}
