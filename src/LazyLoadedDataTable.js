import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';

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
    );
  };

  const header = renderHeader();

  if (loading) {
    return (
      <div className="spinner-container">
        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
      </div>
    );
  }

  return (
    <div className="App">
      <DataTable
        value={students}
        sortField="name"
        sortMode="multiple"
        filters={filters}
        rows={15}
        totalRecords={students.length}
        dataKey="id"
        filterDisplay="row"
        loading={loading}
        globalFilter={globalFilterValue}
        emptyMessage="No students found."
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
          filterPlaceholder="Search by address"
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
  );
};

export default LazyLoadedDataTable;
