import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes instead of Switch
import CaseList from './caseList';
import CaseDetail from './caseDetail';

function App() {
  return (
    <Router>
      <Routes> {/* Use Routes component */}
        <Route path="/" element={<CaseList />} />
        <Route path="/case/:caseId" element={<CaseDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
