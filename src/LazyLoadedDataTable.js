import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ProgressSpinner } from 'primereact/progressspinner'
import { InputText } from 'primereact/inputtext'
import { Paginator } from 'primereact/paginator'

const LazyLoadedDataTable = ({
  students,
  filters,
  globalFilterValue,
  loading,
  sortField,
  sortOrder,
  onSortChange,
  onColumnFilterChange,
  first,
  rows,
  totalRecords,
  rowsPerPageOptions,
  onPageChange,
}) => {
  const [nameLoading, setNameLoading] = useState(false)
  const [addressLoading, setAddressLoading] = useState(false)
  const [phoneLoading, setPhoneLoading] = useState(false)

  const onFilterInputChange = async (columnName, value) => {
    switch (columnName) {
      case 'name':
        setNameLoading(true)
        break
      case 'address':
        setAddressLoading(true)
        break
      case 'phoneNo':
        setPhoneLoading(true)
        break
      default:
        break
    }

    await onColumnFilterChange(columnName, value)

    switch (columnName) {
      case 'name':
        setNameLoading(false)
        break
      case 'address':
        setAddressLoading(false)
        break
      case 'phoneNo':
        setPhoneLoading(false)
        break
      default:
        break
    }
  }

  return (
    <div className="App">
      <DataTable
        value={students}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={onSortChange}
        sortMode="single"
        filters={filters}
        rows={15}
        totalRecords={students.length}
        dataKey="id"
        filterDisplay="row"
        globalFilter={globalFilterValue}
        emptyMessage="No students found."
      >
        <Column
          field="name"
          header="Name"
          sortable
          filter
          filterPlaceholder="Search by name"
          filterElement={() => (
            <InputText
              type="text"
              className="filter-input"
              placeholder="Search by name"
              onChange={(e) => onFilterInputChange('name', e.target.value)}
            />
          )}
          loading={nameLoading}
        />
        <Column
          field="address"
          header="Address"
          sortable
          filter
          filterPlaceholder="Search by address"
          filterElement={() => (
            <InputText
              type="text"
              className="filter-input"
              placeholder="Search by address"
              onChange={(e) => onFilterInputChange('address', e.target.value)}
            />
          )}
          loading={addressLoading}
        />
        <Column
          field="phoneNo"
          header="Phone"
          sortable
          filter
          filterPlaceholder="Search by phone"
          filterElement={() => (
            <InputText
              type="text"
              className="filter-input"
              placeholder="Search by phone"
              onChange={(e) => onFilterInputChange('phoneNo', e.target.value)}
            />
          )}
          loading={phoneLoading}
        />
      </DataTable>
      {loading && (
        <div className="spinner-overlay">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} />
        </div>
      )}

      <div
        className="card"
        style={{
          position: 'sticky',
          width: '100%',
          bottom: '0',
          left: '0',
        }}
      >
        <Paginator
          first={first}
          rows={rows}
          totalRecords={totalRecords}
          rowsPerPageOptions={rowsPerPageOptions}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  )
}

export default LazyLoadedDataTable
