// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Quiz from './Components/QuizTemplate';
import Leaderboard from './Components/LeaderBoard';
import Progress from './Components/Progress';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/quiz" element={<Quiz/>} />
                <Route path="/leaderboard/" element={<Leaderboard/>} />
                <Route path="/progress" element={<Progress/>} />
            </Routes>
        </Router>
    );
}

export default App;

