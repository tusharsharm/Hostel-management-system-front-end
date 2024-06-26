// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import './hpvisit.css';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box } from "@mui/material";
import { server, serverPort } from '../utils/Constants';
import AdminHorizontalNav from '../navbars/HorizontalNav/Admin_hnav';

function AdminHospitalVisits() {
  const [hospitalVisits, setHospitalVisits] = useState([]);
  const [isClearing, setIsClearing] = useState(false);
  useEffect(() => {
    // Fetch hospital visit requests from the backend
    axios.get(server+":"+serverPort+"/api/hospital-visits/")
      .then((response) => {
        console.log("Hospital visits data:", response.data); // Debugging line
        const storedClearedRows = JSON.parse(localStorage.getItem("clearedRows")) || [];
        const updatedHospitalVisits = response.data.filter((visit) => !storedClearedRows.includes(visit.VisitID));
        setHospitalVisits(updatedHospitalVisits);
      })
      .catch((error) => {
        console.error("Error fetching hospital visits:", error);
      });
  }, []);

  const clearRow = (visitID) => {
    const updatedHospitalVisits = hospitalVisits.filter((visit) => visit.VisitID !== visitID);
    setHospitalVisits(updatedHospitalVisits);
    const storedClearedRows = JSON.parse(localStorage.getItem("clearedRows")) || [];
    localStorage.setItem("clearedRows", JSON.stringify([...storedClearedRows, visitID]));
  };

  const clearRowAfterTime = (visitID) => {
    setIsClearing(true);
    setTimeout(() => {
      clearRow(visitID);
      setIsClearing(false);
    }, 10000); // Clear row after 10 seconds
  };

  return (
    <header>
      <AdminHorizontalNav/>
    <Box className="AHV-Style">
    
      <Typography variant="h2" sx={{pb: '5%'}}>
          <text className="BrasikaFont floatRightIn grayFont">
            Admin Hospital Visits
          </text>
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell class="BrasikaFont floatRightIn grayFont" style={{padding: '2%'}}>Registration Number</TableCell>
              <TableCell class="BrasikaFont floatRightIn grayFont">Hospital Name</TableCell>
              <TableCell class="BrasikaFont floatRightIn grayFont">Department</TableCell>
              <TableCell class="BrasikaFont floatRightIn grayFont">Purpose</TableCell>
              <TableCell class="BrasikaFont floatRightIn grayFont">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hospitalVisits && hospitalVisits.length === 0 
            ?
              <TableRow >
                <TableCell colspan={5} class="BrasikaFont floatRightIn grayFont" style={{padding: '3%'}}>
                  <h3> Currently there are no data to display </h3>
                </TableCell>
              </TableRow>
            :
            hospitalVisits.map((visit) => (
              <TableRow key={visit.VisitID}>
                <TableCell class="floatRightIn" style={{padding: '2%'}}>{visit.RegistrationNumber}</TableCell>
                <TableCell class="floatRightIn">{visit.HospitalName}</TableCell>
                <TableCell class="floatRightIn">{visit.Department}</TableCell>
                <TableCell class="floatRightIn">{visit.Purpose}</TableCell>
                <TableCell class="floatRightIn">
                  <Button variant="outlined" onClick={() => clearRowAfterTime(visit.VisitID)} disabled={isClearing}>
                    {isClearing ? "Clearing..." : "Done"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
    </header>
  );
}

export default AdminHospitalVisits;


