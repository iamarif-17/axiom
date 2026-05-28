import React from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import InputSection from './components/InputSection'
import PRCard from './components/PRCard'
import LoadingSection from './components/LoadingSection'
import ReviewSection from './components/ReviewSection'
import Footer from './components/Footer'
import { useAnalysis } from './hooks/useAnalysis'

export default function App() {
  const { state, analyze, setError, reset } = useAnalysis()
  const [lastToken, setLastToken] = React.useState('')
  const [lastFocus, setLastFocus] = React.useState('')

  const handleAnalyze = async ({ prUrl, ghToken, focus }) => {
    setLastToken(ghToken)
    setLastFocus(focus)
    try {
      await analyze({ prUrl, ghToken, focus })
      setTimeout(() => {
        document.getElementById('review-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 200)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleReset = () => {
    reset()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showPR      = ['fetching_pr', 'analyzing', 'done'].includes(state.status) && state.pr
  const showLoading = state.status === 'analyzing'
  const showReview  = state.status === 'done' && state.review
  const isLoading   = state.status === 'fetching_pr' || state.status === 'analyzing'

  return (
    <>
      <Nav />
      <Hero />
      <InputSection
        onAnalyze={handleAnalyze}
        loading={isLoading}
        error={state.status === 'error' ? state.error : null}
      />
      {showPR && (
        <PRCard pr={state.pr} files={state.files} />
      )}
      {showLoading && (
        <LoadingSection message={state.loadingMsg} />
      )}
      {showReview && (
        <div id="review-anchor">
          <ReviewSection
            review={state.review}
            pr={state.pr}
            files={state.files}
            owner={state.owner}
            repo={state.repo}
            number={state.number}
            ghToken={lastToken}
            onReset={handleReset}
          />
        </div>
      )}
      <Footer />
    </>
  )
}
