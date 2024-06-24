import React from 'react';
import { Table } from 'react-bootstrap';

const ShiftTable = ({ headerKeys, dataArray }) => {
  return (
    <Table striped bordered hover className="mt-4">
      <thead className="thead-dark">
        <tr>
          {headerKeys.map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataArray.map((item, index) => (
          <tr key={index}>
            {Object.values(item).map((val, idx) => (
              <td key={idx}>{val}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ShiftTable;
