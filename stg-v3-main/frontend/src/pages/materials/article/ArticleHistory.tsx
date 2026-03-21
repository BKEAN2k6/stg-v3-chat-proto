import {useState, useEffect} from 'react';
import {Modal, Button, ButtonGroup, Row, Col, Table} from 'react-bootstrap';
import api from '@client/ApiClient';
import {type GetArticleHistoriesResponse, type Article} from '@client/ApiTypes';
import ReactDiffViewer, {DiffMethod} from 'react-diff-viewer-continued';
import ArticlePreview from './ArticlePreview.js';
import {useToasts} from '@/components/toasts/index.js';
import CenteredLoader from '@/components/CenteredLoader.js';

type Properties = {
  readonly id: string;
};

function sortObjectKeys<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map((item) =>
      sortObjectKeys(item as unknown as T),
    ) as unknown as T;
  }

  if (input !== null && typeof input === 'object') {
    const sortedObject: Record<string, unknown> = {};
    for (const key of Object.keys(input).sort()) {
      sortedObject[key] = sortObjectKeys(
        (input as Record<string, unknown>)[key],
      );
    }

    return sortedObject as T;
  }

  return input;
}

type ArticlePair = {
  old: Article;
  new: Article;
};

export default function ArticleHistory(properties: Properties) {
  const {id} = properties;
  const toasts = useToasts();
  const [history, setHistory] = useState<GetArticleHistoriesResponse>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<
    ArticlePair | undefined
  >(undefined);
  const [diffLoading, setDiffLoading] = useState(false);
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [viewMode, setViewMode] = useState<'diff' | 'preview'>('preview');

  useEffect(() => {
    const getHistory = async () => {
      if (!id) return;

      try {
        const response = await api.getArticleHistories({id});
        setHistory(response);
      } catch {
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while loading the history',
        });
      } finally {
        setLoading(false);
      }
    };

    void getHistory();
  }, [id, toasts]);

  const toggleSelection = (itemId: string) => {
    setSelectedIds((previous) => {
      if (previous.includes(itemId)) {
        return previous.filter((id) => id !== itemId);
      }

      if (previous.length < 2) {
        return [...previous, itemId];
      }

      return previous;
    });
  };

  const compareSelected = async () => {
    setDiffLoading(true);
    try {
      const selectedHistoryItems = history.filter((item) =>
        selectedIds.includes(item.id),
      );

      selectedHistoryItems.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );

      if (selectedHistoryItems.length === 1) {
        const [item] = selectedHistoryItems;
        const response = await api.getArticleHistory({id: item.id});

        setSelectedArticles({
          old: response.data as Article,
          new: response.data as Article,
        });
      } else if (selectedHistoryItems.length === 2) {
        const [oldItem, newItem] = selectedHistoryItems;
        const [oldResponse, newResponse] = await Promise.all([
          api.getArticleHistory({id: oldItem.id}),
          api.getArticleHistory({id: newItem.id}),
        ]);

        setSelectedArticles({
          old: oldResponse.data as Article,
          new: newResponse.data as Article,
        });
      }

      setShowDiffModal(true);
    } catch {
      toasts.danger({
        header: 'Comparison Error',
        body: 'Failed to load history documents for comparison.',
      });
    } finally {
      setDiffLoading(false);
    }
  };

  const clearComparison = () => {
    setSelectedIds([]);
    setSelectedArticles(undefined);
    setViewMode('diff');
    setShowDiffModal(false);
  };

  if (loading) {
    return <CenteredLoader />;
  }

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Timestamp</th>
            <th>User</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {history.map((historyItem) => {
            const isSelected = selectedIds.includes(historyItem.id);
            const disableCheckbox = !isSelected && selectedIds.length >= 2;
            return (
              <tr key={historyItem.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={disableCheckbox}
                    onChange={() => {
                      toggleSelection(historyItem.id);
                    }}
                  />
                </td>
                <td>{new Date(historyItem.timestamp).toLocaleString()}</td>
                <td>
                  {historyItem.data.updatedBy?.firstName}{' '}
                  {historyItem.data.updatedBy?.lastName}
                </td>
                <td>{historyItem.changeLog}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <div style={{marginBottom: '1rem'}}>
        <Button
          variant="primary"
          disabled={selectedIds.length === 0 || diffLoading}
          onClick={compareSelected}
        >
          {diffLoading ? 'Comparing...' : 'Compare Selected'}
        </Button>
        {selectedArticles ? (
          <Button
            variant="secondary"
            style={{marginLeft: '0.5rem'}}
            onClick={clearComparison}
          >
            Clear Comparison
          </Button>
        ) : null}
      </div>

      {selectedArticles ? (
        <Modal
          centered
          fullscreen
          show={showDiffModal}
          size="xl"
          onHide={() => {
            setViewMode('preview');
            setShowDiffModal(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Comparison</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{marginBottom: '1rem'}}>
              <ButtonGroup>
                <Button
                  variant={
                    viewMode === 'preview' ? 'primary' : 'outline-primary'
                  }
                  onClick={() => {
                    setViewMode('preview');
                  }}
                >
                  Preview View
                </Button>
                {selectedArticles.old.updatedAt !==
                  selectedArticles.new.updatedAt && (
                  <Button
                    variant={
                      viewMode === 'diff' ? 'primary' : 'outline-primary'
                    }
                    onClick={() => {
                      setViewMode('diff');
                    }}
                  >
                    Diff View
                  </Button>
                )}
              </ButtonGroup>
            </div>

            {viewMode === 'diff' && (
              <ReactDiffViewer
                splitView
                compareMethod={DiffMethod.WORDS}
                oldValue={JSON.stringify(
                  sortObjectKeys(selectedArticles.old.translations),
                  null,
                  2,
                )}
                newValue={JSON.stringify(
                  sortObjectKeys(selectedArticles.new.translations),
                  null,
                  2,
                )}
              />
            )}

            {viewMode === 'preview' && (
              <Row className="row">
                <Col xs={6} className="col">
                  <h5>
                    {new Date(selectedArticles.old.updatedAt).toLocaleString()}
                  </h5>
                  <ArticlePreview article={selectedArticles.old} />
                </Col>
                <Col xs={6} className="col">
                  <h5>
                    {new Date(selectedArticles.new.updatedAt).toLocaleString()}
                  </h5>
                  <ArticlePreview article={selectedArticles.new} />
                </Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowDiffModal(false);
                setViewMode('preview');
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      ) : null}
    </div>
  );
}
