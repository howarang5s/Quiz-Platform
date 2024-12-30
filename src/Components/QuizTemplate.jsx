import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiClock } from 'react-icons/fi';
import '../App.css';

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 2000;

function Quiz() {
    const location = useLocation();
    const [quiz, setQuiz] = useState([]);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState('');
    const [answers, setAnswers] = useState({});
    const [skippedQuestions, setSkippedQuestions] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [showAnswerSheet, setShowAnswerSheet] = useState(false);
    const [score, setScore] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [notification, setNotification] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!submitted && location.state && location.state.apiUrl) {
            fetchQuiz(location.state.apiUrl);
        }
    }, [submitted, location.state]);

    useEffect(() => {
        if (quiz.length > 0) {
            const totalTimeInMinutes = quiz.length; // Set total time in minutes
            setTimeLeft(totalTimeInMinutes * 60);
        }
    }, [quiz]);

    useEffect(() => {
        if (timeLeft > 0 && !submitted) {
            const timerId = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timerId);
        } else if (timeLeft === 0) {
            handleSubmit();
        }
    }, [timeLeft, submitted]);

    const fetchQuiz = async (apiUrl, retries = MAX_RETRIES, delay = INITIAL_RETRY_DELAY) => {
        try {
            console.log("Fetching quiz from API:", apiUrl);
            const response = await axios.get(apiUrl);
            console.log("API Response:", response.data);

            if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
                throw new Error('No data returned from the API.');
            }

            console.log("Fetched quiz data:", response.data);
            setQuiz(response.data);
        } catch (error) {
            if (error.response) {
                console.error('Error fetching quiz:', error.response.data);
            } else {
                console.error('Error fetching quiz:', error);
            }
            setError('Failed to load quiz. Please try again later.');
        }
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else if (skippedQuestions.length > 0) {
            setCurrentQuestionIndex(skippedQuestions[0]);
            setSkippedQuestions((prev) => prev.slice(1));
        }
    };

    const handleSkip = () => {
        setSkippedQuestions((prev) => [...prev, currentQuestionIndex]);
        handleNext();
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        if (userName.trim() === '') {
            setNotification("Please fill in your name before submitting the quiz.");
            return;
        }

        let calculatedScore = 0;

        if (quiz.length > 0) {
            quiz.forEach((question) => {
                const userAnswer = answers[question.id];
                const correctAnswer = question.correct_answers[`answer_${userAnswer}_correct`] === "true";

                if (correctAnswer) {
                    calculatedScore += 1;
                }
            });
            setScore(calculatedScore);
        }

        // Set the submitted state to true without navigating to leaderboard
        setSubmitted(true);
        setNotification('');

        // Store score in local storage
        const totalMarks = localStorage.getItem('numberOfQuestions') || quiz.length;
        const newScore = { user: userName, score: calculatedScore, totalMarks };

        const currentScores = JSON.parse(localStorage.getItem('leaderboard')) || [];
        currentScores.push(newScore);
        localStorage.setItem('leaderboard', JSON.stringify(currentScores));
    };

    const handleBack = () => {
        navigate('/');
    };

    const handleShowAnswerSheet = () => {
        setShowAnswerSheet(true);
    };

    const handleGoToScoreBoard = () => {
        navigate('/leaderboard');
    };

    if (error) return <div className="error-message">{error}</div>;
    if (quiz.length === 0) return <div>Loading...</div>;

    const totalQuizTime = quiz.length * 60;
    const timeSpent = totalQuizTime - timeLeft;
    const progressPercentage = (timeSpent / totalQuizTime) * 100;
    const progressBarColor =
        timeLeft <= 60 ? '#ff1a1a' : timeLeft <= totalQuizTime / 2 ? '#ffc107' : '#28a745';

    const isLastQuestion = currentQuestionIndex === quiz.length - 1 && skippedQuestions.length === 0;

    return (
        <div className="quiz">
            {/* Back button */}
            <button className="back-button" onClick={handleBack}>
                Back
            </button>

            {/* Quiz header */}
            <h1>Quiz</h1>

            {/* Notification message for missing username */}
            {notification && <div className="notification">{notification}</div>}

            {/* Best of luck message */}
            {!submitted && currentQuestionIndex === 0 && <h2>Best Of Luck!</h2>}

            {/* Progress bar */}
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{
                        width: `${progressPercentage}%`,
                        backgroundColor: progressBarColor,
                    }}
                />
            </div>

            {/* Timer with Clock Icon */}
            <div className="timer">
                <FiClock style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')} minutes</span>
            </div>

            {/* Conditional rendering based on whether the quiz has been submitted */}
            {!submitted ? (
                <form onSubmit={handleSubmit}>
                    {/* User input for name */}
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your name"
                        required
                    />

                    {/* Check if quiz and current question exist */}
                    {quiz.length > 0 && currentQuestionIndex < quiz.length && (
                        <div>
                            <p>{currentQuestionIndex + 1}. {quiz[currentQuestionIndex].question}</p>
                            {/* Displaying options dynamically */}
                            {Object.keys(quiz[currentQuestionIndex].answers).map((key) => {
                                const answer = quiz[currentQuestionIndex].answers[key];
                                return answer && (
                                    <div key={key}>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`question-${quiz[currentQuestionIndex].id}`}
                                                value={key.replace('answer_', '')} // Get answer index
                                                onChange={() => handleAnswerChange(quiz[currentQuestionIndex].id, key.replace('answer_', ''))}
                                                checked={answers[quiz[currentQuestionIndex].id] === key.replace('answer_', '')} // Keep the selected answer
                                            />
                                            {answer}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Next and Skip Buttons */}
                    <div className="button-container">
                        {!isLastQuestion && (
                            <>
                                <button type="button" onClick={handleNext} className="next-button">
                                    Next
                                </button>
                                <button type="button" onClick={handleSkip} className="skip-button">
                                    Skip
                                </button>
                            </>
                        )}

                        {/* Submit Button (Only show on the last question) */}
                        {isLastQuestion && <button type="submit">Submit</button>}
                    </div>
                </form>
            ) : (
                <div>
                    <h2>Results:</h2>
                    <p>{userName}, you scored {score} out of {quiz.length}!</p>

                    <div className="button-container">
                        {/* Buttons for Answer Sheet and Scoreboard */}
                        <button onClick={handleShowAnswerSheet}>Answer Sheet</button>
                        <button onClick={handleGoToScoreBoard}>Scoreboard</button>
                    </div>

                    {showAnswerSheet && (
                    <div className="answer-sheet">
                        <h3>Correct Answers:</h3>
                        <ul>
                            {quiz.map((question, index) => {
                                const userAnswer = answers[question.id];
                                const correctAnswerKey = Object.keys(question.correct_answers).find(key => question.correct_answers[key] === "true");
                                
                                // Increment index by 1 to display question number starting from 1
                                return (
                                    <li key={question.id}>
                                        Question {index + 1}: Your Answer: {userAnswer ? `Answer ${userAnswer}` : 'Skipped'} - Correct Answer: {correctAnswerKey.replace('answer_', '')}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    
                    )}
                </div>
            )}
        </div>
    );
}

export default Quiz;
