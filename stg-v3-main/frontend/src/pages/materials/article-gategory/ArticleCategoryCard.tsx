import Card from 'react-bootstrap/Card';
import {LinkContainer} from 'react-router-bootstrap';
import {LockFill} from 'react-bootstrap-icons';
import {type LanguageCode} from '@client/ApiTypes';
import constants from '@/constants.js';

type Properties = {
  readonly id: string;
  readonly rootCategoryId: string;
  readonly name: string;
  readonly thumbnail: string;
  readonly languageCode: LanguageCode;
  readonly isLocked: boolean;
};

export default function ArticleCategoryCard(properties: Properties) {
  const {id, rootCategoryId, name, thumbnail, languageCode, isLocked} =
    properties;

  const CardContent = (
    <Card style={{position: 'relative', zIndex: 0}}>
      <div style={{position: 'relative'}}>
        <Card.Img variant="top" src={`${constants.FILE_HOST}${thumbnail}`} />
        {isLocked ? (
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
        ) : null}
      </div>
      <Card.Body>
        <Card.Title style={{marginBottom: 0}}>{name}</Card.Title>
      </Card.Body>
    </Card>
  );

  return (
    <div
      className="card-w-100 card-w-md-50 card-w-lg-33"
      style={{
        position: 'relative',
        cursor: isLocked ? 'not-allowed' : 'pointer',
      }}
    >
      {isLocked ? (
        <div>{CardContent}</div>
      ) : (
        <LinkContainer
          to={{
            pathname: `/article-categories/${rootCategoryId}/category/${id}`,
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
