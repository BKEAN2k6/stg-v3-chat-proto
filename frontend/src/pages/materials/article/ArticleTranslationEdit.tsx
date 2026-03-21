import {JsonEditor} from 'json-edit-react';
import {useState} from 'react';
import {
  Form,
  Row,
  Col,
  Accordion,
  Button,
  DropdownButton,
  Dropdown,
} from 'react-bootstrap';
import fm from 'front-matter';
import {X, Plus, GripVertical} from 'react-bootstrap-icons';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import {type ArticleTranslation, type LanguageCode} from '@client/ApiTypes';
import ThumbnailUpload from '../components/ThumbnailUpload.js';
import ArticleTextArea from './ArticleTextArea.js';
import {confirm} from '@/components/ui/confirm.js';
import constants from '@/constants.js';

type EditMaterialProperties = {
  readonly translation: ArticleTranslation;
  readonly availableTranslations: LanguageCode[];
  readonly onChange: (updatedMaterial: ArticleTranslation) => void;
  readonly onTranslate?: (source: LanguageCode) => void;
  readonly isTranslating?: boolean;
};

const getInvalidSections = (content: string[]): number[] => {
  const invalid: number[] = [];

  for (const [i, element] of content.entries()) {
    try {
      fm(element);
    } catch {
      invalid.push(i);
    }
  }

  return invalid;
};

const getTextAfterFrontMatter = (input: string) => {
  const match = /^---[\s\S]*?---/.exec(input);
  let result = input;

  if (match) {
    result = input.slice(match[0].length).trim();
  }

  return result.split('\n')[0].replaceAll('#', '').trim().slice(0, 200);
};

