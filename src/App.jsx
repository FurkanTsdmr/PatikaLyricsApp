import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Search from './Components/Search';

function HomePage() {
  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      <p>Click the button below to search for songs.</p>
      <a href="/search">
        <button>Go to Search</button>
      </a>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Ana sayfa */}
        <Route path="/search" element={<Search />} /> {/* Search sayfası */}
      </Routes>
    </Router>
  );
}

export default App;
