import { useState, memo } from 'react';

const MovieForm = memo(({ onMovieAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        episode_id: '',
        director: '',
        producer: '',
        release_date: '',
        opening_crawl: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
        try {
            const firestoreData = {
                fields: {
                    title: { stringValue: formData.title },
                    episode_id: { integerValue: parseInt(formData.episode_id) },
                    director: { stringValue: formData.director },
                    producer: { stringValue: formData.producer },
                    release_date: { stringValue: formData.release_date },
                    opening_crawl: { stringValue: formData.opening_crawl }
                }
            };

            const response = await fetch(
                'https://firestore.googleapis.com/v1/projects/sh-p-f50d3/databases/(default)/documents/movies',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(firestoreData),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to add movie to Firestore');
            }
            setFormData({
                title: '',
                episode_id: '',
                director: '',
                producer: '',
                release_date: '',
                opening_crawl: '',
            });

            if (onMovieAdded) {
                onMovieAdded();
            }
        } catch (error) {
            alert('Failed to add movie. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="movie-form-section">
            <div className="form-container">
                <h2>🎬 Add New Movie</h2>
                <form onSubmit={handleSubmit} className="movie-add-form">
                    <div className="form-grid">
                        <div className="input-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Star Wars: Title"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="episode_id">Episode ID</label>
                            <input
                                type="number"
                                id="episode_id"
                                name="episode_id"
                                value={formData.episode_id}
                                onChange={handleChange}
                                placeholder="e.g. 7"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="director">Director</label>
                            <input
                                type="text"
                                id="director"
                                name="director"
                                value={formData.director}
                                onChange={handleChange}
                                placeholder="Name"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="producer">Producer</label>
                            <input
                                type="text"
                                id="producer"
                                name="producer"
                                value={formData.producer}
                                onChange={handleChange}
                                placeholder="Names separated by comma"
                                required
                            />
                        </div>
                        <div className="input-group full-width">
                            <label htmlFor="release_date">Release Date</label>
                            <input
                                type="date"
                                id="release_date"
                                name="release_date"
                                value={formData.release_date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group full-width">
                            <label htmlFor="opening_crawl">Opening Crawl</label>
                            <textarea
                                id="opening_crawl"
                                name="opening_crawl"
                                value={formData.opening_crawl}
                                onChange={handleChange}
                                placeholder="It is a period of civil war..."
                                rows="4"
                                required
                            ></textarea>
                        </div>
                    </div>
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Adding...' : 'Add Movie'}
                    </button>
                </form>
            </div>
        </section>
    );
});

MovieForm.displayName = 'MovieForm';

export default MovieForm;
