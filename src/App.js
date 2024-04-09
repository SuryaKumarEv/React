import React, { useEffect, useState, Suspense, lazy, useCallback } from 'react';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';

const LazyLoadedDataTable = lazy(() => import('./LazyLoadedDataTable'));

function App() {
  const [students, setStudents] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    address: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phoneNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://localhost:7270/api/Student/GetAllStudentsData?page=1&pageSize=${pageSize}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setStudents(data.students);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    const fetchStudentsData = async () => {
      await fetchStudents();
    };
    
    fetchStudentsData();
  }, [fetchStudents]);

  const onGlobalFilterChange = (e) => {
    const { value } = e.target;
    setGlobalFilterValue(value);
    applyGlobalFilter(value);
  };

  const applyGlobalFilter = (value) => {
    let _filters = {
      name: { value: value, matchMode: FilterMatchMode.CONTAINS },
      address: { value: value, matchMode: FilterMatchMode.CONTAINS },
      phoneNo: { value: value, matchMode: FilterMatchMode.CONTAINS },
    };
    setFilters(_filters);
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <h1 style={{ margin: '10px', marginLeft: '0px', fontSize: '50px' }}>
          Student Data
        </h1>
        <div>
          <span>Rows per page:</span>
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
        </div>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <div style={{ alignItems: 'self-end' }}>
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
      <Suspense fallback={<div className="spinner-overlay"><ProgressSpinner style={{ width: '50px', height: '50px' }} /></div>}>
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
