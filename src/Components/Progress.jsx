import React, { useEffect, useState } from 'react';
import '../App.css'; // Import CSS

function Progress() {
    const [progress, setProgress] = useState([]);

    useEffect(() => {
        // Retrieve stored progress from localStorage
        const storedProgress = localStorage.getItem('quizProgress');
        if (storedProgress) {
            setProgress(JSON.parse(storedProgress));
        }
    }, []);

    // Calculate total quizzes and total score
    const totalQuizzes = progress.length;
    const totalScore = progress.reduce((acc, curr) => acc + curr.score, 0);
    const maxScore = totalQuizzes * 10; // Assuming each quiz has a maximum score of 10

    return (
        <div className="progress">
            <h2>Your Quiz Progress</h2>
            <div className="progress-summary">
                <p>Total Quizzes Completed: {totalQuizzes}</p>
                <p>Total Score: {totalScore} / {maxScore}</p>
                <div className="progress-bar">
                    <div style={{ width: `${(totalScore / maxScore) * 100}%` }} className="progress-bar-fill" />
                </div>
            </div>
            <ul>
                {progress.length > 0 ? (
                    progress.map(result => (
                        <li key={result.quizId}>
                            {result.quizTitle}: {result.score}
                        </li>
                    ))
                ) : (
                    <li>No progress recorded.</li>
                )}
            </ul>
        </div>
    );
}

export default Progress;
