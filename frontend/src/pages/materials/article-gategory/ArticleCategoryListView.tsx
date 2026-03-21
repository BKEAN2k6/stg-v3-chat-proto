import {LinkContainer} from 'react-router-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import Button from 'react-bootstrap/Button';
import {
  Clock,
  ChevronUp,
  ChevronDown,
  ChevronRight,
} from 'react-bootstrap-icons';
import {useContext} from 'react';
import {useAccordionButton} from 'react-bootstrap/AccordionButton';
import {type StrengthSlug, type LanguageCode} from '@client/ApiTypes';
import type LocalicedArticleCategory from './LocalicedArticleCategory.js';
import StrengthAvatar from '@/components/ui/StrengthAvatar.js';

type Properties = {
  readonly category: LocalicedArticleCategory;
  readonly languageCode: LanguageCode;
};

function CategoryToggle({eventKey}: {readonly eventKey: string}) {
  const {activeEventKey} = useContext(AccordionContext);
  const decoratedOnClick = useAccordionButton(eventKey);
  const isCurrentEventKey = activeEventKey === eventKey;

  return (
    <Button
      style={{
        width: 40,
        height: 40,
        textAlign: 'center',
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
      }}
      className="rounded-circle border mb-1"
      variant={isCurrentEventKey ? 'primary' : 'light'}
      onClick={decoratedOnClick}
    >
      {isCurrentEventKey ? <ChevronUp /> : <ChevronDown />}
    </Button>
  );
}

function ArticleLinkContainer({
  article,
  languageCode,
  isLast,
  rootCategoryId,
}: {
  readonly article: {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly length: string;
    readonly strengths: StrengthSlug[];
  };
  readonly rootCategoryId: string;
  readonly languageCode: LanguageCode;
  readonly isLast: boolean;
}) {
  return (
    <LinkContainer
      key={article.id}
      style={{cursor: 'pointer'}}
      to={{
        pathname: `/article-categories/${rootCategoryId}/article/${article.id}`,
        search: `?lang=${languageCode}`,
      }}
    >
      <div className="px-3 mb-5">
        <div className="d-flex">
          <div className="flex-grow-1">
            <div>
              <h4>{article.title}</h4>
              <p>{article.description}</p>
            </div>
            <div className="d-flex gap-3">
              <div className="d-flex align-items-center">
                <Clock size={14} />
                <span
                  style={{
                    marginTop: '2px',
                    marginLeft: '4px',
                  }}
                >
                  {article.length}
                </span>
              </div>
              <div>
                {article.strengths.map((strengthSlug) => (
                  <StrengthAvatar
                    key={strengthSlug}
                    strength={strengthSlug}
                    size={22}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="align-self-center">
            <ChevronRight />
          </div>
        </div>
        {!isLast && <hr />}
      </div>
    </LinkContainer>
  );
}

export default function ArticleCategoryListView(properties: Properties) {
  const {category, languageCode} = properties;

  return (
    <div className="px-3">
      {category.articles.map((article, index) => (
        <ArticleLinkContainer
          key={article.id}
          article={article}
          languageCode={languageCode}
          isLast={index === category.articles.length - 1}
          rootCategoryId={category.categoryPath[0].id}
        />
      ))}

      {category.subCategories.length > 0 && (
        <Accordion>
          {category.subCategories.map((subCategory, index) => (
            <div key={subCategory.id} className="mb-4">
              <div style={{display: 'flex'}}>
                <div>
                  <h3>{subCategory.name}</h3>
                  <p>{subCategory.description}</p>
                </div>
                <CategoryToggle eventKey={`${index}`} />
              </div>
              <Accordion.Collapse eventKey={`${index}`}>
                <div>
                  {subCategory.articles.map((article, index) => (
                    <ArticleLinkContainer
                      key={article.id}
                      article={article}
                      languageCode={languageCode}
                      isLast={index === subCategory.articles.length - 1}
                      rootCategoryId={category.categoryPath[0].id}
                    />
                  ))}
                </div>
              </Accordion.Collapse>
              {index < category.subCategories.length - 1 && (
                <hr
                  style={{
                    margin: '0',
                    marginBottom: '1rem',
                  }}
                />
              )}
            </div>
          ))}
        </Accordion>
      )}
    </div>
  );
}
