import {useEffect, useMemo, useState} from 'react';
import {
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Badge,
  Alert,
  ButtonGroup,
  InputGroup,
} from 'react-bootstrap';
import api from '@client/ApiClient.js';
import {
  type CreateVideoProcessingJobRequest,
  type GetVideoProcessingJobsResponse,
} from '@client/ApiTypes';
import {confirm} from '@/components/ui/confirm.js';
import PageTitle from '@/components/ui/PageTitle.js';
import constants from '@/constants.js';
import ManifestVideoPlayer from '@/components/ui/ManifestVideoPlayer.js';

// Small helpers
const statusVariant = (status: string) =>
  ({
    processing: 'warning',
    completed: 'success',
    failed: 'danger',
    'timed-out': 'danger',
  })[status] ?? 'secondary';

const typeVariant = (type: string) => (type === 'lottie' ? 'info' : 'primary');
const sourceVariant = (source: string) =>
  source === 'drive' ? 'secondary' : 'dark';

const emptyCreate: CreateVideoProcessingJobRequest = {
  url: '',
  type: 'video',
  source: 'file',
  fileName: '',
  loop: false,
  coverFrameTimestamp: 0,
};

const fifteenMinutes = 15 * 60 * 1000;
const isTimedOut = (job: GetVideoProcessingJobsResponse[number]) => {
  if (!job?.updatedAt) return false;
  if (job.status !== 'processing') return false;
  const last = new Date(job.updatedAt).getTime();
  return Date.now() - last >= fifteenMinutes;
};

