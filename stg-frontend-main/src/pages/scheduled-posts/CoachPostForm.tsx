import {useState} from 'react';
import {X} from 'react-bootstrap-icons';
import {useLingui} from '@lingui/react';
import {Trans} from '@lingui/macro';
import {Form, Tabs, Tab, Button} from 'react-bootstrap';
import PostTextArea from './PostTextArea';
import CoachPostContent from '@/components/ui/PostCard/CoachPostContent';
import CoachPostHeader from '@/components/ui/PostCard/CoachPostHeader';
import StrengthList from '@/components/ui/StrengthList';
import StrengthModal from '@/components/ui/StrengthModal';
import {type CreateCoachPostRequest, type StrengthSlug} from '@/api/ApiTypes';
import {type LanguageCode} from '@/i18n';
import {slugToListItem} from '@/helpers/strengths';

type Props = {
  readonly challengeData: CreateCoachPostRequest;
  readonly onUpdate: (updatedChallenge: CreateCoachPostRequest) => void;
};

export default function CoachPostForm({challengeData, onUpdate}: Props) {
  const [isStrengthModalOpen, setIsStrengthModalOpen] = useState(false);
  const {i18n} = useLingui();
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

  const handleStrengthModalClose = () => {
    setIsStrengthModalOpen(false);
  };

  const handleStrengthModalOpen = () => {
    setIsStrengthModalOpen(true);
  };

  const handleStrengthSelected = (selectedStrength: StrengthSlug) => {
    const updatedStrengths = [...challengeData.strengths, selectedStrength];
    onUpdate({...challengeData, strengths: updatedStrengths});
    setIsStrengthModalOpen(false);
  };

  const handleStrengthDeselected = (selectedSlug: StrengthSlug) => {
    const updatedStrengths = challengeData.strengths.filter(
      (slug) => slug !== selectedSlug,
    );
    onUpdate({...challengeData, strengths: updatedStrengths});
  };

  return (
    <Tabs defaultActiveKey="edit" className="mb-3">
      <Tab eventKey="edit" title="Edit">
        <Form>
          <Form.Group controlId="formBasicEN" className="mb-3">
            <Form.Label>English</Form.Label>
            <PostTextArea
              content={challengeData.translations?.en}
              onChange={(value) => {
                handleTranslateChange('en', value);
              }}
            />
          </Form.Group>
          <Form.Group controlId="formBasicFI" className="mb-3">
            <Form.Label>Finnish</Form.Label>
            <PostTextArea
              content={challengeData.translations?.fi}
              onChange={(value) => {
                handleTranslateChange('fi', value);
              }}
            />
          </Form.Group>
          <Form.Group controlId="formBasicSV" className="mb-3">
            <Form.Label>Swedish</Form.Label>
            <PostTextArea
              content={challengeData.translations?.sv}
              onChange={(value) => {
                handleTranslateChange('sv', value);
              }}
            />
          </Form.Group>
          <Form.Group controlId="formBasicStrength" className="mb-3">
            <Form.Label>Strength</Form.Label>
            <div className="d-flex flex-wrap gap-2 align-items-start">
              {challengeData.strengths.map((strength) => (
                <Button key={strength} variant="outline-primary">
                  {slugToListItem(strength, i18n.locale).title}
                  <X
                    onClick={() => {
                      handleStrengthDeselected(strength);
                    }}
                  />
                </Button>
              ))}

              <Button
                onClick={() => {
                  handleStrengthModalOpen();
                }}
              >
                <Trans>Add Strength</Trans>
              </Button>
            </div>
          </Form.Group>
          <Form.Group controlId="formBasicShowDate" className="mb-3">
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
          selectedStrengthSlugs={challengeData.strengths}
          onClose={handleStrengthModalClose}
          onStrengthSelected={handleStrengthSelected}
        />
      </Tab>
      <Tab eventKey="preview" title="Preview">
        {['en', 'fi', 'sv'].map((lang) => (
          <div
            key={lang}
            style={{
              maxWidth: 700,
            }}
            className="mb-3"
          >
            <div className="p-2 p-md-3 d-flex flex-column gap-3 border rounded">
              <CoachPostHeader
                momentId=""
                createdAt={challengeData.showDate}
                onDelete={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
              />
              <CoachPostContent
                content={
                  challengeData.translations?.[lang as LanguageCode] ?? ''
                }
                images={[]}
              />
              <StrengthList strengths={challengeData.strengths} />
            </div>
          </div>
        ))}
      </Tab>
    </Tabs>
  );
}
