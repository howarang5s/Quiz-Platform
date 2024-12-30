import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Import CSS

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Load leaderboard from local storage
        const storedScores = JSON.parse(localStorage.getItem('leaderboard')) || [];
        
        // Filter out entries with empty names and sort by score in descending order
        const filteredScores = storedScores.filter(entry => entry.user.trim() !== '');
        const sortedScores = filteredScores.sort((a, b) => b.score - a.score);

        setLeaderboard(sortedScores);
    }, []);

    const getEmoji = (obtainedMarks, totalMarks) => {
        const percentage = (obtainedMarks / totalMarks) * 100;
        if (percentage < 50) {
            return '🤞'; // Better Luck Next Time
        } else if (percentage === 50) {
            return '😐'; // Average
        } else {
            return '🎉'; // Great Job!
        }
    };

    const removeEntry = (index) => {
        // Create a new array without the removed entry
        const updatedLeaderboard = leaderboard.filter((_, i) => i !== index);
        setLeaderboard(updatedLeaderboard);

        // Update local storage
        localStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="leaderboard">
            <button className="back-button" onClick={handleBack}>Back</button>
            <h1>Scoreboard</h1>
            {leaderboard.length === 0 ? (
                <p>No scores available yet.</p>
            ) : (
                <ul>
                    {leaderboard.map((entry, index) => (
                        <li key={index} className="leaderboard-item">
                            <span className="user-name">
                                {entry.user}: {entry.score} / {entry.totalMarks} {getEmoji(entry.score, entry.totalMarks)}
                            </span>
                            <button onClick={() => removeEntry(index)} className="remove-button">Remove</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Leaderboard;
