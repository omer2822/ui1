import React, { useState } from "react";
import NavigationBar from "./navigationBar/NavigationBar";
import FileUpload from "./fileUpload/FileUpload";
import ShiftTable from "./shiftTable/ShiftTable";
import EmployeeTable from "./employeeTable/EmployeeTable";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './App.css'; // Import custom styles
import ScheduleComponent from "./schedule/Schedule";

function App() {
  const [array1, setArray1] = useState([]);
  const [array2, setArray2] = useState([]);
  const [schedule, setSchedule] = useState([]);

  const csvFileToArray = (string, setArray) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map((row) => {
      const values = row.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    setArray(array);
  };

  const handleFileSubmit1 = (file) => {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      const text = event.target.result;
      csvFileToArray(text, setArray1);
    };
    fileReader.readAsText(file);
  };

  const handleFileSubmit2 = (file) => {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      const text = event.target.result;
      csvFileToArray(text, setArray2);
    };
    fileReader.readAsText(file);
  };

  // Function to check availability and skills
  const isEligibleForShift = (employee, shift) => {
    return (
      Array.isArray(employee.available) &&
      Array.isArray(employee.skills) &&
      employee.available.includes(shift.time) &&
      employee.skills.includes(shift.skill)
    );
  };

  const generateSchedule = () => {
    const shifts = array1.map((shift) => ({
      ...shift,
      time: shift.time, // Ensure shift object has a `time` property
      skill: shift.skill, // Ensure shift object has a `skill` property
    }));

    const employees = array2.map((employee) => ({
      ...employee,
      available: employee.available ? employee.available.split(",") : [], // Ensure available times are in array format
      skills: employee.skills ? employee.skills.split(",") : [], // Ensure skills are in array format
    }));

    let schedule = [];

    shifts.forEach((shift) => {
      let assigned = false;
      employees.forEach((employee) => {
        if (isEligibleForShift(employee, shift)) {
          schedule.push({ shift, employee });
          assigned = true;
        }
      });
      if (!assigned) {
        console.log(`No available employee for shift ${shift.id}`);
      }
    });

    setSchedule(schedule);
  };

  const headerKeys1 = array1.length ? Object.keys(array1[0]) : [];
  const headerKeys2 = array2.length ? Object.keys(array2[0]) : [];

  return (
    <div>
      <NavigationBar />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Employee Shift Scheduler</h1>

        <div className="row">
          <div className="col-md-6">
            <FileUpload onFileSubmit={handleFileSubmit1} label="Import Skill Requirements" />
          </div>
          <div className="col-md-6">
            <FileUpload onFileSubmit={handleFileSubmit2} label="Import Employee Data" />
          </div>
        </div>

        <button onClick={generateSchedule} className="btn btn-primary mt-4">Generate Schedule</button>


        {/* <ScheduleComponent /> */}
        {array1.length > 0 && (
          <div>
            <h3 className="mt-4">Skill Requirements Data</h3>
            <ShiftTable headerKeys={headerKeys1} dataArray={array1} />
          </div>
        )}

        {array2.length > 0 && (
          <div>
            <h3 className="mt-4">Employee Data</h3>
            <EmployeeTable headerKeys={headerKeys2} dataArray={array2} />
          </div>
        )}

        {schedule.length > 0 && (
          <div>
            <h3 className="mt-4">Generated Schedule</h3>
            <ShiftTable headerKeys={["Shift", "Employee"]} dataArray={schedule.map(s => ({
              Shift: `${s.shift.time} - ${s.shift.skill}`,
              Employee: s.employee.name
            }))} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
