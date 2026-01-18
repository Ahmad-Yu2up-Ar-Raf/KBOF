import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import {
  addArticle,
  deleteArticle,
  deleteBulkArticles,
  updateArticle,
  updateBulkArticleStatus,
} from '@/lib/server/article/article-server-actions'

// ============================================
// ARTICLE MUTATIONS HOOK
// ============================================

export function useAddArticleMutation() {
  const queryClient = useQueryClient()
  const addArticleFn = useServerFn(addArticle)

  return useMutation({
    mutationFn: addArticleFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}

export function useUpdateArticleMutation() {
  const queryClient = useQueryClient()
  const updateArticleFn = useServerFn(updateArticle)

  return useMutation({
    mutationFn: updateArticleFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}

export function useDeleteArticleMutation() {
  const queryClient = useQueryClient()
  const deleteArticleFn = useServerFn(deleteArticle)

  return useMutation({
    mutationFn: deleteArticleFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}

export function useBulkUpdateArticleStatusMutation() {
  const queryClient = useQueryClient()
  const bulkUpdateFn = useServerFn(updateBulkArticleStatus)

  return useMutation({
    mutationFn: bulkUpdateFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}

export function useBulkDeleteArticlesMutation() {
  const queryClient = useQueryClient()
  const bulkDeleteFn = useServerFn(deleteBulkArticles)

  return useMutation({
    mutationFn: bulkDeleteFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}
