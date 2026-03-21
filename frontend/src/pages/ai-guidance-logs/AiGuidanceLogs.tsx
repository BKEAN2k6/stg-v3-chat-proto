import {useCallback, useEffect, useId, useMemo, useRef, useState} from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Stack,
  Table,
} from 'react-bootstrap';
import {AsyncTypeahead, type TypeaheadRef} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import Markdown from 'react-markdown';
import type {GetCommunitiesResponse} from '@client/ApiTypes.js';
import {
  useGetAiGuidanceLogByIdQuery,
  useGetAiGuidanceLogsQuery,
  useGetCommunitiesQuery,
  useGetCommunityGroupsQuery,
} from '@/hooks/useApi.js';
import PageTitle from '@/components/ui/PageTitle.js';

const minimumCommunitySearchLength = 2;

type CommunityOption = GetCommunitiesResponse[number];

export default function AiGuidanceLogs() {
  const [communitySearchTerm, setCommunitySearchTerm] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityOption>();
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [skip, setSkip] = useState(0);
  const [selectedLogId, setSelectedLogId] = useState<string>();
  const communitySearchReference = useRef<TypeaheadRef>(null);
  const communitySearchId = useId();
  const limit = 25;

  const trimmedCommunitySearch = communitySearchTerm.trim();
  const isCommunitySearchEnabled =
    trimmedCommunitySearch.length >= minimumCommunitySearchLength;

  const communitySearchQuery = useGetCommunitiesQuery(
    isCommunitySearchEnabled
      ? {search: trimmedCommunitySearch, limit: '25'}
      : undefined,
    {enabled: isCommunitySearchEnabled},
  );

  const communitySearchData = useMemo(
    () =>
      isCommunitySearchEnabled && communitySearchQuery.data
        ? communitySearchQuery.data
        : [],
    [communitySearchQuery.data, isCommunitySearchEnabled],
  );

  const groupsQuery = useGetCommunityGroupsQuery(
    {id: selectedCommunity?.id ?? ''},
    {enabled: Boolean(selectedCommunity?.id)},
  );

  const logsQuery = useGetAiGuidanceLogsQuery(
    {
      communityId: selectedCommunity?.id,
      groupId: selectedGroupId || undefined,
      skip: String(skip),
      limit: String(limit),
    },
    {
      refetchOnMount: 'always',
    },
  );

  const logDetailQuery = useGetAiGuidanceLogByIdQuery(
    {id: selectedLogId ?? ''},
    {enabled: Boolean(selectedLogId)},
  );

  const handleCommunitySearchInput = useCallback((value: string) => {
    setCommunitySearchTerm(value);
  }, []);

  const handleClearCommunity = useCallback(() => {
    setSelectedCommunity(undefined);
    setSelectedGroupId('');
    setSkip(0);
    communitySearchReference.current?.clear();
  }, []);

  const handleGroupChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedGroupId(event.target.value);
      setSkip(0);
    },
    [],
  );

  const hasMore = logsQuery.data ? skip + limit < logsQuery.data.total : false;

  useEffect(() => {
    setSkip(0);
  }, [selectedCommunity?.id, selectedGroupId]);

  return (
    <Stack gap={3}>
      <PageTitle title="AI Guidance Logs" />

      <Card>
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col md={5}>
              <Form.Group>
                <Form.Label>Community</Form.Label>
                <Stack direction="horizontal" gap={2}>
                  <div className="flex-grow-1">
                    <AsyncTypeahead
                      ref={communitySearchReference}
                      id={communitySearchId}
                      filterBy={() => true}
                      labelKey="name"
                      minLength={minimumCommunitySearchLength}
                      options={communitySearchData}
                      placeholder="Search communities..."
                      isLoading={communitySearchQuery.isFetching}
                      renderMenuItemChildren={(option) => {
                        const community = option as CommunityOption;
                        return (
                          <div>
                            <span>{community.name}</span>
                            <small className="text-muted ms-2">
                              {community.timezone}
                            </small>
                          </div>
                        );
                      }}
                      selected={selectedCommunity ? [selectedCommunity] : []}
                      onInputChange={handleCommunitySearchInput}
                      onSearch={() => undefined}
                      onChange={(selected) => {
                        const option = selected[0] as
                          | CommunityOption
                          | undefined;
                        if (option) {
                          setSelectedCommunity(option);
                          setSelectedGroupId('');
                          setSkip(0);
                        }
                      }}
                    />
                  </div>
                  {selectedCommunity ? (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleClearCommunity}
                    >
                      Clear
                    </Button>
                  ) : undefined}
                </Stack>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Group</Form.Label>
                <Form.Select
                  value={selectedGroupId}
                  disabled={!selectedCommunity}
                  onChange={handleGroupChange}
                >
                  <option value="">All groups</option>
                  {groupsQuery.data?.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <div className="text-muted">
                {logsQuery.data
                  ? `${logsQuery.data.total} logs found`
                  : 'Loading...'}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table className="mb-0">
              <thead>
                <tr>
                  <th style={{width: '200px'}}>Info</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {logsQuery.data?.items.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div>{new Date(log.createdAt).toLocaleString()}</div>
                      <div>
                        {log.user.firstName} {log.user.lastName}
                      </div>
                      <div className="text-muted small">
                        <span
                          role="button"
                          className="text-primary cursor-pointer text-decoration-underline"
                          onClick={() => {
                            setSelectedCommunity(
                              log.community as CommunityOption,
                            );
                            setSelectedGroupId('');
                            setSkip(0);
                          }}
                        >
                          {log.community.name}
                        </span>
                      </div>
                      <div className="text-muted small">
                        <span
                          role="button"
                          className="text-primary cursor-pointer text-decoration-underline"
                          onClick={() => {
                            setSelectedCommunity(
                              log.community as CommunityOption,
                            );
                            setSelectedGroupId(log.group.id);
                            setSkip(0);
                          }}
                        >
                          {log.group.name}
                        </span>
                      </div>
                      <div className="mt-1">
                        <span
                          className={`badge ${
                            log.action === 'action'
                              ? 'bg-success'
                              : log.action === 'refresh'
                                ? 'bg-info'
                                : 'bg-secondary'
                          }`}
                        >
                          {log.action === 'action'
                            ? 'Action'
                            : log.action === 'refresh'
                              ? 'Refresh'
                              : 'None'}
                        </span>
                      </div>
                      <div className="mt-1 small text-muted">
                        <div>In: {log.promptTokens}</div>
                        <div>Out: {log.completionTokens}</div>
                      </div>
                    </td>
                    <td>
                      <div
                        role="button"
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedLogId(log.id);
                        }}
                      >
                        <div className="fw-bold mb-1">{log.title}</div>
                        <Markdown>{log.suggestionText}</Markdown>
                      </div>
                    </td>
                  </tr>
                ))}
                {logsQuery.data?.items.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center text-muted py-4">
                      No logs found
                    </td>
                  </tr>
                ) : undefined}
              </tbody>
            </Table>
          </div>
        </Card.Body>
        <Card.Footer>
          <Stack direction="horizontal" gap={2} className="justify-content-end">
            <Button
              variant="outline-secondary"
              size="sm"
              disabled={skip === 0}
              onClick={() => {
                setSkip(Math.max(0, skip - limit));
              }}
            >
              Previous
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              disabled={!hasMore}
              onClick={() => {
                setSkip(skip + limit);
              }}
            >
              Next
            </Button>
          </Stack>
        </Card.Footer>
      </Card>

      <Modal
        scrollable
        size="xl"
        show={Boolean(selectedLogId)}
        onHide={() => {
          setSelectedLogId(undefined);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>AI Guidance Log Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {logDetailQuery.isLoading ? (
            <p>Loading...</p>
          ) : logDetailQuery.data ? (
            <Stack gap={3}>
              <div>
                <h6>Prompt</h6>
                <pre
                  className="bg-light p-3 rounded"
                  style={{
                    maxHeight: '400px',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                  }}
                >
                  {logDetailQuery.data.prompt}
                </pre>
              </div>
              <div>
                <h6>Response</h6>
                <pre
                  className="bg-light p-3 rounded"
                  style={{
                    maxHeight: '400px',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                  }}
                >
                  {logDetailQuery.data.response}
                </pre>
              </div>
            </Stack>
          ) : undefined}
        </Modal.Body>
      </Modal>
    </Stack>
  );
}
