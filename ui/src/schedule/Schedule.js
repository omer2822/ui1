import React, { useState } from 'react';
import axios from 'axios';

const ScheduleComponent = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [kpis, setKpis] = useState({});

  const handleFileChange1 = (e) => setFile1(e.target.files[0]);
  const handleFileChange2 = (e) => setFile2(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file1 || !file2) {
      console.error("Please upload both files.");
      return;
    }

    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);

    try {
      const response = await axios.post('/schedule', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAssignments(response.data.assignments);
      setKpis(response.data.kpis);
    } catch (error) {
      console.error('Error scheduling shifts:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Shift Scheduler</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group">
          <label>Import Skill Requirements</label>
          <input type="file" className="form-control-file" onChange={handleFileChange1} />
        </div>
        <div className="form-group">
          <label>Import Employee Data</label>
          <input type="file" className="form-control-file" onChange={handleFileChange2} />
        </div>
        <button type="submit" className="btn btn-primary">Generate Schedule</button>
      </form>

      {Object.keys(kpis).length > 0 && (
        <div className="mt-4">
          <h3>KPI Metrics</h3>
          <ul className="list-group">
            <li className="list-group-item">Schedule Coverage: {kpis.schedule_coverage.toFixed(2)}%</li>
            <li className="list-group-item">Employee Utilization: {kpis.employee_utilization.toFixed(2)}%</li>
            <li className="list-group-item">Overtime Hours: {kpis.overtime_hours}</li>
            <li className="list-group-item">Shift Balance (Std Dev): {kpis.shift_balance}</li>
            <li className="list-group-item">Skill Match Rate: {kpis.skill_match_rate.toFixed(2)}%</li>
            <li className="list-group-item">Uncovered Skills: {kpis.uncovered_skills}</li>
          </ul>
        </div>
      )}

      {assignments.length > 0 && (
        <div>
          <h3 className="mt-4">Generated Schedule</h3>
          <table className="table table-striped mt-4">
            <thead className="thead-dark">
              <tr>
                <th>Worker</th>
                <th>Shift</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment, index) => (
                <tr key={index}>
                  <td>{assignment.worker}</td>
                  <td>{assignment.demand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ScheduleComponent;
