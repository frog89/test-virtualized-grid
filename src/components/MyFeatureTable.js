import React from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Column, Table, SortDirection, SortIndicator} from 'react-virtualized';
import styles from './MyFeatureTable.module.css';
import data from '../data.json';

let list = data[0];

export default class MyFeatureTable extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    const sortBy = 'index';
    const sortDirection = SortDirection.ASC;
    const sortedList = this._sortList({sortBy, sortDirection});

    this.state = {
      disableHeader: false,
      headerHeight: 30,
      height: 270,
      hideIndexRow: false,
      overscanRowCount: 10,
      rowHeight: 40,
      scrollToIndex: undefined,
      sortBy,
      sortDirection,
      sortedList,
      useDynamicRowHeight: false,
    };

    this._getRowHeight = this._getRowHeight.bind(this);
    this._headerRenderer = this._headerRenderer.bind(this);
    this._noRowsRenderer = this._noRowsRenderer.bind(this);
    this._rowClassName = this._rowClassName.bind(this);
    this._sort = this._sort.bind(this);
  }

  render() {
    const {
      disableHeader,
      headerHeight,
      height,
      hideIndexRow,
      overscanRowCount,
      rowHeight,
      scrollToIndex,
      sortBy,
      sortDirection,
      sortedList,
      useDynamicRowHeight,
    } = this.state;

    const rowGetter = ({index}) => {
      return this._getDatum(sortedList, index);
    }
  
    const getIndexCellData = ({rowData}) => {
      //console.log('getIndexCellData-params:', rowData);
      return rowData.index;
    }
  
    const getCompanyCellRenderer = ({
      cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex
    }) => {
      const data = isScrolling ? '...' :
        rowData[dataKey];
      return (
        <div className={styles.divCompany}>
          {data}
        </div>
      );
    }
  
    return (
      <AutoSizer>
        { (params) => {
          const {width, height} = params;
          //console.log('params:', params);
          return (
            <Table
              disableHeader={disableHeader}
              headerClassName={styles.headerColumn}
              headerHeight={headerHeight}
              height={height}
              noRowsRenderer={this._noRowsRenderer}
              overscanRowCount={overscanRowCount}
              rowClassName={this._rowClassName}
              rowHeight={useDynamicRowHeight ? this._getRowHeight : rowHeight}
              rowGetter={rowGetter}
              // rowGetter={({index}) => list[index]}
              rowCount={list.length}
              scrollToIndex={scrollToIndex}
              sort={this._sort}
              sortBy={sortBy}
              sortDirection={sortDirection}
              width={width}
            >
              {!hideIndexRow && (
                <Column
                  label="Index"
                  dataKey="index"
                  disableSort={!this._isSortEnabled()}
                  headerRenderer={this._headerRenderer}
                  cellDataGetter={getIndexCellData}
                  width={80}
                />
              )}
              <Column
                label="Full Name"
                dataKey="name"
                disableSort={!this._isSortEnabled()}
                headerRenderer={this._headerRenderer}
                width={120}
              />
              <Column
                width={210}
                disableSort
                label="This is my pretty company name"
                dataKey="company"
                className={styles.exampleColumn}
                cellRenderer={getCompanyCellRenderer}
                flexGrow={1}
              />
            </Table>
          )}
        }
        </AutoSizer>
      );
  }

  _getDatum(list, index) {
    return list[index % list.length];
  }

  _getRowHeight({index}) {
    return this._getDatum(list, index).length;
  }

  _headerRenderer(params) {
    //console.log('_headerRenderer:', params);
    const { label, dataKey, sortBy, sortDirection} = params;
    return (
      <div>
        {label}
        {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
      </div>
    );
  }

  _isSortEnabled() {
    return true;
  }

  _noRowsRenderer() {
    return <div className={styles.noRows}>No rows</div>;
  }

  _rowClassName({index}) {
    if (index < 0) {
      return styles.headerRow;
    } else {
      return index % 2 === 0 ? styles.evenRow : styles.oddRow;
    }
  }

  _sort({sortBy, sortDirection}) {
    const sortedList = this._sortList({sortBy, sortDirection});

    this.setState({sortBy, sortDirection, sortedList});
  }

  _sortList({sortBy, sortDirection}) {
    let newList = list.sort((a, b) => {      
      let dir = sortDirection === SortDirection.ASC ? 1 : -1;
      if (a[sortBy] > b[sortBy]) {
        return 1 * dir;
      } else if (a[sortBy] < b[sortBy]) {
        return -1 * dir;
      }
      return 0;      
    });
    return newList;
  }

  _updateUseDynamicRowHeight(value) {
    this.setState({
      useDynamicRowHeight: value,
    });
  }
}