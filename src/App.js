import React, { useEffect, useState, Suspense, lazy } from 'react';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';

const LazyLoadedDataTable = lazy(() => import('./LazyLoadedDataTable'));

function App() {
  const [students, setStudents] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://localhost:7270/api/Student/GetAll');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const [filters, setFilters] = useState({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    address: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phoneNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const onGlobalFilterChange = (e) => {
    const { value } = e.target;
    const updatedFilters = {
      ...filters,
      name: { value: value, matchMode: FilterMatchMode.CONTAINS },
      address: { value: value, matchMode: FilterMatchMode.CONTAINS },
      phoneNo: { value: value, matchMode: FilterMatchMode.CONTAINS },
    };
    setFilters(updatedFilters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <div style={{ alignItems: 'self-end' }}>
            <h1 style={{ margin: '10px', marginLeft: '0px', fontSize: '50px' }}>
              Student Data
            </h1>
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
            />
          </div>
        </span>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className="App">
      <Suspense fallback={<div>{loading}</div>}>
        <LazyLoadedDataTable
          students={students}
          filters={filters}
          globalFilterValue={globalFilterValue}
          onGlobalFilterChange={onGlobalFilterChange}
          loading={loading}
          header={header}
        />
      </Suspense>
    </div>
  );
}

export default App;
