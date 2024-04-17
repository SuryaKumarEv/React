import React, { useEffect, useState, Suspense, lazy, useCallback } from 'react';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Paginator } from 'primereact/paginator';

const LazyLoadedDataTable = lazy(() => import('./LazyLoadedDataTable'));

function App() {
  const [students, setStudents] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(true);
  // const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    address: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phoneNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecord, setTotalRecord] = useState();
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const body = {
        page: (first / 10) + 1,
        pageSize: rows,
        filter: globalFilterValue,
        order: sortField && sortOrder ? `${sortField},${sortOrder === 1 ? 'asc' : 'desc'}` : '',
      };
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        body: JSON.stringify(body),
      };
      const response = await fetch(
        `https://localhost:7270/api/Student/GetAllStudentsData`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setStudents(data.students);
      setTotalRecord(data.totalRecords);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [first, rows, globalFilterValue, sortField, sortOrder]);

  useEffect(() => {
    const fetchStudentsData = async () => {
      await fetchStudents();
    };

    fetchStudentsData();
  }, [fetchStudents]);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

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

  const handleSortChange = (e) => {
    setSortField(e.sortField);
    setSortOrder(e.sortOrder);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <h1 style={{ margin: '10px', marginLeft: '0px', fontSize: '50px' }}>
          Student Data
        </h1>
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
      <Suspense
        fallback={
          <div className="spinner-overlay">
            <ProgressSpinner style={{ width: '50px', height: '50px' }} />
          </div>
        }
      >
        <LazyLoadedDataTable
          students={students}
          filters={filters}
          globalFilterValue={globalFilterValue}
          onGlobalFilterChange={onGlobalFilterChange}
          loading={loading}
          header={header}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
        <div className="card">
          <Paginator
            first={first}
            rows={rows}
            totalRecords={totalRecord}
            rowsPerPageOptions={[10, 20, 30]}
            onPageChange={onPageChange}
          />
        </div>
      </Suspense>
    </div>
  );
}

export default App;