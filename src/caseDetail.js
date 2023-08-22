import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './caseDetails.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CaseDetail() {
  const { caseId } = useParams();
  const [caseData, setCaseData] = useState({});
  const [status, setStatus] = useState('');
  const [showNpciScreenshot, setShowNpciScreenshot] = useState(false);

  useEffect(() => {
    fetch(`https://pixeltruthedtms.com/ml-server/caseApi.php?id=${caseId}`)
      .then(response => response.json())
      .then(data => {
        setCaseData(data);
        setStatus(data.SStatus);

        // Set showNpciScreenshot to true if NPCI_Screenshots URL is available
        if (data.NPCI_Screenshots) {
          setShowNpciScreenshot(true);
        }
      })
      .catch(error => console.error(error));
  }, [caseId]);

  const handleApprove = () => {
    insertDataIntoTable();
    toast.success('Case Approved!', {
      position: 'top-right',
      autoClose: 3000, // Close after 3 seconds
    });
      setTimeout(() => {
    window.location.reload();
  }, 3000);
    
  };

  const handleReject = () => {
    rejectedDataIntoTable();
    toast.error('Case Rejected!', {
      position: 'top-right',
      autoClose: 3000, // Close after 3 seconds
    });
      setTimeout(() => {
    window.location.reload();
  }, 3000);
  };

  const updateStatus = newStatus => {
    fetch(`http://localhost/ml_server/insert.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: caseId,
        newStatus
      })
    })
      .then(response => response.json())
      .then(data => {
        setCaseData(data);
        setStatus(newStatus);

        // After updating status, insert data into the respective table
        if (newStatus === 'Approved' || newStatus === 'Rejected') {
          insertDataIntoTable(newStatus);
        }
      })
      .catch(error => console.error(error));
  };

 // ...

const insertDataIntoTable = () => {
  // Create an object with the data you want to insert
  const dataToInsert = {
    id : caseData.id || 'No ID',
    Website_URL: caseData.Website_URL || 'demo',
    Platform: caseData.Platform || 'demo',
    UPI_VPA_Wallet: caseData.UPI_VPA_Wallet || 'demo',
    A_C_Holder_Name: caseData.A_C_Holder_Name || 'demo',
    UPI_URL: caseData.UPI_URL || 'demo',
    Method: caseData.Method || 'demo',
    status: "Approved",
    Rremark: caseData.Rremark || 'No Data',
    // reported_earlier: caseData.reported_earlier || '',
    // Found_Not_Found: caseData.Found_Not_Found || '',
    // case_generated_time: caseData.case_generated_time || '',
  };

  // Make an API call to insert data into the table
  fetch('https://pixeltruthedtms.com/ml-server/insertApprove.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: dataToInsert,
      status: status, // Pass the current status
    }),
  })
  .then((response) => response.json())
  .then((responseData) => {
    // Show a success toast notification
    toast.success('Data inserted successfully', {
      position: 'top-right',
      autoClose: 3000, // Close the notification after 3 seconds
    });
  })
  .catch((error) => console.error(error));
};

const rejectedDataIntoTable = () => {
  // Create an object with the data you want to insert
  const dataToInsert = {
    id : caseData.id || 'No ID',
    Website_URL: caseData.Website_URL || 'demo',
    Platform: caseData.Platform || 'demo',
    UPI_VPA_Wallet: caseData.UPI_VPA_Wallet || 'demo',
    A_C_Holder_Name: caseData.A_C_Holder_Name || 'demo',
    UPI_URL: caseData.UPI_URL || 'demo',
    Method: caseData.Method || 'demo',
    status: "Rejected",
    Rremark: caseData.Rremark || 'No Data',
   

    // reported_earlier: caseData.reported_earlier || '',
    // Found_Not_Found: caseData.Found_Not_Found || '',
    // case_generated_time: caseData.case_generated_time || '',
  };

  // Make an API call to insert data into the table
  fetch('https://pixeltruthedtms.com/ml-server/insertRejected.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: dataToInsert,
      status: status, // Pass the current status
    }),
  })
  .then((response) => response.json())
  .then((responseData) => {
    // Show a success toast notification
    toast.error('Case successfully Rejected', {
      position: 'top-right',
      autoClose: 3000, // Close the notification after 3 seconds
    });
  })
  .catch((error) => console.error(error));
};
// Rest of your component code...

  const handleShowNpciScreenshot = () => {
    setShowNpciScreenshot(true);
  };

  const handleHideNpciScreenshot = () => {
    setShowNpciScreenshot(false);
  };
  const handleFieldChange = e => {
    const { name, value } = e.target;
    setCaseData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFieldBlur = () => {
    // Call a function here to insert data into the respective table
    insertDataIntoTable();
  };
  // Rest of your component code...

  return (
    
    <div>
    <h1></h1>
      {/* <label><input type="text" value={caseData.NPCI_Screenshots|| ''} onBlur={handleFieldBlur} onChange={handleFieldChange} />
<input type="text" value={caseData.MFilterit_Screenshots|| ''} onBlur={handleFieldBlur} onChange={handleFieldChange} /></ label ><br />  */}

<div className="flex-container">
  <div className="iframes-container">
    
    <div className={`right-panel ${showNpciScreenshot ? 'visible' : ''}`}>
    <p style={{ color: "red", marginLeft: "300px", fontSize: "20px" }}>
  {caseData.Website_URL || ''}
</p>
      {showNpciScreenshot && (
        <iframe
        title="NPCI Screenshot"
        src={caseData.NPCI_Screenshots}
        width="99%"
        height="500px"
        // style={{ transform: 'scale(0.9)' }} /* Set the scale to 80% (0.8) */
        // frameBorder={0}/* Adjust the desired height */
        />
      )}
    </div>
    <div></div>
    <div className={`right-panel ${showNpciScreenshot ? 'visible' : ''}`}>
    <p style={{ color: "red", marginLeft: "", fontSize: "20px" }}> {caseData.UPI_URL || ''}</p>
      
      
      
    </div>
  </div>
  <div className="form-container">
          
        <form>
        {/* <label><input type="text" value={caseData.Website_URL|| ''} onBlur={handleFieldBlur} onChange={handleFieldChange} style={{color:"red"}}/></ label > */}
        <label>
          <input type="text" name="id" value={caseData.id || ''} readOnly />
        </label>
        
        <label>
           <input type="text" name="Name" value={caseData.Name || ''} onBlur={handleFieldBlur} onChange={handleFieldChange} />
        </label>
      
        {/* <label>SS Bank :<input type="text" value={caseData.SS_Bank|| ''} onBlur={handleFieldBlur} onChange={handleFieldChange} /></ label ><br /> */}
        
<label>Platform :<input type="text" value={caseData.Platform|| ''} onBlur={handleFieldBlur} onChange={handleFieldChange} /></ label >
<label>UPI/VPA/Wallet :<input name='UPI_VPA_Wallet' type="text" value={caseData.UPI_VPA_Wallet|| ''} onBlur={handleFieldBlur} onChange={handleFieldChange} /></ label >
<label>A/C Holder Name :<input type="text" name='A_C_Holder_Name' value={caseData.A_C_Holder_Name|| ''} onBlur={handleFieldBlur} onChange={handleFieldChange} /></ label >


{/* <label>UPI URL :<input type="text" name='UPI_URL' value={caseData.UPI_URL|| ''} onBlur={handleFieldBlur} onChange={handleFieldChange} /></ label > */}
<label>Method :<input type="text" name='Method' value={caseData.Method|| ''} onBlur={handleFieldBlur} onChange={handleFieldChange} /></ label >
{/* <label>Inserted_Date :<input type="text" value={caseData.Inserted_Date|| ''} onBlur={handleFieldBlur} onChange={handleFieldChange} /></ label ><br /> */}

{/* <label>reported_earlier :<input type="text" value={caseData.reported_earlier|| ''} onBlur={handleFieldBlur} onChange={handleFieldChange} /></ label > */}
{/* <label>Found/Not Found :<input type="text" value={caseData.Found_Not_Found|| ''} onBlur={handleFieldBlur} onChange={handleFieldChange} /></ label >
<label>case_generated_time :<input type="text" value={caseData.case_generated_time|| ''} onBlur={handleFieldBlur} onChange={handleFieldChange} /></ label > */}
        <label>
          
          <input
            type="date"
            name="Inserted_Date"
            value={caseData.Inserted_Date || ''}
            onBlur={handleFieldBlur}
            onChange={handleFieldChange}
          />
        </label>

        <input
            type="text"
            name="Rremark"
            value={caseData.Rremark || ''}
            onBlur={handleFieldBlur}
            onChange={handleFieldChange}
          />
        <br />
        <label>
          
          <input
            type="text"
            value={status}
            readOnly
            className={status === 'Approved' ? 'status-Approved' : status === 'Rejected' ? 'status-Rejected' : ''}
          />
        </label>
      </form>
      <div className="button-container">
  <button onClick={handleApprove} className="approve-button">
    Approve
  </button>
  <button onClick={handleReject} className="reject-button">
    Reject
  </button>
</div>


          {/* {caseData.NPCI_Screenshots && (
            <button onClick={handleShowNpciScreenshot}>
              Show NPCI Screenshot
            </button>
          )} */}
          {/* {showNpciScreenshot && (
            <button onClick={handleHideNpciScreenshot}>
              Hide NPCI Screenshot
            </button>
          )} */}
        </div>
      </div>

    </div>
  );
}

export default CaseDetail;
