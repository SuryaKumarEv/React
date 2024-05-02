import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ProgressSpinner } from 'primereact/progressspinner'
import { InputText } from 'primereact/inputtext'
import { Paginator } from 'primereact/paginator'
import { Dropdown } from 'primereact/dropdown'

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
  filterMatchModeOptions,
}) => {
  const [nameLoading, setNameLoading] = useState(false)
  const [addressLoading, setAddressLoading] = useState(false)
  const [phoneLoading, setPhoneLoading] = useState(false)

  useEffect(() => {}, [students])

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

    await onColumnFilterChange(columnName, value, filters[columnName].matchMode)

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
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        value={students}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={onSortChange}
        sortMode="single"
        filters={filters}
        removableSort
        stripedRows
        showGridlines
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
            <div className="p-inputgroup">
              <InputText
                type="text"
                className="filter-input"
                placeholder="Search by name"
                onChange={(e) => onFilterInputChange('name', e.target.value)}
              />
              <Dropdown
                value={filters.name.matchMode}
                options={filterMatchModeOptions}
                onChange={(e) =>
                  onColumnFilterChange(
                    'name',
                    filters.name.value,
                    e.target.value
                  )
                }
              />
            </div>
          )}
          loading={nameLoading}
          matchMode={filters.name.matchMode}
        />
        <Column
          field="address"
          header="Address"
          sortable
          filter
          filterPlaceholder="Search by address"
          filterElement={() => (
            <div className="p-inputgroup">
              <InputText
                type="text"
                className="filter-input"
                placeholder="Search by address"
                onChange={(e) => onFilterInputChange('address', e.target.value)}
              />
              <Dropdown
                value={filters.address.matchMode}
                options={filterMatchModeOptions}
                onChange={(e) =>
                  onColumnFilterChange(
                    'address',
                    filters.address.value,
                    e.target.value
                  )
                }
              />
            </div>
          )}
          loading={addressLoading}
          matchMode={filters.address.matchMode}
        />
        <Column
          field="phoneNo"
          header="Phone"
          sortable
          filter
          filterPlaceholder="Search by phone"
          filterElement={() => (
            <div className="p-inputgroup">
              <InputText
                type="text"
                className="filter-input"
                placeholder="Search by phone"
                onChange={(e) => onFilterInputChange('phoneNo', e.target.value)}
              />
              <Dropdown
                value={filters.phoneNo.matchMode}
                options={filterMatchModeOptions}
                onChange={(e) =>
                  onColumnFilterChange(
                    'phoneNo',
                    filters.phoneNo.value,
                    e.target.value
                  )
                }
              />
            </div>
          )}
          loading={phoneLoading}
          matchMode={filters.phoneNo.matchMode}
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
        {totalRecords !== null || totalRecords >= 0 ? (
          <Paginator
            first={first}
            rows={rows}
            totalRecords={totalRecords}
            rowsPerPageOptions={rowsPerPageOptions}
            onPageChange={onPageChange}
          />
        ) : null}
      </div>
    </div>
  )
}

export default LazyLoadedDataTable
