import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';

import { fetchServer } from './AuthServer';

export default function DataTable(props) {
  const [query, setQuery] = useState(null)
  const [loading, setLoading] = useState(true)
  const { columns, api_url, sx } = {...props}

  useEffect(() => {
    fetchServer('GET', api_url, null, (res, status) => {
      if (status === 200) {
        props.setRows(res);
      } else {
        console.error(res.detail);
      }
      setLoading(false);
    })
  }, [query]);

  function searchQuery(e) {
    const value = e.target.value
    setQuery(value)
  }

  function CustomToolbar(props) {
    return (
      <GridToolbarContainer sx={{ px:2, justifyContent:'space-between' }} >
        <GridToolbarExport color='secondary'/>
        <GridToolbarQuickFilter color='secondary' sm={{ width: '50%'}} />
      </GridToolbarContainer>
    );
  }

  function CustomHeader(props) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent:'space-between', align:'center', ...props.titleProps}}>
          <Typography color='secondary' variant='h6'>{props.title}</Typography>
          { true && props.addButton }
        </Box>
        {/* <Divider sx={{ borderBottomWidth: 3 }}/> */}
        <Divider sx={{ bgcolor: 'secondary.dark' }}/>
        <CustomToolbar/>
        <Divider sx={{ bgcolor: 'secondary.dark' }}/>
      </Box>
    );
  }

  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
      <Pagination
        color='secondary'
        sx={{ p:2 }}
        count={pageCount}
        page={page + 1}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
      />
    );
  }

  if (loading) {
    return (<p>Loading...</p>)
  }
  return (
    <Box>
      { props.rows ?
        <DataGrid
          sx={sx}
          rows={props.rows}
          columns={columns}
          density="standard"
          loading={false}
          pageSize={20} autoHeight
          // checkboxSelection disableSelectionOnClick
          components={{
            Toolbar: CustomToolbar,
            Pagination: CustomPagination,
            Header: CustomHeader,
          }}
          componentsProps={{
            header: {...props},
          }}
        />
        : null
      }
    </Box>
  )
};
