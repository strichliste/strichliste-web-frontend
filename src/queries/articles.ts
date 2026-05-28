import { useMutation, useQuery } from '@tanstack/react-query';

import { get, post, restDelete } from '../services/api';
import { MaybeResponse, throwOnBodyError } from '../services/error-handler';
import { queryClient } from '../services/query-client';
import { Article, Tag } from '../types/article';
import { queryKeys } from './keys';

export type { Article, Barcode, Tag } from '../types/article';

type ArticleResult = MaybeResponse & { article: Article };
type ArticlesResult = MaybeResponse & { articles: Article[] };

export interface AddArticleParams {
  name: string;
  amount: number;
  isActive: boolean;
  precursor: Article | undefined;
}

const byName = (a: Article, b: Article) => a.name.localeCompare(b.name);

// --- Queries -------------------------------------------------------------

export function useArticles(isActive: boolean): Article[] {
  const { data } = useQuery({
    queryKey: queryKeys.articles(isActive),
    queryFn: async ({ signal }): Promise<Article[]> => {
      const params = new URLSearchParams({
        limit: '999',
        active: String(isActive),
        ancestor: 'false',
      });
      const res = await get<ArticlesResult>(`article?${params.toString()}`, {
        signal,
      });
      return (res.articles ?? []).slice().sort(byName);
    },
    meta: { defaultError: 'ARTICLES_COULD_NOT_BE_LOADED' },
  });
  return data ?? [];
}

/** Active articles sorted by usage. */
export function usePopularArticles(): Article[] {
  return useArticles(true)
    .filter((article) => article.isActive)
    .slice()
    .sort((a, b) => b.usageCount - a.usageCount);
}

export function useTags(): Tag[] {
  const { data } = useQuery({
    queryKey: queryKeys.tags,
    queryFn: ({ signal }): Promise<Tag[]> =>
      get<{ tags: Tag[] }>('tag', { signal }).then((res) => res.tags),
    meta: { defaultError: 'TAGS_COULD_NOT_BE_LOADED' },
  });
  return data ?? [];
}

export function useArticle(id: number | undefined): Article | undefined {
  const { data } = useQuery({
    queryKey: queryKeys.article(id ?? 0),
    queryFn: ({ signal }): Promise<Article> =>
      get<{ article: Article }>(`article/${id}?depth=10`, { signal }).then(
        (res) => res.article
      ),
    enabled: Boolean(id),
    meta: { defaultError: 'ARTICLES_COULD_NOT_BE_LOADED' },
  });
  return data;
}

// --- Mutations -----------------------------------------------------------

function invalidateArticles() {
  queryClient.invalidateQueries({ queryKey: ['articles'] });
  queryClient.invalidateQueries({ queryKey: ['article'] });
}

async function addArticle(article: AddArticleParams): Promise<Article> {
  const url = article.precursor ? `article/${article.precursor.id}` : 'article';
  const res = throwOnBodyError(await post<ArticleResult>(url, article));
  invalidateArticles();
  return res.article;
}

async function deleteArticle(articleId: number): Promise<Article> {
  const res = throwOnBodyError(
    await restDelete<ArticleResult>(`article/${articleId}`)
  );
  invalidateArticles();
  return res.article;
}

async function addBarcode(id: number, barcode: string): Promise<Article> {
  const res = throwOnBodyError(
    await post<ArticleResult>(`article/${id}/barcode`, { barcode })
  );
  invalidateArticles();
  return res.article;
}

async function deleteBarcode(
  articleId: number,
  barcodeId: number
): Promise<Article> {
  const res = throwOnBodyError(
    await restDelete<ArticleResult>(
      `article/${articleId}/barcode/${barcodeId}`
    )
  );
  invalidateArticles();
  return res.article;
}

async function addTag(id: number, tag: string): Promise<Article> {
  const res = throwOnBodyError(
    await post<ArticleResult>(`article/${id}/tag`, { tag })
  );
  invalidateArticles();
  return res.article;
}

async function deleteTag(
  articleId: number,
  tagId: number
): Promise<Article> {
  const res = throwOnBodyError(
    await restDelete<ArticleResult>(`article/${articleId}/tag/${tagId}`)
  );
  invalidateArticles();
  return res.article;
}

export async function fetchArticleByBarcode(
  barcode: string,
  signal?: AbortSignal
): Promise<Article> {
  const params = new URLSearchParams({ barcode });
  const res = throwOnBodyError(
    await get<ArticlesResult>(`article/search?${params.toString()}`, { signal })
  );
  if (res.articles?.length) {
    return res.articles[0];
  }
  throw new Error('no articles are matching the barcode');
}

// --- Mutation hooks ------------------------------------------------------

export function useAddArticle() {
  return useMutation({
    mutationFn: (article: AddArticleParams) => addArticle(article),
    meta: { defaultError: 'ARTICLE_COULD_NOT_BE_CREATED' },
  });
}

export function useDeleteArticle() {
  return useMutation({
    mutationFn: (articleId: number) => deleteArticle(articleId),
    meta: { defaultError: 'ARTICLES_COULD_NOT_BE_DELETED' },
  });
}

export function useAddBarcode() {
  return useMutation({
    mutationFn: ({ id, barcode }: { id: number; barcode: string }) =>
      addBarcode(id, barcode),
    meta: {
      defaultError: 'ARTICLE_BARCODE_COULD_NOT_BE_ADDED',
      errors: {
        ArticleBarcodeAlreadyExistsException: 'ARTICLE_BARCODE_ALREADY_EXISTS',
      },
    },
  });
}

export function useDeleteBarcode() {
  return useMutation({
    mutationFn: ({
      articleId,
      barcodeId,
    }: {
      articleId: number;
      barcodeId: number;
    }) => deleteBarcode(articleId, barcodeId),
    meta: { defaultError: 'ARTICLE_BARCODE_COULD_NOT_BE_DELETED' },
  });
}

export function useAddTag() {
  return useMutation({
    mutationFn: ({ id, tag }: { id: number; tag: string }) => addTag(id, tag),
    meta: {
      defaultError: 'ARTICLE_TAG_COULD_NOT_BE_ADDED',
      errors: {
        ArticleTagAlreadyExistsException: 'ARTICLE_TAG_ALREADY_EXISTS',
      },
    },
  });
}

export function useDeleteTag() {
  return useMutation({
    mutationFn: ({
      articleId,
      tagId,
    }: {
      articleId: number;
      tagId: number;
    }) => deleteTag(articleId, tagId),
    meta: { defaultError: 'ARTICLE_TAG_COULD_NOT_BE_DELETED' },
  });
}

// --- Pure helpers --------------------------------------------------------

export const getArticleHistory = (article: Article): Article[] => {
  const next = article.precursor;
  if (!next) {
    return [];
  }
  return [next, ...getArticleHistory(next)];
};
