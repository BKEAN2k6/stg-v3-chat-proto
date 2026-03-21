import {useEffect, useMemo, useState} from 'react';
import {
  Button,
  Card,
  Form,
  Row,
  Col,
  Table,
  Stack,
  Modal,
} from 'react-bootstrap';
import {
  type CreateCommunityResponse,
  type GetCommunityResponse,
  type GetCommunitiesQuery,
  type SubscriptionStatus,
} from '@client/ApiTypes';
import {type ApiError} from '@client/ApiClient';
import {type UseQueryResult} from '@tanstack/react-query';
import CreateCommunityModal from './CreateCommunityModal.js';
import {
  formatSubscriptionStatus,
  subscriptionStatusLabels,
  subscriptionStatuses,
} from './billingUtils.js';
import CommunitySettings from '@/pages/community-settings/CommunitySettings.js';
import {useGetCommunitiesQuery, useGetCommunityQuery} from '@/hooks/useApi.js';

const toIsoDate = (value: string, setToEndOfDay?: boolean) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  if (setToEndOfDay) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }

  return date.toISOString();
};

type CommunitiesTabProperties = {
  readonly selectedCommunityId: string | undefined;
  readonly onSelectCommunity: (id: string | undefined) => void;
};

export function CommunitiesTab({
  selectedCommunityId,
  onSelectCommunity,
}: CommunitiesTabProperties) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | ''>('');
  const [statusValidUntilFrom, setStatusValidUntilFrom] = useState('');
  const [statusValidUntilTo, setStatusValidUntilTo] = useState('');
  const [skip, setSkip] = useState(0);
  const pageSize = 10;
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const communityQueryParameters: GetCommunitiesQuery = useMemo(() => {
    const query: GetCommunitiesQuery = {
      limit: pageSize.toString(),
      skip: skip.toString(),
    };

    if (debouncedSearchTerm) query.search = debouncedSearchTerm;
    if (statusFilter) query.status = statusFilter;

    const validUntilFromIso = toIsoDate(statusValidUntilFrom);
    if (validUntilFromIso) query.statusValidUntilFrom = validUntilFromIso;
    const validUntilToIso = toIsoDate(statusValidUntilTo, true);
    if (validUntilToIso) query.statusValidUntilTo = validUntilToIso;

    return query;
  }, [
    debouncedSearchTerm,
    statusValidUntilFrom,
    statusValidUntilTo,
    pageSize,
    skip,
    statusFilter,
  ]);

  const communitiesQuery = useGetCommunitiesQuery(communityQueryParameters, {
    enabled: true,
  });
  const communities = communitiesQuery.data ?? [];
  const isCommunitySearchLoading = communitiesQuery.isFetching;
  const hasMore = communities.length === pageSize;

  const selectedCommunityQuery = useGetCommunityQuery(
    {id: selectedCommunityId ?? ''},
    {enabled: Boolean(selectedCommunityId)},
  ) as UseQueryResult<GetCommunityResponse | undefined, ApiError>;
  const selectedCommunity = selectedCommunityQuery.data;

  const onCommunityCreate = (_community: CreateCommunityResponse) => {
    setSkip(0);
    setSearchTerm('');
  };

  useEffect(() => {
    setSkip(0);
  }, [
    debouncedSearchTerm,
    statusFilter,
    statusValidUntilFrom,
    statusValidUntilTo,
  ]);

  const handleSearchSubmit = async (
    event?: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event?.preventDefault();
    setSkip(0);
  };

  const goToPreviousPage = async () => {
    const nextSkip = Math.max(skip - pageSize, 0);
    setSkip(nextSkip);
  };

  const goToNextPage = async () => {
    const nextSkip = skip + pageSize;
    setSkip(nextSkip);
  };

  return (
    <Stack gap={3}>
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-semibold">Search communities</span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setShowModal(true);
              }}
            >
              Create
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Form
            onSubmit={(event) => {
              void handleSearchSubmit(event);
            }}
          >
            <Row className="gy-2">
              <Col md={3}>
                <Form.Control
                  placeholder="Search by name"
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                  }}
                />
              </Col>
              <Col md={2}>
                <Form.Select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(
                      (event.target.value as SubscriptionStatus) || '',
                    );
                  }}
                >
                  <option value="">Any status</option>
                  {subscriptionStatuses.map((status) => (
                    <option key={status} value={status}>
                      {subscriptionStatusLabels[status]}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Control
                  type="date"
                  value={statusValidUntilFrom}
                  onChange={(event) => {
                    setStatusValidUntilFrom(event.target.value);
                  }}
                />
              </Col>
              <Col md={2}>
                <Form.Control
                  type="date"
                  value={statusValidUntilTo}
                  onChange={(event) => {
                    setStatusValidUntilTo(event.target.value);
                  }}
                />
              </Col>
              <Col md={3} className="d-flex gap-2 justify-content-end">
                <Button type="submit" disabled={isCommunitySearchLoading}>
                  {isCommunitySearchLoading ? 'Searching…' : 'Search'}
                </Button>
                <Button
                  variant="outline-secondary"
                  disabled={isCommunitySearchLoading}
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('');
                    setStatusValidUntilFrom('');
                    setStatusValidUntilTo('');
                    setSkip(0);
                  }}
                >
                  Clear
                </Button>
              </Col>
            </Row>
          </Form>

          <div className="table-responsive mt-3">
            <Table hover responsive size="sm" className="mb-0">
              <thead>
                <tr>
                  <th>Community</th>
                  <th>Status valid until</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {communities.map((community) => {
                  const statusValidUntilDate =
                    typeof community.subscriptionStatusValidUntil === 'string'
                      ? new Date(String(community.subscriptionStatusValidUntil))
                      : undefined;
                  const statusValidUntil = statusValidUntilDate
                    ? statusValidUntilDate.toLocaleDateString()
                    : 'Not set';
                  const subscriptionStatusLabel = formatSubscriptionStatus(
                    community.subscriptionStatus,
                  );
                  return (
                    <tr
                      key={community.id}
                      className="table-row-link"
                      role="button"
                      onClick={() => {
                        onSelectCommunity(community.id);
                      }}
                    >
                      <td className="align-middle">{community.name}</td>
                      <td className="align-middle">{statusValidUntil}</td>
                      <td className="align-middle">
                        {subscriptionStatusLabel}
                      </td>
                    </tr>
                  );
                })}
                {communities.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-muted">
                      {isCommunitySearchLoading
                        ? 'Searching…'
                        : 'No communities found.'}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </Table>
          </div>
          <Stack
            direction="horizontal"
            gap={2}
            className="justify-content-end mt-2"
          >
            <Button
              variant="outline-secondary"
              size="sm"
              disabled={isCommunitySearchLoading || skip === 0}
              onClick={() => {
                void goToPreviousPage();
              }}
            >
              Previous
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              disabled={isCommunitySearchLoading || !hasMore}
              onClick={() => {
                void goToNextPage();
              }}
            >
              Next
            </Button>
            <span className="text-muted small">
              Page {Math.floor(skip / pageSize) + 1}
            </span>
          </Stack>
        </Card.Body>
      </Card>

      <Modal
        scrollable
        show={selectedCommunity !== undefined}
        size="xl"
        onHide={() => {
          onSelectCommunity(undefined);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCommunity?.name ?? 'Community settings'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCommunity ? (
            <CommunitySettings
              communityId={selectedCommunity.id}
              initialCommunity={selectedCommunity}
              isPageTitleUpdateEnabled={false}
            />
          ) : null}
        </Modal.Body>
      </Modal>

      <CreateCommunityModal
        isOpen={showModal}
        handleClose={() => {
          setShowModal(false);
        }}
        onCommunityCreate={onCommunityCreate}
      />
    </Stack>
  );
}
