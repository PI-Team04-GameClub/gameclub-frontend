import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import theme from './styles/theme';
import Navbar from './components/Navbar';
import GamesPage from './pages/games/GamesPage';
import TeamsPage from './pages/teams/TeamsPage';
import TournamentsPage from './pages/tournaments/TournamentsPage';
import NewsPage from './pages/news/NewsPage';

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box>
          <Navbar />
          <Box minH="calc(100vh - 73px)">
            <Routes>
              <Route path="/" element={<Navigate to="/news" replace />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/tournaments" element={<TournamentsPage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ChakraProvider>
  );
};

export default App;
