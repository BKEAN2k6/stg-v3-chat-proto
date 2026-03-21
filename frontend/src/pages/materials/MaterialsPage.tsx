import {useEffect, useState, Fragment} from 'react';
import {Book, List, ChevronDown, ChevronRight} from 'react-bootstrap-icons';
import {Button, Collapse} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import {Link} from 'react-router-dom';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import api from '@client/ApiClient';
import {type ArticleCategoryListItem} from '@client/ApiTypes';
import {useToasts} from '@/components/toasts/index.js';
import PageTitle from '@/components/ui/PageTitle.js';

export default function MaterialsPage() {
  const [categories, setCategories] = useState<ArticleCategoryListItem[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => {
      const savedState = localStorage.getItem('expandedCategories');
      return savedState
        ? new Set(JSON.parse(savedState) as string[])
        : new Set();
    },
  );
  const [isDragEnabled, setIsDragEnabled] = useState(false);
  const toasts = useToasts();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categories = await api.getArticleCategories();
        setCategories(categories);
      } catch {
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while loading the article categories',
        });
      }
    };

    void getCategories();
  }, [toasts]);

  useEffect(() => {
    localStorage.setItem(
      'expandedCategories',
      JSON.stringify([...expandedCategories]),
    );
  }, [expandedCategories]);

  const findCategory = (
    categories: ArticleCategoryListItem[],
    categoryId: string,
  ): ArticleCategoryListItem | undefined => {
    for (const category of categories) {
      if (category.id === categoryId) {
        return category;
      }

      const found = findCategory(category.subCategories, categoryId);
      if (found) {
        return found;
      }
    }

    return undefined;
  };

  const replaceCategory = (
    categories: ArticleCategoryListItem[],
    newCategory: ArticleCategoryListItem,
  ) => {
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].id === newCategory.id) {
        categories[i] = newCategory;
        return;
      }

      replaceCategory(categories[i].subCategories, newCategory);
    }
  };

  const toggleCollapse = (categoryId: string) => {
    setExpandedCategories((previous) => {
      const newSet = new Set(previous);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }

      return newSet;
    });
  };

  const expandAll = () => {
    const allIds = new Set(
      categories.flatMap((category) => getAllCategoryIds(category)),
    );
    setExpandedCategories(allIds);
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  const getAllCategoryIds = (category: ArticleCategoryListItem): string[] => [
    category.id,
    ...category.subCategories.flatMap((subCategory) =>
      getAllCategoryIds(subCategory),
    ),
  ];

  const onDragEnd = async (result: DropResult, categoryId: string) => {
    if (!isDragEnabled) return;

    const {source, destination, type} = result;

    if (!destination || source.index === destination.index) {
      return;
    }

    if (type === 'articles') {
      const category = findCategory(categories, categoryId);
      if (!category) {
        return;
      }

      const newArticles = [...category.articles];
      const [removed] = newArticles.splice(source.index, 1);
      newArticles.splice(destination.index, 0, removed);

      const newCategory = {
        ...category,
        articles: newArticles.map((article, index) => ({
          ...article,
          order: index,
        })),
      };

      const articlesOrder = newCategory.articles.map((article) => article.id);
      const newCategories = [...categories];
      replaceCategory(newCategories, newCategory);
      setCategories([...newCategories]);

      try {
        await api.updateArticlesOrder(articlesOrder);
      } catch {
        setCategories(categories);
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while updating the article order',
        });
      }
    } else if (type === 'categories') {
      const parentCategory = findCategory(categories, categoryId);
      const categoryList = parentCategory
        ? parentCategory.subCategories
        : categories;
      const newCategories = [...categoryList];
      const [removed] = newCategories.splice(source.index, 1);
      newCategories.splice(destination.index, 0, removed);
      let categoriesOrder;

      if (parentCategory) {
        const newCategory = {
          ...parentCategory,
          subCategories: newCategories.map((category, index) => ({
            ...category,
            order: index,
          })),
        };

        categoriesOrder = newCategory.subCategories.map(
          (category) => category.id,
        );

        replaceCategory(categories, newCategory);
        setCategories([...categories]);
      } else {
        const orderedCategories = newCategories.map((category, index) => ({
          ...category,
          order: index,
        }));

        categoriesOrder = newCategories.map((category) => category.id);
        setCategories([...orderedCategories]);
      }

      try {
        await api.updateArticleCategoriesOrder(categoriesOrder);
      } catch {
        setCategories(categories);
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while updating the category order',
        });
      }
    }
  };

  const renderArticles = (
    articles: Array<{
      id: string;
      order: number;
      translations: Array<{
        language: string;
        title: string;
        requiresUpdate: boolean;
      }>;
    }>,
    rootCategoryId: string,
    categoryIndex: number,
  ) => {
    return (
      <Droppable
        droppableId={`category-${categoryIndex}`}
        type="articles"
        isDropDisabled={!isDragEnabled}
      >
        {(provided) => (
          <ul {...provided.droppableProps} ref={provided.innerRef}>
            {articles
              .sort((a, b) => a.order - b.order)
              .map((article, index) => {
                const articleTitle =
                  article.translations.find((t) => t.language === 'en')
                    ?.title ?? article.translations[0].title;
                return (
                  <Draggable
                    key={article.id}
                    draggableId={article.id}
                    index={index}
                    isDragDisabled={!isDragEnabled}
                  >
                    {(provided) => (
                      <li ref={provided.innerRef} {...provided.draggableProps}>
                        <Link
                          to={`/article-categories/${rootCategoryId}/article/${article.id}`}
                        >
                          {articleTitle}
                        </Link>{' '}
                        <div
                          style={{
                            display: 'inline-block',
                          }}
                          {...provided.dragHandleProps}
                        >
                          (
                          {article.translations.map((t, index) => (
                            <Fragment key={t.language}>
                              <span
                                style={{
                                  ...(t.requiresUpdate && {
                                    color: 'var(--bs-danger)',
                                  }),
                                }}
                              >
                                {t.language}
                              </span>
                              {index < article.translations.length - 1 && ', '}
                            </Fragment>
                          ))}
                          ) <Book />
                        </div>
                      </li>
                    )}
                  </Draggable>
                );
              })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    );
  };

  const renderCategories = (
    categories: ArticleCategoryListItem[],
    rootCategoryId: string | undefined = undefined,
    parentCategoryId: string | undefined = undefined,
  ) => {
    return (
      <Droppable
        droppableId={parentCategoryId ?? 'root'}
        type="categories"
        isDropDisabled={!isDragEnabled}
      >
        {(provided) => (
          <ul {...provided.droppableProps} ref={provided.innerRef}>
            {categories
              .sort((a, b) => a.order - b.order)
              .map((category, categoryIndex) => {
                const categoryName =
                  category.translations.find((t) => t.language === 'en')
                    ?.name ?? category.translations[0].name;
                const isExapanded = expandedCategories.has(category.id);

                return (
                  <Draggable
                    key={category.id}
                    draggableId={category.id}
                    index={categoryIndex}
                    isDragDisabled={!isDragEnabled}
                  >
                    {(provided) => (
                      <li ref={provided.innerRef} {...provided.draggableProps}>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="link"
                            className="p-0 me-2"
                            onClick={() => {
                              toggleCollapse(category.id);
                            }}
                          >
                            {isExapanded ? <ChevronDown /> : <ChevronRight />}
                          </Button>
                          <Link
                            to={
                              rootCategoryId
                                ? `/article-categories/${rootCategoryId}/category/${category.id}`
                                : `/article-categories/${category.id}`
                            }
                          >
                            {categoryName}
                          </Link>{' '}
                          <div
                            style={{
                              display: 'inline-block',
                            }}
                            {...provided.dragHandleProps}
                          >
                            <List />
                          </div>
                        </div>
                        <Collapse in={isExapanded}>
                          <div>
                            <DragDropContext
                              onDragEnd={async (result) =>
                                onDragEnd(result, category.id)
                              }
                            >
                              {renderCategories(
                                category.subCategories,
                                rootCategoryId ?? category.id,
                                category.id,
                              )}
                              {renderArticles(
                                category.articles,
                                category.rootCategory,
                                categoryIndex,
                              )}
                            </DragDropContext>
                          </div>
                        </Collapse>
                      </li>
                    )}
                  </Draggable>
                );
              })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    );
  };

  return (
    <div className="d-flex flex-column gap-3">
      <PageTitle title="Articles">
        <div className="d-flex gap-2">
          <LinkContainer to="/articles/new">
            <Button variant="primary">New article</Button>
          </LinkContainer>
          <LinkContainer to="/article-categories/new">
            <Button variant="primary">New category</Button>
          </LinkContainer>
        </div>
      </PageTitle>
      <div>
        <div className="d-flex justify-content-between mb-3">
          <div className="d-flex gap-2">
            <Button variant="secondary" onClick={expandAll}>
              Expand all
            </Button>
            <Button variant="secondary" onClick={collapseAll}>
              Collapse all
            </Button>
            <Button
              variant={isDragEnabled ? 'danger' : 'secondary'}
              onClick={() => {
                setIsDragEnabled((previous) => !previous);
              }}
            >
              {isDragEnabled ? 'Disable dragging' : 'Enable dragging'}
            </Button>
          </div>
        </div>
        <DragDropContext
          onDragEnd={async (result) => onDragEnd(result, 'root')}
        >
          {renderCategories(categories)}
        </DragDropContext>
      </div>
    </div>
  );
}