export default function VideoProcessingJobsPage() {
  const [jobs, setJobs] = useState<GetVideoProcessingJobsResponse>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & client-side filter
  const [query, setQuery] = useState('');

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] =
    useState<CreateVideoProcessingJobRequest>(emptyCreate);
  const [submittingCreate, setSubmittingCreate] = useState(false);

  // Update (status) modal
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedJob, setSelectedJob] = useState<
    GetVideoProcessingJobsResponse[number] | undefined
  >(undefined);
  const [submittingUpdate, setSubmittingUpdate] = useState(false);
  const [updateCoverImageTimestamp, setUpdateCoverImageTimestamp] =
    useState<string>('');

  const [showViewer, setShowViewer] = useState(false);
  const [viewerName, setViewerName] = useState<string>();

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getVideoProcessingJobs();
      setJobs(data);
    } catch {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await refresh();
    })();
  }, []);

  const filteredJobs = useMemo(() => {
    if (!query.trim()) return jobs;
    const q = query.toLowerCase();
    return jobs.filter((index) =>
      [
        index.id,
        index.url,
        index.type,
        index.source,
        index.status,
        index.fileName,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [jobs, query]);

  // CREATE
  const handleCreate = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event?.preventDefault?.();
    setSubmittingCreate(true);
    setError('');
    try {
      const created = await api.createVideoProcessingJob(createForm);
      setShowCreate(false);
      setCreateForm(emptyCreate);
      // Optimistic prepend
      setJobs((previous) => [created, ...previous]);
    } catch {
      setError('Failed to create job');
    } finally {
      setSubmittingCreate(false);
    }
  };

  // UPDATE (status -> processing)
  const openUpdate = (job: GetVideoProcessingJobsResponse[number]) => {
    setSelectedJob(job);
    setUpdateCoverImageTimestamp(
      job?.coverFrameTimestamp === undefined
        ? ''
        : String((job as any).coverFrameTimestamp),
    );
    setShowUpdate(true);
  };

  const handleUpdate = async () => {
    if (!selectedJob) return;
    setSubmittingUpdate(true);
    setError('');
    try {
      // API allows updating status and (optionally) coverFrameTimestamp
      const patch: Record<string, unknown> = {status: 'processing'};
      const trimmed = updateCoverImageTimestamp.trim();
      if (trimmed !== '') {
        const parsed = Number.parseFloat(trimmed);
        if (!Number.isNaN(parsed)) {
          patch.coverFrameTimestamp = parsed;
        }
      }

      const updated = await api.updateVideoProcessingJob(
        {id: selectedJob.id},
        patch,
      );
      setJobs((previous) =>
        previous.map((index) => (index.id === updated.id ? updated : index)),
      );
      setShowUpdate(false);
      setSelectedJob(undefined);
      setUpdateCoverImageTimestamp('');
    } catch {
      setError('Failed to update job');
    } finally {
      setSubmittingUpdate(false);
    }
  };

  // DELETE
  const handleDelete = async (job: GetVideoProcessingJobsResponse[number]) => {
    const confirmed = await confirm({
      title: `Delete job ${job.fileName || job.id} and its associated video files?`,
      text: 'This cannot be undone.',
      cancel: 'Cancel',
      confirm: 'Delete',
    });
    if (!confirmed) return;
    setError('');
    try {
      await api.removeVideoProcessingJob({id: job.id});
      setJobs((previous) => previous.filter((index) => index.id !== job.id));
    } catch {
      setError('Failed to delete job');
    }
  };

  return (
    <>
      <PageTitle title="Video Processing Jobs">
        <ButtonGroup>
          <Button
            variant="primary"
            onClick={() => {
              setShowCreate(true);
            }}
          >
            + New Job
          </Button>
          <Button
            variant="outline-secondary"
            disabled={loading}
            onClick={refresh}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />{' '}
                Refreshing
              </>
            ) : (
              'Refresh'
            )}
          </Button>
        </ButtonGroup>
      </PageTitle>

      <Row className="mb-3 mt-3">
        <Col md={6} lg={4}>
          <InputGroup>
            <InputGroup.Text>Search</InputGroup.Text>
            <Form.Control
              placeholder="Filter by id, url, file name, status..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
            />
          </InputGroup>
        </Col>
      </Row>

      {error ? (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      ) : null}

      <Row>
        <Col>
          <div className="border rounded-3 p-0 overflow-auto bg-white shadow-sm">
            <Table responsive hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{minWidth: 220}}>File</th>
                  <th>Type</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th className="text-truncate" style={{maxWidth: 360}}>
                    Source
                  </th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th style={{width: 170}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5">
                      <Spinner
                        animation="border"
                        role="status"
                        className="me-2"
                      />
                      Loading jobs...
                    </td>
                  </tr>
                ) : filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5 text-muted">
                      No jobs found.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <div
                          className="fw-semibold text-truncate"
                          title={job.fileName}
                        >
                          {job.fileName}{' '}
                          {job.status === 'completed' && (
                            <Button
                              variant="link"
                              className="p-0 align-baseline"
                              onClick={() => {
                                setViewerName(job.fileName); // animationUrl === name
                                setShowViewer(true);
                              }}
                            >
                              view
                            </Button>
                          )}
                        </div>
                        <div
                          className="small text-muted text-truncate"
                          title={job.id}
                        >
                          {job.id}
                        </div>
                      </td>
                      <td>
                        <Badge
                          bg={typeVariant(job.type)}
                          className="text-uppercase"
                        >
                          {job.type}
                        </Badge>
                      </td>
                      <td>
                        <Badge
                          bg={sourceVariant(job.source)}
                          className="text-uppercase"
                        >
                          {job.source}
                        </Badge>
                      </td>
                      <td>
                        <Badge
                          bg={statusVariant(
                            isTimedOut(job) ? 'timed-out' : job.status,
                          )}
                          className="text-uppercase"
                        >
                          {isTimedOut(job) ? 'timed out' : job.status}
                        </Badge>
                      </td>
                      <td>
                        {job.url ? (
                          <a href={job.url} target="_blank" rel="noreferrer">
                            Link
                          </a>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        {job.createdAt
                          ? new Date(job.createdAt).toLocaleString()
                          : '—'}
                      </td>
                      <td>
                        {job.updatedAt
                          ? new Date(job.updatedAt).toLocaleString()
                          : '—'}
                      </td>
                      <td>
                        <ButtonGroup size="sm">
                          <Button
                            variant="outline-warning"
                            title="Set status to processing"
                            onClick={() => {
                              openUpdate(job);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            onClick={async () => handleDelete(job)}
                          >
                            Delete
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      {/* Create Modal */}
      <Modal
        centered
        show={showCreate}
        size="lg"
        onHide={() => {
          setShowCreate(false);
        }}
      >
        <Form onSubmit={handleCreate}>
          <Modal.Header closeButton>
            <Modal.Title>New Video Processing Job</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={8}>
                <Form.Group controlId="url">
                  <Form.Label>URL</Form.Label>
                  <Form.Control
                    required
                    type="url"
                    placeholder="https://..."
                    value={createForm.url}
                    onChange={(event) => {
                      const url = event.target.value;
                      setCreateForm((previous) => {
                        const source =
                          url.startsWith('https://drive.google.com/') &&
                          previous.source === 'file'
                            ? 'drive'
                            : previous.source;
                        const type = url.endsWith('.json')
                          ? 'lottie'
                          : previous.type;
                        return {...previous, url, source, type};
                      });
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="fileName">
                  <Form.Label>Unique file name (no extension)</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="my-video"
                    value={createForm.fileName}
                    onChange={(event) => {
                      setCreateForm({
                        ...createForm,
                        fileName: event.target.value,
                      });
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="type">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={createForm.type}
                    onChange={(event) => {
                      setCreateForm({
                        ...createForm,
                        type: event.target.value as 'lottie' | 'video',
                      });
                    }}
                  >
                    <option value="lottie">lottie</option>
                    <option value="video">video</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="source">
                  <Form.Label>Source</Form.Label>
                  <Form.Select
                    value={createForm.source}
                    onChange={(event) => {
                      setCreateForm({
                        ...createForm,
                        source: event.target.value as 'file' | 'drive',
                      });
                    }}
                  >
                    <option value="file">file</option>
                    <option value="drive">drive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="coverFrameTimestamp">
                  <Form.Label>Cover image timestamp (seconds)</Form.Label>
                  <Form.Control
                    type="number"
                    step="any"
                    placeholder="e.g. 1.25"
                    value={createForm.coverFrameTimestamp ?? ''}
                    onChange={(event) => {
                      const v = event.target.value;
                      setCreateForm((previous) => {
                        const next = {...previous};
                        if (v.trim() === '') {
                          delete next.coverFrameTimestamp;
                        } else {
                          const parsed = Number.parseFloat(v);
                          if (!Number.isNaN(parsed)) {
                            next.coverFrameTimestamp = parsed;
                          }
                        }

                        return next;
                      });
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={() => {
                setShowCreate(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submittingCreate}>
              {submittingCreate ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />{' '}
                  Creating
                </>
              ) : (
                'Create Job'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Update Modal */}
      <Modal
        centered
        show={showUpdate}
        onHide={() => {
          setShowUpdate(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Set Status to Processing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedJob ? (
            <>
              <div className="mb-2">
                <strong>File:</strong> {selectedJob.fileName}
              </div>
              <div className="mb-2">
                <strong>Current Status:</strong>{' '}
                <Badge bg={statusVariant(selectedJob.status)}>
                  {selectedJob.status}
                </Badge>
              </div>
              <Form.Group
                controlId="updateCoverImageTimestamp"
                className="mt-3"
              >
                <Form.Label>Cover image timestamp (seconds)</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  placeholder="Leave empty to keep unchanged"
                  value={updateCoverImageTimestamp}
                  onChange={(event) => {
                    setUpdateCoverImageTimestamp(event.target.value);
                  }}
                />
              </Form.Group>
            </>
          ) : (
            <div className="text-muted">No job selected.</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setShowUpdate(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="warning"
            disabled={submittingUpdate || !selectedJob}
            onClick={handleUpdate}
          >
            {submittingUpdate ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />{' '}
                Updating
              </>
            ) : (
              'Set Processing'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        centered
        size="lg"
        show={showViewer}
        onHide={() => {
          setShowViewer(false);
          setViewerName(undefined);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {viewerName ? `Preview: ${viewerName}` : 'Preview'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {viewerName ? (
            <ManifestVideoPlayer
              isFullScreenAllowed
              isClickable
              url={`${constants.FILE_HOST}${viewerName}`} // animationUrl === name
            />
          ) : (
            <div className="text-muted">No animation selected.</div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
