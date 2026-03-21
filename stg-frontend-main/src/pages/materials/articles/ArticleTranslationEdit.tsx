import {useState} from 'react';
import {Form, Row, Col, Accordion, Button} from 'react-bootstrap';
import fm from 'front-matter';
import {X, Plus, GripVertical} from 'react-bootstrap-icons';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import ArticleTextArea from './ArticleTextArea';
import {type ArticleTranslation} from '@/api/ApiTypes';
import {confirm} from '@/components/ui/confirm';

type EditMaterialProps = {
  readonly article: ArticleTranslation;
  readonly onChange: (updatedMaterial: ArticleTranslation) => void;
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

export default function ArticleTranslationEdit(props: EditMaterialProps) {
  const {article, onChange} = props;
  const [activeKey, setActiveKey] = useState<string | string[] | undefined>(
    '0',
  );
  const [dragEnabled, setDragEnabled] = useState<boolean>(false);
  const [invalidSections, setInvalidSections] = useState<number[]>(
    getInvalidSections(article.content),
  );

  const handleChange = (event: {target: {name: string; value: string}}) => {
    const {name, value} = event.target;
    onChange({...article, [name]: value});
  };

  const reorder = (list: string[], start: number, end: number): string[] => {
    const result = Array.from(list);
    const removed = result.splice(start, 1);
    result.splice(end, 0, removed[0]);
    return result;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      article.content,
      result.source.index,
      result.destination.index,
    );

    onChange({...article, content: newItems});
    setActiveKey(undefined);
  };

  const handleDragToggle = () => {
    setDragEnabled(!dragEnabled);
  };

  return (
    <Form>
      <Form.Group className="mb-3" as={Row} controlId="formTitle">
        <Form.Label column sm="2">
          Title
        </Form.Label>
        <Col sm="10">
          <Form.Control
            type="text"
            name="title"
            value={article.title}
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
            value={article.description || ''}
            onChange={handleChange}
          />
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
                    {article.content.map((item, index) => (
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

                                    const updatedContent = [...article.content];
                                    updatedContent.splice(index, 1);
                                    onChange({
                                      ...article,
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
                                  const updatedContent = [...article.content];
                                  updatedContent[index] = content;

                                  const updatedArticle = {
                                    ...article,
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
                  ...article,
                  content: [...article.content, ''],
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
        </Col>
      </Form.Group>
    </Form>
  );
}
