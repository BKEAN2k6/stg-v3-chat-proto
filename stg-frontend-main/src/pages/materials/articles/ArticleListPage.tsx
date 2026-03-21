import {useEffect, useState} from 'react';
import {Book, List} from 'react-bootstrap-icons';
import {Button} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import {Link} from 'react-router-dom';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import api from '@/api/ApiClient';
import {type ArticleCategoryListItem} from '@/api/ApiTypes';
import {useToasts} from '@/components/toasts';
import {useTitle} from '@/context/pageTitleContext';

export default function ArticleListPage() {
  const [categories, setCategories] = useState<ArticleCategoryListItem[]>([]);
  const toasts = useToasts();
  const {setTitle} = useTitle();

  useEffect(() => {
    setTitle('Articles');
  }, [setTitle]);

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

  const findCategory = (
    categories: ArticleCategoryListItem[],
    categoryId: string,
  ): ArticleCategoryListItem | undefined => {
    for (const category of categories) {
      if (category._id === categoryId) {
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
      if (categories[i]._id === newCategory._id) {
        categories[i] = newCategory;
        return;
      }

      replaceCategory(categories[i].subCategories, newCategory);
    }
  };

  const onDragEnd = async (result: DropResult, categoryId: string) => {
    const {source, destination, type} = result;

    if (!destination || source.index === destination.index) {
      return;
    }

    if (type === 'articles') {
      const category = findCategory(categories, categoryId);
      if (!category) {
        return;
      }

      const newArticles = Array.from(category.articles);
      const [removed] = newArticles.splice(source.index, 1);
      newArticles.splice(destination.index, 0, removed);

      const newCategory = {
        ...category,
        articles: newArticles.map((article, index) => ({
          ...article,
          order: index,
        })),
      };

      const articlesOrder = newCategory.articles.map((article) => article._id);
      const newCategories = Array.from(categories);
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
      const newCategories = Array.from(categoryList);
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
          (category) => category._id,
        );

        replaceCategory(categories, newCategory);
        setCategories([...categories]);
      } else {
        const orderderedCategories = newCategories.map((category, index) => ({
          ...category,
          order: index,
        }));

        categoriesOrder = newCategories.map((category) => category._id);
        setCategories([...orderderedCategories]);
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
      _id: string;
      order: number;
      translations: Array<{language: string; title: string}>;
    }>,
    rootCategoryId: string,
    categoryIndex: number,
  ) => {
    return (
      <Droppable droppableId={`category-${categoryIndex}`} type="articles">
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
                    key={article._id}
                    draggableId={article._id}
                    index={index}
                  >
                    {(provided) => (
                      <li ref={provided.innerRef} {...provided.draggableProps}>
                        <Link
                          to={`/article-categories/${rootCategoryId}/article/${article._id}`}
                        >
                          {articleTitle}
                        </Link>{' '}
                        <div
                          style={{
                            display: 'inline-block',
                          }}
                          {...provided.dragHandleProps}
                        >
                          <Book />
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
      <Droppable droppableId={parentCategoryId ?? 'root'} type="categories">
        {(provided) => (
          <ul {...provided.droppableProps} ref={provided.innerRef}>
            {categories
              .sort((a, b) => a.order - b.order)
              .map((category, categoryIndex) => {
                const categoryName =
                  category.translations.find((t) => t.language === 'en')
                    ?.name ?? category.translations[0].name;
                return (
                  <Draggable
                    key={category._id}
                    draggableId={category._id}
                    index={categoryIndex}
                  >
                    {(provided) => (
                      <li ref={provided.innerRef} {...provided.draggableProps}>
                        <Link
                          to={
                            rootCategoryId
                              ? `/article-categories/${rootCategoryId}/category/${category._id}`
                              : `/article-categories/${category._id}`
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
                        <DragDropContext
                          onDragEnd={async (result) =>
                            onDragEnd(result, category._id)
                          }
                        >
                          {renderCategories(
                            category.subCategories,
                            rootCategoryId ?? category._id,
                            category._id,
                          )}
                          {renderArticles(
                            category.articles,
                            category.rootCategory,
                            categoryIndex,
                          )}
                        </DragDropContext>
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
    <>
      <div className="d-flex gap-2 justify-content-end">
        <LinkContainer to="/articles/new">
          <Button variant="primary">New Article</Button>
        </LinkContainer>
        <LinkContainer to="/article-categories/new">
          <Button variant="primary">New Category</Button>
        </LinkContainer>
      </div>
      <DragDropContext onDragEnd={async (result) => onDragEnd(result, 'root')}>
        {renderCategories(categories)}
      </DragDropContext>
    </>
  );
}
