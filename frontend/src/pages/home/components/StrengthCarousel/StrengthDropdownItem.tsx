import {useState} from 'react';
import {Gear} from 'react-bootstrap-icons';
import Collapse from 'react-bootstrap/Collapse';
import {Trans} from '@lingui/react/macro';
import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import api, {type ApiError} from '@client/ApiClient.js';
import {
  type LanguageCode,
  type ArticleChapter,
  type RemoveGroupArticleProgressParameters,
} from '@client/ApiTypes.js';
import {type CompletedArticles} from '@shared/timelineProgress.js';
import {useCreateGroupArticleProgressMutation} from '@/hooks/useApi.js';
import {useActiveGroup} from '@/context/activeGroupContext.js';
import {slugToListItem} from '@/helpers/strengths.js';

export const useDeleteGroupArticleProgressMutation = (
  options?: UseMutationOptions<
    void,
    ApiError,
    {pathParameters: RemoveGroupArticleProgressParameters}
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    ApiError,
    {pathParameters: RemoveGroupArticleProgressParameters}
  >({
    async mutationFn({pathParameters}) {
      return api.removeGroupArticleProgress(pathParameters);
    },

    async onSuccess(_result, {pathParameters}) {
      const parentId = pathParameters.id;
      const removedArticleId = pathParameters.article;
      if (!parentId || !removedArticleId) {
        return;
      }

      // 1) Update group detail cache
      queryClient.setQueryData(
        ['group', 'detail', {id: parentId}],
        (oldData) => {
          if (!oldData || typeof oldData !== 'object') return oldData;

          type Progress = {article: string; completionDate: string};
          const detail = oldData as {articleProgress?: Progress[]};
          const filtered = (detail.articleProgress ?? []).filter(
            (item) => item.article !== removedArticleId,
          );
          const newDetail = {...detail, articleProgress: filtered};
          return newDetail;
        },
      );

      // 2) Update any group-list caches
      const listQueries = queryClient.getQueriesData({
        queryKey: ['group', 'list'],
      });
      for (const [key, data] of listQueries) {
        if (!Array.isArray(data)) {
          continue;
        }

        type Item = {
          id: string;
          articleProgress?: Array<{article: string; completionDate: string}>;
        };
        const updatedList = (data as Item[]).map((item) => {
          if (item.id !== parentId) return item;
          const newArticleProgress = (item.articleProgress ?? []).filter(
            (ap) => ap.article !== removedArticleId,
          );
          const updatedItem = {...item, articleProgress: newArticleProgress};
          return updatedItem;
        });

        queryClient.setQueryData(key, updatedList);
      }

      await queryClient.invalidateQueries({queryKey: ['groupStats']});
    },

    ...options,
  });
};

type Properties = {
  readonly articles: CompletedArticles;
  readonly onClick: () => void;
  readonly isSelected: boolean;
  readonly language: LanguageCode;
};

export default function StrengthDropdownItem({
  articles,
  onClick,
  language,
  isSelected,
}: Properties) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const createProgress = useCreateGroupArticleProgressMutation();
  const removeProgress = useDeleteGroupArticleProgressMutation();
  const {activeGroup} = useActiveGroup();

  const completedCount = Object.values(articles.articles).filter(
    (article) => article.status === 'read',
  ).length;
  const totalCount = Object.values(articles.articles).length;
  const collapseId = `settings-collapse-${articles.strength}`;
  const {imageUrl, title, color} = slugToListItem(articles.strength, language);

  return (
    <div
      className="position-relative py-2 px-2 rounded border flex-shrink-0"
      style={{backgroundColor: isSelected ? '#f0f0f0' : 'transparent'}}
      role="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <div className="d-flex align-items-center">
        <img
          src={imageUrl}
          alt={title}
          className="rounded-circle me-3"
          style={{
            width: '50px',
            height: '50px',
            objectFit: 'cover',
            backgroundColor: color,
          }}
        />
        <div className="flex-grow-1">
          <h6 className="mb-0">{title}</h6>
          <p className="mb-0 mt-1">
            <Trans>Articles read</Trans> {completedCount}/{totalCount}
          </p>
        </div>
        <button
          type="button"
          className="bg-transparent border-0"
          style={{cursor: 'pointer'}}
          aria-controls={collapseId}
          aria-expanded={open}
          onClick={(event) => {
            event.stopPropagation();
            setOpen((previous) => !previous);
          }}
        >
          <Gear />
        </button>
      </div>

      <Collapse in={open}>
        <div id={collapseId} className="mt-2 ms-1">
          {Object.keys(articles.articles).map((key) => {
            const article = articles.articles[key as ArticleChapter];

            if (!article) return null;
            return (
              <div key={key} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`checkbox-${article.id}`}
                  checked={article.status === 'read'}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  onChange={(event) => {
                    if (!activeGroup) return;

                    if (event.target.checked) {
                      createProgress.mutate(
                        {
                          pathParameters: {id: activeGroup.id},
                          payload: {article: article.id, isSkipped: true},
                        },
                        {
                          async onSuccess() {
                            await queryClient.invalidateQueries({
                              queryKey: ['groupStats'],
                            });
                          },
                        },
                      );
                    } else {
                      removeProgress.mutate({
                        pathParameters: {
                          id: activeGroup.id,
                          article: article.id,
                        },
                      });
                    }
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor={`checkbox-${article.id}`}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
              </div>
            );
          })}
        </div>
      </Collapse>
    </div>
  );
}
