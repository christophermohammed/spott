import React, { useEffect, useState } from 'react';
import { makeRequest } from 'utils/request';
import { GET } from 'common/network';
import { GET_DATA } from 'common/errorMessages';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const d = await makeRequest(GET, '/api/data', GET_DATA);
        setData(d);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [setData]);

  return (
    <div>
      <h1>From Server</h1>
      <ul>
        {data.map(d => (
          <li key={d.id}>{d.id}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
