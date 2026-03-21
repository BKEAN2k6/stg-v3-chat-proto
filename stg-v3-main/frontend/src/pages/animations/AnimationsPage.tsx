import {type GetAnimationsResponse} from '@client/ApiTypes';
import {useEffect, useState, useCallback, useMemo} from 'react';
import {Table, Button} from 'react-bootstrap';
import {useNavigate, Link} from 'react-router-dom';
import {Upload, Trash} from 'react-bootstrap-icons';
import PageTitle from '@/components/ui/PageTitle.js';

type SortKey = keyof GetAnimationsResponse[0];
type SortDirection = 'asc' | 'desc';

export default function AnimationsPage() {
  const navigate = useNavigate();
  const [animations, setAnimations] = useState<GetAnimationsResponse>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  }>({
    key: 'name',
    direction: 'asc',
  });

  const fetchAnimations = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/animations');
      if (!response.ok) {
        throw new Error(
          `Failed to fetch animations: ${response.statusText} (${response.status})`,
        );
      }

      const data = (await response.json()) as GetAnimationsResponse;
      setAnimations(data);
    } catch (error_) {
      console.error('Error fetching animations:', error_);
    }
  }, []);

  useEffect(() => {
    void fetchAnimations();
  }, [fetchAnimations]);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/v1/animations/${id}`, {
        method: 'DELETE',
      });
      setAnimations((previousAnimations) =>
        previousAnimations.filter((animation) => animation.id !== id),
      );
    } catch (error_) {
      console.error('Error deleting animation:', error_);
    }
  };

  const requestSort = (key: SortKey) => {
    setSortConfig((previous) => {
      const direction =
        previous.key === key && previous.direction === 'asc' ? 'desc' : 'asc';
      return {key, direction};
    });
  };

  const sortedAnimations = useMemo(() => {
    const sortable = [...animations];
    sortable.sort((a, b) => {
      const {key, direction} = sortConfig;
      const aValue: any = a[key];
      const bValue: any = b[key];

      // string
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // date
      if (key === 'updatedAt') {
        return direction === 'asc'
          ? new Date(aValue as string).getTime() -
              new Date(bValue as string).getTime()
          : new Date(bValue as string).getTime() -
              new Date(aValue as string).getTime();
      }

      // boolean
      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return direction === 'asc'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      return 0;
    });
    return sortable;
  }, [animations, sortConfig]);

  return (
    <>
      <PageTitle title="Animations">
        <Button
          variant="primary"
          onClick={() => {
            navigate('/animations/upload');
          }}
        >
          <Upload className="me-2" /> Upload Animation
        </Button>
      </PageTitle>

      {sortedAnimations.length > 0 && (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              {[
                {label: 'Name', key: 'name'},
                {label: 'Updated By', key: 'updatedBy'},
                {label: 'Updated At', key: 'updatedAt'},
                {label: 'Checked', key: 'isChecked'},
              ].map(({label, key}) => {
                const isActive = sortConfig.key === key;
                const arrow = isActive
                  ? sortConfig.direction === 'asc'
                    ? ' ▲'
                    : ' ▼'
                  : '';
                return (
                  <th
                    key={key}
                    role="button"
                    className="text-nowrap"
                    onClick={() => {
                      requestSort(key as SortKey);
                    }}
                  >
                    {label}
                    {arrow}
                  </th>
                );
              })}
              <th style={{width: '170px'}} className="text-center align-middle">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAnimations.map((animation) => (
              <tr key={animation.id}>
                <td>
                  <Link to={`/animations/${animation.id}`}>
                    {animation.name}
                  </Link>
                </td>
                <td>
                  {animation.updatedBy.firstName} {animation.updatedBy.lastName}
                </td>
                <td>
                  {new Date(animation.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td>
                  {animation.isChecked ? (
                    <span className="text-success">Yes</span>
                  ) : (
                    <span className="text-danger">No</span>
                  )}
                </td>
                <td>
                  <div className="d-flex justify-content-center align-items-center gap-1">
                    <Button
                      variant="danger"
                      size="sm"
                      title="Delete Animation"
                      className="d-flex align-items-center"
                      onClick={(event) => {
                        event.stopPropagation();
                        void handleDelete(animation.id);
                      }}
                    >
                      <Trash />
                      <span className="d-none d-md-inline ms-1">Delete</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
