import React, { useState } from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import Navbar from './components/navbar/Navbar';
import NewsPage from './pages/news/NewsPage';
import TournamentsPage from './pages/tournaments/TournamentsPage';
import MyTeamPage from './pages/team/MyTeamPage';
import MatchesPage from './pages/matches/MatchesPage';
import theme from './utils/theme';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('news');

  const renderContent = () => {
    switch (activeTab) {
      case 'news':
        return <NewsPage />;
      case 'tournaments':
        return <TournamentsPage />;
      case 'team':
        return <MyTeamPage />;
      case 'matches':
        return <MatchesPage />;
      default:
        return <NewsPage />;
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <Box minH="100vh">
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
        <Box mt="70px" p={8}>
          <Box maxW="1400px" mx="auto">
            {renderContent()}
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default App;
