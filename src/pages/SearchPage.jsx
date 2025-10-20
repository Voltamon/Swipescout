import React, { useContext, useState  } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const SearchPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabs = [
    { label: t('search.searchJobs'), value: 0 },
    { label: t('search.searchCandidates'), value: 1 },
    { label: t('search.searchVideos'), value: 2 }
  ];

  return (
    <Box>
      <Tabs value={activeTab} onChange={handleTabChange}>
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>
      <Box>
        {activeTab === 0 && <div>{t('search.searchResults')} - Jobs</div>}
        {activeTab === 1 && <div>{t('search.searchResults')} - Candidates</div>}
        {activeTab === 2 && <div>{t('search.searchResults')} - Videos</div>}
      </Box>
    </Box>
  );
};

export default SearchPage;
