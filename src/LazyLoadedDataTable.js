import React from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'

const LazyLoadedDataTable = ({
  students,
  filters,
  globalFilterValue,
  onGlobalFilterChange,
  loading,
}) => {
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
    )
  }

  const header = renderHeader()

  return (
    <div className="App">
      <DataTable
        pt={{
          root: {
            style: { height: '900px' },
          },
        }}
        value={students}
        sortField="name"
        sortMode="multiple"
        filters={filters}
        paginator
        rows={20}
        rowsPerPageOptions={[2, 5, 10, 15, 20, 25, 50, 100, 200, 2000]}
        totalRecords={students.length}
        dataKey="id"
        filterDisplay="row"
        loading={loading}
        globalFilterFields={['name', 'address', 'id', 'phoneNo']}
        emptyMessage="No users found."
        header={header}
      >
        <Column
          field="name"
          header="Name"
          filter
          filterPlaceholder="Search by name"
          sortable
        />
        <Column
          field="address"
          header="Address"
          filter
          filterPlaceholder="Search by email"
          sortable
        />
        <Column
          field="phoneNo"
          header="Phone"
          filter
          filterPlaceholder="Search by phone"
          sortable
        />
      </DataTable>
    </div>
  )
}

export default LazyLoadedDataTable
