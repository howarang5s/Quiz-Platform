import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Import your CSS file

const Home = () => {
    const [amount, setAmount] = useState(10); // Default number of questions
    const [difficulty, setDifficulty] = useState('easy'); // Default difficulty
    const [category, setCategory] = useState('Linux'); // Default category
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    // Manual categories as per API docs
    const categories = [
        { id: 'Linux', name: 'Linux' },
        { id: 'DevOps', name: 'DevOps' },        
        { id: 'Docker', name: 'Docker' },
        // { id: 'BASH', name: 'BASH'},
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        // Reset error state
        setError(null);

        // Save the number of questions in local storage
        localStorage.setItem('numberOfQuestions', amount);

        // Generate the API URL based on user input
        const apiUrl = `https://quizapi.io/api/v1/questions?&apiKey=HtyhosUVtnrclH1f7Yine4Yf8V7QcqPA4S9sjxKf&limit=${amount}&difficulty=${difficulty}&category=${category}`; // Add your API key here

        // Validate the API URL
        if (!isValidUrl(apiUrl)) {
            setError('Invalid URL generated. Please check your input.');
            return;
        }

        // Navigate to the Quiz component with the generated URL in state
        navigate('/quiz', { state: { apiUrl } });
    };

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    };

    return (
        <div className="home-container">
            <h1>Customize Your Quiz</h1>
            <div className="card"> {/* Card wrapper */}
                <form onSubmit={handleSubmit}>
                    <label>
                        Number of Questions:
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="1"
                            max="50"
                            required
                        />
                    </label>
                    <label>
                        Difficulty:
                        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </label>
                    <label>
                        Category:
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </label>
                    <button type="submit">Start Quiz</button>
                </form>
                {error && <div className="error-message">{error}</div>} {/* Display error message */}
            </div>
        </div>
    );
};

export default Home;
