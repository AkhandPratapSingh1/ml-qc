import React, { useState, useEffect } from 'react';
import './caseList.css';
import * as XLSX from 'xlsx';

function CaseList() {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // New status filter

  useEffect(() => {
    fetch('https://pixeltruthedtms.com/ml-server/api.php')
      .then(response => response.json())
      .then(data => {
        setCases(data);
        setFilteredCases(data);
      })
      .catch(error => console.error(error));
  }, []);

  const handleFilter = () => {
    const formattedFilterDate = filterDate
      ? new Date(filterDate).toLocaleDateString('en-GB')
      : '';

    const filtered = cases.filter(caseItem => {
      const nameMatch = filterName === '' || caseItem.Name.toLowerCase() === filterName.toLowerCase();
      const statusMatch = filterStatus === '' || caseItem.SStatus.toLowerCase() === filterStatus.toLowerCase();

      if (filterDate) {
        const formattedCaseDate = new Date(caseItem.Inserted_Date).toLocaleDateString('en-GB');
        const dateMatch = formattedCaseDate === formattedFilterDate;
        return nameMatch && statusMatch && dateMatch;
      }

      return nameMatch && statusMatch;
    });

    setFilteredCases(filtered);
  };
  const bankMappings = require('./bankMappings'); // Import the bankMappings from the separate file

  const exportData = () => {
    // Create a new array with the specified columns from filteredCases
    const dataToExport = filteredCases.map(caseItem => {
      const upiVpa = caseItem.UPI_VPA_Wallet || '';
      const atIndex = upiVpa.indexOf('@');
      let bankName = "NA"; // Default value if '@' is not found
      const domainn = upiVpa.substring(atIndex + 1);
      if (atIndex !== -1) {
        const domain = upiVpa.substring(atIndex + 1);
  
        // Check if the domain exists in the imported bankMappings
        if (bankMappings[domain.toLowerCase()]) {
          bankName = bankMappings[domain.toLowerCase()];
        }
      }
      const webUrlMatch = caseItem.Website_URL.match(/\/\/(.*?)\//);
      const webUrlData = webUrlMatch ? webUrlMatch[1] : 'NA';
  
      // Extract data from UPI_URL
      const upiUrlMatch = caseItem.UPI_URL.match(/\/\/(.*?)\//);
      const upiUrlData = upiUrlMatch ? upiUrlMatch[1] : 'NA';
  
      // Determine payment_gateway_name based on matching data
      let payment_gateway_name = webUrlData !== upiUrlData ? upiUrlData : 'NA';
      let screenshot_case_report_links = caseItem.NPCI_Screenshots || '';
      if (caseItem.MFilterit_Screenshots) {
        screenshot_case_report_links += ',' + caseItem.MFilterit_Screenshots;
      }
      const npcScreenshotsMatch = caseItem.NPCI_Screenshots.match(/%20(.*?)--/);
      const caseGeneratedTime = npcScreenshotsMatch ? npcScreenshotsMatch[1] : '';
      return {
        id: caseItem.id || '',
        Name: caseItem.Name || '',
        Customer: "Mystery Shopping",
        Package_name: "com.mysteryshopping",
        Channel_name: "Organic Search",
        Bank_account_number: "NA",
        Bank_name: bankName, // Set the bank_name based on the UPI/VPA mapping
       // Original UPI/VPA value
       UPI_VPA_Wallet: caseItem.UPI_VPA_Wallet || '',
        A_C_Holder_Name: caseItem.A_C_Holder_Name || '',
        NPCI_Screenshots: caseItem.NPCI_Screenshots || '',
        MFilterit_Screenshots: caseItem.MFilterit_Screenshots || '',
        Platform: caseItem.Platform || '',
        Search_for: "Web",
        Status: "Active",
        Upi_bank_account_wallet: "UPI",
        Priority: "High",
        Flag: "1",
        Cessation: "NA",
        Reviewed_status: "1",
        handle: domainn,
        origin: "NA",
        payment_gateway_name: payment_gateway_name,
        category_of_website: "NA",
        screenshot_case_report_link: screenshot_case_report_links,
        Payment_gateway_intermediate_url: "NA",
        Neft_imps: "NA",
        Method: caseItem.Method || '',
        Ifsc_code: "NA",
        Bank_branch_details: "NA",
        Payment_gateway_url: "NA",
        UPI_URL: caseItem.UPI_URL || '',
        Website_URL: caseItem.Website_URL || '',
        Inserted_Date: caseItem.Inserted_Date || '',
        reported_earlier: caseItem.reported_earlier || '',
        approvd_status: "NA",
        Feature_type: "BS Money Laundering",
        Sub_category: "NA",
        Found_Not_Found: caseItem.Found_Not_Found || '',
        case_generated_time: caseGeneratedTime,
        header: caseItem.SStatus || ''
      };
    });
  
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cases');
  
    // Get the current date in a formatted string
    const currentDate = new Date().toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  
    // Use XLSX.writeFile to export the data with the date in the filename
    XLSX.writeFile(wb, `cases_${currentDate}.xlsx`);
  };
  
  
  


  return (
    <div className="case-list-container">
      <div className="sidebar">
        {/* Your sidebar content */}
      </div>
      <div className="main-content">
        <h1>Case List</h1>
        <div className="filters">
          <select
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
          >
            <option value="">All Names</option>
            {Array.from(new Set(cases.map(caseItem => caseItem.Name))).map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            {Array.from(new Set(cases.map(caseItem => caseItem.SStatus))).map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <input
            type="date"
            placeholder="Filter by Date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          />
          <button onClick={handleFilter}>Apply Filters</button>
          <button onClick={exportData}>Export Data</button>
        </div>
        <table className="table-container">
          <thead className="table-header">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="table-data">
            {filteredCases.map(caseItem => (
              <tr key={caseItem.id}>
                <td>
                  <a className="case-id-button" href={`/case/${caseItem.id}`} target="_blank">
                    {caseItem.id}
                  </a>
                </td>
                <td>{caseItem.Name}</td>
                <td>{caseItem.Inserted_Date}</td>
                <td className={`status-${caseItem.SStatus.toLowerCase()}`}>
                  {caseItem.SStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CaseList;
