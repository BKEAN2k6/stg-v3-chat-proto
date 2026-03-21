import {Form, Row, Col, Button} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import {useState} from 'react';
import {type Article, type StrengthSlug} from '@client/ApiTypes';
import {slugToListItem} from '@/helpers/strengths.js';
import StrengthModal from '@/components/ui/StrengthModal.js';
import {ageGroups, articleChapters} from '@/helpers/article.js';

type Properties = {
  readonly article: Article;
  readonly onChange: (updatedMaterial: Article) => void;
};

export default function ArticleTimelineForm(properties: Properties) {
  const {article, onChange} = properties;
  const {i18n} = useLingui();
  const [isStrengthModalOpen, setIsStrengthModalOpen] = useState(false);

  const handleStrengthSelected = (selectedStrength: StrengthSlug) => {
    onChange({
      ...article,
      timelineStrength: selectedStrength,
    });
    setIsStrengthModalOpen(false);
  };

  return (
    <Form>
      <Form.Group className="mb-3" as={Row} controlId="isTimelineArticle">
        <Form.Label column sm="2">
          Timeline article
        </Form.Label>
        <Col sm="10">
          <Form.Check
            type="checkbox"
            name="isHidden"
            checked={article.isTimelineArticle}
            onChange={(event) => {
              onChange({
                ...article,
                isTimelineArticle: event.target.checked,
              });
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group className="mb-3" as={Row} controlId="timelineAgeGroup">
        <Form.Label column sm="2">
          Age group
        </Form.Label>
        <Col sm="10">
          <Form.Select
            name="ageGroup"
            value={article.timelineAgeGroup}
            onChange={(event) => {
              onChange({
                ...article,
                timelineAgeGroup: event.target
                  .value as (typeof ageGroups)[number],
              });
            }}
          >
            {ageGroups.map((ageGroup) => (
              <option key={ageGroup} value={ageGroup}>
                {ageGroup}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Form.Group>
      <Form.Group className="mb-3" as={Row} controlId="timelineChapter">
        <Form.Label column sm="2">
          Chapter
        </Form.Label>
        <Col sm="10">
          <Form.Select
            name="timelineChapter"
            value={article.timelineChapter}
            onChange={(event) => {
              onChange({
                ...article,
                timelineChapter: event.target
                  .value as (typeof articleChapters)[number],
              });
            }}
          >
            {articleChapters.map((chapter) => (
              <option key={chapter} value={chapter}>
                {chapter}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Form.Group>
      <Form.Group className="mb-3" as={Row} controlId="timelineStrength">
        <Form.Label column sm="2">
          Strength
        </Form.Label>
        <Col sm="10">
          <div className="d-flex flex-wrap gap-2 align-items-start">
            {slugToListItem(article.timelineStrength, i18n.locale).title}

            <Button
              onClick={() => {
                setIsStrengthModalOpen(true);
              }}
            >
              Change stregth
            </Button>
          </div>
        </Col>
      </Form.Group>

      <StrengthModal
        isOpen={isStrengthModalOpen}
        selectedStrengthSlugs={[article.timelineStrength]}
        onClose={() => {
          setIsStrengthModalOpen(false);
        }}
        onStrengthSelected={handleStrengthSelected}
      />
    </Form>
  );
}
