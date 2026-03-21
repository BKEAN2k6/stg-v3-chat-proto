import {Clock, LockFill} from 'react-bootstrap-icons';
import Card from 'react-bootstrap/Card';
import {LinkContainer} from 'react-router-bootstrap';
import {type StrengthSlug} from '@/api/ApiTypes';
import StrengthAvatar from '@/components/ui/StrengthAvatar';
import constants from '@/constants';

type Props = {
  readonly id: string;
  readonly rootCategoryId: string;
  readonly title: string;
  readonly description: string;
  readonly length: string;
  readonly strengths: StrengthSlug[];
  readonly thumbnail: string;
  readonly languageCode: string;
  readonly isLocked: boolean;
};

export default function ArticleCard(props: Props) {
  const {
    title,
    description,
    length,
    strengths,
    thumbnail,
    id,
    rootCategoryId,
    languageCode,
    isLocked,
  } = props;

  const CardContent = (
    <Card>
      <div style={{position: 'relative'}}>
        <Card.Img variant="top" src={`${constants.FILE_HOST}${thumbnail}`} />
        {isLocked && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(50, 50, 50, 0.3)',
              zIndex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: '0.25rem',
              borderTopRightRadius: '0.25rem',
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '50%',
                padding: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <LockFill size={24} color="black" />
            </div>
          </div>
        )}
      </div>
      <Card.Body style={{flexGrow: 1}}>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between bg-white">
        <div>
          {strengths.map((strengthSlug) => (
            <StrengthAvatar
              key={strengthSlug}
              strength={strengthSlug}
              size={22}
            />
          ))}
        </div>
        <div className="d-flex align-items-center">
          <Clock size={14} />
          <span
            style={{
              marginTop: '2px',
              marginLeft: '4px',
            }}
          >
            {length}
          </span>
        </div>
      </Card.Footer>
    </Card>
  );

  return (
    <div
      style={{
        position: 'relative',
        width: '18rem',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        display: 'flex',
      }}
    >
      {isLocked ? (
        <div style={{flexGrow: 1}}>{CardContent}</div>
      ) : (
        <LinkContainer
          to={{
            pathname: `/article-categories/${rootCategoryId}/article/${id}`,
            search: `?lang=${languageCode}`,
          }}
          style={{flexGrow: 1}}
        >
          {CardContent}
        </LinkContainer>
      )}
    </div>
  );
}
