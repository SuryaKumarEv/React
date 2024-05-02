import React, { useEffect, useState, Suspense, lazy, useCallback } from 'react'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import { InputText } from 'primereact/inputtext'
import { ProgressSpinner } from 'primereact/progressspinner'

const LazyLoadedDataTable = lazy(() => import('./LazyLoadedDataTable'))

function App() {
  const [students, setStudents] = useState([])
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    name: { value: null, matchMode: '' },
    address: { value: null, matchMode: '' },
    phoneNo: { value: null, matchMode: '' },
  })
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)
  const [totalRecord, setTotalRecord] = useState()
  const [sortBy, setSortBy] = useState([])

  const filterMatchModeOptions = [
    { label: 'Contains', value: 'contains' },
    { label: 'Starts with', value: 'startswith' },
    { label: 'Ends with', value: 'endswith' },
    { label: 'Equals', value: 'equals' },
    { label: 'Not equals', value: 'notequals' },
    { label: 'No Filter', value: '' },
  ]

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true)
      const columnFilters = Object.entries(filters).reduce(
        (acc, [key, value]) => {
          if (value.value) acc[key] = value.value
          return acc
        },
        {}
      )
      const body = {
        pageNumber: first / 10 + 1,
        pageSize: rows,
        globalfilter: globalFilterValue,
        sortBy: sortBy,
        columnFilters: Object.keys(columnFilters).join(','),
        searchItem:
          filters.name.value ||
          filters.address.value ||
          filters.phoneNo.value ||
          null,
        matchMode:
          filters.name.matchMode ||
          filters.address.matchMode ||
          filters.phoneNo.matchMode ||
          '',
      }
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        body: JSON.stringify(body),
      }
      const response = await fetch(
        `https://localhost:7270/api/Student/GetAllStudentsData`,
        requestOptions
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setStudents(data.students)
      setTotalRecord(data.totalRecords)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [first, rows, globalFilterValue, sortBy, filters])

  useEffect(() => {
    const fetchStudentsData = async () => {
      await fetchStudents()
    }

    fetchStudentsData()
  }, [fetchStudents])

  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
  }

  const onGlobalFilterChange = (e) => {
    const { value } = e.target
    setGlobalFilterValue(value)
  }

  const handleSortChange = (e) => {
    console.log('Sorting criteria:', e)
    const { sortField, sortOrder } = e
    if (sortField && sortOrder) {
      const existingSortIndex = sortBy.findIndex(
        (item) => item.field === sortField
      )
      if (existingSortIndex !== -1) {
        const updatedSortBy = [...sortBy]
        updatedSortBy[existingSortIndex].order =
          -sortBy[existingSortIndex].order
        setSortBy(updatedSortBy)
      } else {
        setSortBy([...sortBy, { field: sortField, order: sortOrder }])
      }
    }
  }

  const handleColumnFilterChange = (columnName, value, matchMode) => {
    const updatedFilters = {
      ...filters,
      [columnName]: { value: value, matchMode: matchMode },
    }
    setFilters(updatedFilters)
    // Fetch data with updated filters
    fetchStudents()
  }

  return (
    <div className="App">
      <Suspense
        fallback={
          <div className="spinner-overlay">
            <ProgressSpinner style={{ width: '50px', height: '50px' }} />
          </div>
        }
      >
        <div>
          <div
            className="d-flex justify-content-between align-items-center"
            style={{
              margin: '10px',
              marginLeft: '0px',
              fontSize: '32px',
              color: '#374151',
              backgroundColor: '#EEF2FF',
              padding: '10px',
              paddingLeft: '0px',
              paddingRight: '18px',
              borderRadius: '10px',
              display: 'flex',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                src="../pngwing.com.png"
                alt="S-Logo"
                style={{
                  height: '70px',
                }}
              />
              <h1>Student Data</h1>
            </div>
            <div>
              <InputText
                placeholder="Search"
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                style={{
                  fontSize: '18px',
                  height: '50px',
                  width: '300px',
                }}
              />
            </div>
          </div>
        </div>
        <LazyLoadedDataTable
          students={students}
          filters={filters}
          globalFilterValue={globalFilterValue}
          onGlobalFilterChange={onGlobalFilterChange}
          loading={loading}
          sortField={sortBy[0]?.field}
          sortOrder={sortBy[0]?.order}
          onSortChange={handleSortChange}
          onColumnFilterChange={handleColumnFilterChange}
          first={first}
          rows={rows}
          totalRecords={totalRecord}
          rowsPerPageOptions={[10, 20, 30]}
          onPageChange={onPageChange}
          filterMatchModeOptions={filterMatchModeOptions}
        />
      </Suspense>
    </div>
  )
}

export default App
