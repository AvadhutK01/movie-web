import { useState, memo } from 'react';

const MovieForm = memo(() => {
    const [formData, setFormData] = useState({
        title: '',
        episode_id: '',
        director: '',
        producer: '',
        release_date: '',
        opening_crawl: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('NewMovieObj:', formData);
        // Reset form for premium UX
        setFormData({
            title: '',
            episode_id: '',
            director: '',
            producer: '',
            release_date: '',
            opening_crawl: '',
        });
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
                    <button type="submit" className="submit-btn">
                        Add Movie
                    </button>
                </form>
            </div>
        </section>
    );
});

MovieForm.displayName = 'MovieForm';

export default MovieForm;
