import React, {useState, useEffect} from 'react';
import {DataTable} from 'react-native-paper';

function Datatable({header, datatable = [], page = 1, perPage = 5, style}) {
  const [state, setState] = useState({
    datatable,
    page: page - 1,
    perPage,
    numberOfPages: Math.ceil(datatable.length / perPage),
  });

  const getValue = (object, path) => {
    return path
      .replace(/\[/g, '.')
      .replace(/\]/g, '')
      .split('.')
      .reduce((o, k) => (o || {})[k], object);
  };

  return (
    <DataTable style={style}>
      <DataTable.Header>
        {header.map((item, i) => {
          let sortDirection = item.sortDirection ? item.sortDirection : false;

          return (
            <DataTable.Title key={i} sortDirection={sortDirection}>
              {item.name}
            </DataTable.Title>
          );
        })}
      </DataTable.Header>

      {state.datatable
        .slice(state.perPage * state.page, state.perPage * (state.page + 1))
        .map((item, i) => {
          return (
            <DataTable.Row key={i}>
              {header.map((headerItem, j) => {
                return (
                  <DataTable.Cell key={j}>
                    {getValue(item, headerItem.attr)}
                  </DataTable.Cell>
                );
              })}
            </DataTable.Row>
          );
        })}

      <DataTable.Pagination
        page={state.page}
        numberOfPages={state.numberOfPages}
        onPageChange={page => {
          setState({...state, page});
        }}
        label={state.page + 1 + ' of ' + state.numberOfPages}
      />
    </DataTable>
  );
}

export default Datatable;
