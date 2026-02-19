import { useState, useEffect, useRef } from 'react'
import MovieForm from './components/MovieForm'
import './App.css'

function App() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const retryTimeoutRef = useRef(null)

  useEffect(() => {
    fetchMovies()
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [])

  const fetchMovies = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://firestore.googleapis.com/v1/projects/sh-p-f50d3/databases/(default)/documents/movies')
      if (!response.ok) {
        throw new Error('Failed to fetch movies')
      }
      const data = await response.json()

      const mappedMovies = (data.documents || []).map(doc => {
        const f = doc.fields
        return {
          id: doc.name.split('/').pop(),
          url: doc.name,
          title: f.title?.stringValue || 'Unknown Title',
          episode_id: f.episode_id?.integerValue || f.episode_id?.stringValue || '?',
          director: f.director?.stringValue || 'Unknown',
          producer: f.producer?.stringValue || 'Unknown',
          release_date: f.release_date?.stringValue || '',
          opening_crawl: f.opening_crawl?.stringValue || '',
        }
      })

      const sortedMovies = mappedMovies.sort((a, b) => {
        const idA = parseInt(a.episode_id) || 0
        const idB = parseInt(b.episode_id) || 0
        return idA - idB
      })

      setMovies(sortedMovies)
      setError(null)
      setIsRetrying(false)
    } catch (err) {
      setError('Something went wrong ....Retrying')
      setIsRetrying(true)
      retryTimeoutRef.current = setTimeout(() => {
        fetchMovies()
      }, 5000)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelRetry = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }
    setIsRetrying(false)
    setError('Something went wrong')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading Star Wars Films...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          {isRetrying ? (
            <button onClick={handleCancelRetry} className="retry-btn" style={{ backgroundColor: '#ff4444' }}>
              Cancel Retry
            </button>
          ) : (
            <button onClick={fetchMovies} className="retry-btn">
              Retry
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="title">
            <span className="star-icon">⭐</span>
            Star Wars Films
            <span className="star-icon">⭐</span>
          </h1>
          <p className="subtitle">Explore the complete saga from a galaxy far, far away</p>
        </div>
      </header>

      <main className="main-content">
        <MovieForm onMovieAdded={fetchMovies} />
        <div className="movies-grid">
          {movies.map((movie) => (
            <article key={movie.url} className="movie-card">
              <div className="movie-header">
                <div className="episode-badge">Episode {movie.episode_id}</div>
                <h2 className="movie-title">{movie.title}</h2>
              </div>

              <div className="movie-info">
                <div className="info-row">
                  <span className="info-label">Director</span>
                  <span className="info-value">{movie.director}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Producer</span>
                  <span className="info-value">{movie.producer}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Release Date</span>
                  <span className="info-value">{formatDate(movie.release_date)}</span>
                </div>
              </div>

              <div className="opening-crawl">
                <p>{movie.opening_crawl}</p>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 Movie web Films. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