export default function ArticleTranslationEdit(
  properties: EditMaterialProperties,
) {
  const {
    translation,
    onChange,
    availableTranslations,
    onTranslate,
    isTranslating,
  } = properties;

  const [activeKey, setActiveKey] = useState<string | string[] | undefined>(
    '0',
  );
  const [dragEnabled, setDragEnabled] = useState<boolean>(false);
  const [invalidSections, setInvalidSections] = useState<number[]>(
    getInvalidSections(translation.content),
  );
  const [rawMode, setRawMode] = useState<boolean>(false);

  const handleChange = (event: {target: {name: string; value: string}}) => {
    const {name, value} = event.target;
    onChange({...translation, [name]: value});
  };

  const reorder = (list: string[], start: number, end: number): string[] => {
    const result = [...list];
    const removed = result.splice(start, 1);
    result.splice(end, 0, removed[0]);
    return result;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      translation.content,
      result.source.index,
      result.destination.index,
    );

    onChange({...translation, content: newItems});
    setActiveKey(undefined);
  };

  const handleDragToggle = () => {
    setDragEnabled(!dragEnabled);
  };

  const handleRawChange = (data: {
    title: string;
    description: string;
    content: string[];
  }) => {
    setInvalidSections(getInvalidSections(data.content));
    onChange({
      ...translation,
      title: data.title,
      description: data.description,
      content: data.content,
    });
  };

  return (
    <div>
      <div className="mb-3 d-flex justify-content-end">
        <Button
          variant={rawMode ? 'secondary' : 'outline-secondary'}
          size="sm"
          onClick={() => {
            setRawMode(!rawMode);
          }}
        >
          {rawMode ? 'Structured View' : 'Edit JSON'}
        </Button>
      </div>

      {rawMode ? (
        <JsonEditor
          restrictDelete
          restrictAdd
          restrictTypeSelection
          rootName={translation.language}
          data={{
            title: translation.title,
            description: translation.description,
            content: translation.content,
          }}
          setData={(data) => {
            handleRawChange(
              data as {
                title: string;
                description: string;
                content: string[];
              },
            );
          }}
          maxWidth="100%"
        />
      ) : (
        <Form>
          <Form.Group className="mb-3" as={Row} controlId="formTitle">
            <Form.Label column sm="2">
              Title
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                name="title"
                value={translation.title}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group className="mb-3" as={Row} controlId="formDescription">
            <Form.Label column sm="2">
              Description
            </Form.Label>
            <Col sm="10">
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={translation.description || ''}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group className="mb-3" as={Row} controlId="formThumbnail">
            <Form.Label column sm="2">
              Thumbnail
            </Form.Label>
            <Col sm="10">
              <ThumbnailUpload
                onChange={(thumbnail) => {
                  onChange({...translation, thumbnail});
                }}
              />
              {translation.thumbnail ? (
                <>
                  <img
                    className="mt-2"
                    src={`${constants.FILE_HOST}${translation.thumbnail}`}
                    alt="Thumbnail"
                    style={{maxWidth: '320px', maxHeight: '180px'}}
                  />
                  <br />
                  <Button
                    variant="danger"
                    className="mt-2"
                    onClick={() => {
                      onChange({...translation, thumbnail: undefined});
                    }}
                  >
                    Remove thumbnail
                  </Button>
                </>
              ) : (
                <div className="mt-2">No thumbnail</div>
              )}
            </Col>
          </Form.Group>

          <Form.Group className="mb-3" as={Row} controlId="formContent">
            <Form.Label column sm="2">
              Content
            </Form.Label>
            <Col sm="10">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable" direction="vertical">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <Accordion
                        activeKey={activeKey}
                        onSelect={(key) => {
                          setActiveKey(key ?? undefined);
                        }}
                      >
                        {translation.content.map((item, index) => (
                          <Draggable
                            key={index} // eslint-disable-line react/no-array-index-key
                            draggableId={index.toString()}
                            index={index}
                            isDragDisabled={!dragEnabled}
                          >
                            {(provided) => (
                              <Accordion.Item
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                eventKey={index.toString()}
                              >
                                <Accordion.Header
                                  className={
                                    invalidSections.includes(index)
                                      ? 'invalid-section'
                                      : ''
                                  }
                                >
                                  <div
                                    className="d-flex align-items-center"
                                    style={{
                                      minWidth: 0,
                                    }}
                                  >
                                    <div {...provided.dragHandleProps}>
                                      <GripVertical size={16} />
                                    </div>
                                    <X
                                      className="me-2"
                                      size={16}
                                      onClick={async () => {
                                        const confirmed = await confirm({
                                          title: 'Are you sure?',
                                          text: 'Do you really want to remove this section?',
                                          confirm: 'Remove',
                                          cancel: 'Cancel',
                                        });

                                        if (!confirmed) {
                                          return;
                                        }

                                        const updatedContent = [
                                          ...translation.content,
                                        ];
                                        updatedContent.splice(index, 1);
                                        onChange({
                                          ...translation,
                                          content: updatedContent,
                                        });
                                      }}
                                    />
                                    <span className="text-truncate me-2">
                                      {getTextAfterFrontMatter(item)}
                                    </span>
                                  </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                  <ArticleTextArea
                                    content={item}
                                    onChange={(content) => {
                                      const updatedContent = [
                                        ...translation.content,
                                      ];
                                      updatedContent[index] = content;

                                      const updatedArticle = {
                                        ...translation,
                                        content: updatedContent,
                                      };

                                      setInvalidSections(
                                        getInvalidSections(updatedContent),
                                      );
                                      onChange(updatedArticle);
                                    }}
                                  />
                                </Accordion.Body>
                              </Accordion.Item>
                            )}
                          </Draggable>
                        ))}
                      </Accordion>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <div className="d-flex justify-content-between my-3">
                <Button
                  variant="primary"
                  onClick={() => {
                    onChange({
                      ...translation,
                      content: [...translation.content, ''],
                    });
                  }}
                >
                  <Plus /> Add Section
                </Button>
                <Button
                  variant={dragEnabled ? 'danger' : 'secondary'}
                  onClick={handleDragToggle}
                >
                  {dragEnabled ? 'Disable Sorting' : 'Enable Sorting'}
                </Button>
              </div>
              {onTranslate ? (
                <DropdownButton
                  disabled={isTranslating}
                  title={isTranslating ? 'Translating...' : 'Translate'}
                  variant="primary"
                >
                  {availableTranslations.map((language) => (
                    <Dropdown.Item
                      key={language}
                      onClick={() => {
                        onTranslate(language);
                      }}
                    >
                      Source: {language}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              ) : null}
            </Col>
          </Form.Group>
        </Form>
      )}
    </div>
  );
}
