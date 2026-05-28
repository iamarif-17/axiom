import { useState, useCallback } from 'react'
import { parsePrUrl, fetchPR, fetchPRFiles } from '../utils/github'
import { requestReview } from '../utils/review'

const LOADING_MSGS = [
  'Reading the diff with care...',
  'Checking for edge cases...',
  'Scanning for security vulnerabilities...',
  'Identifying performance bottlenecks...',
  'Reviewing best practices...',
  'Composing the verdict...'
]

export function useAnalysis() {
  const [state, setState] = useState({
    status: 'idle', // idle | fetching_pr | analyzing | done | error
    pr: null,
    files: null,
    review: null,
    error: null,
    loadingMsg: '',
    owner: '',
    repo: '',
    number: 0
  })

  const analyze = useCallback(async ({ prUrl, ghToken, focus }) => {
    const parsed = parsePrUrl(prUrl)
    if (!parsed) throw new Error('Invalid URL. Expected: https://github.com/owner/repo/pull/123')

    const { owner, repo, number } = parsed

    // Step 1: Fetch PR
    setState(s => ({ ...s, status: 'fetching_pr', error: null, owner, repo, number }))

    const [pr, files] = await Promise.all([
      fetchPR(owner, repo, number, ghToken),
      fetchPRFiles(owner, repo, number, ghToken)
    ])

    setState(s => ({ ...s, pr, files, status: 'analyzing', loadingMsg: LOADING_MSGS[0] }))

    // Cycle loading messages
    let msgIdx = 0
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MSGS.length
      setState(s => ({ ...s, loadingMsg: LOADING_MSGS[msgIdx] }))
    }, 2000)

    try {
      // Step 2: AI Review
      const review = await requestReview({ owner, repo, number, token: ghToken, focus })
      clearInterval(msgInterval)
      setState(s => ({ ...s, status: 'done', review }))
    } catch (err) {
      clearInterval(msgInterval)
      throw err
    }
  }, [])

  const setError = useCallback((msg) => {
    setState(s => ({ ...s, status: 'error', error: msg }))
  }, [])

  const reset = useCallback(() => {
    setState({ status: 'idle', pr: null, files: null, review: null, error: null, loadingMsg: '', owner: '', repo: '', number: 0 })
  }, [])

  return { state, analyze, setError, reset }
}
