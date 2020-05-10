import React from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Column, Table, SortDirection, SortIndicator } from 'react-virtualized';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Styles from './MyDynamicColumnTable.module.css';
import { getApiData } from '../api/pixabayApi';

export default class MyFeatureTable extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    const list = [];
    const sortBy = 'index';
    const sortDirection = SortDirection.ASC;
    const filteredList = list;
    const sortedList = this._sortList({filteredList, sortBy, sortDirection});

    this.state = {
      disableHeader: false,
      headerHeight: 30,
      height: 270,
      overscanRowCount: 10,
      rowHeight: 20,
      scrollToIndex: undefined,
      sortBy,
      sortDirection,
      list,
      filteredList,
      sortedList,
      useDynamicRowHeight: true,
      apiSearchText: '',
      filterText: '',
      columns: [],
      apiErrorMessage: '',
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
      overscanRowCount,
      scrollToIndex,
      sortBy,
      sortDirection,
      sortedList,
    } = this.state;

    const rowGetter = ({index}) => {
      return this._getDatum(sortedList, index);
    }
  
    return (
      <>
      <Form onSubmit={this.handleSubmit}>
        <Form.Row>
          <Form.Group controlId="searchText" className={Styles.searchInputArea}>
            <InputGroup>
              <InputGroup.Prepend style={{height: '25px'}}>
                <InputGroup.Text><span role="img" aria-label="search">🌐</span></InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control type="text"
                onChange={this.onApiSearchTextChanged} 
                placeholder="Enter Search" 
                style={{height: '25px', fontSize: '15px', marginRight: '3px'}}
              />
              <Button onClick={this.onApiSearch}
                style={{height: '25px', lineHeight: '0.5'}}
              >
                Search
              </Button>
              <span style={{color: 'red'}}>{this.state.apiErrorMessage}</span>
            </InputGroup>
            <div className="col-1"/>
            <InputGroup>
              <InputGroup.Prepend style={{height: '25px'}}>
                <InputGroup.Text><span role="img" aria-label="search">🔍</span></InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control type="text"
                onChange={this.onFilterChanged} 
                placeholder="Enter Filter" 
                style={{height: '25px', fontSize: '15px', marginRight: '3px'}}
              />
            </InputGroup>
          </Form.Group>
        </Form.Row>
      </Form>
      <AutoSizer>
        { (params) => {
          const {width, height} = params;
          //console.log('params:', params);
          return (
            <Table
              disableHeader={disableHeader}
              headerClassName={Styles.headerColumn}
              headerHeight={headerHeight}
              height={height}
              noRowsRenderer={this._noRowsRenderer}
              overscanRowCount={overscanRowCount}
              rowClassName={this._rowClassName}
              rowHeight={20}
              rowGetter={rowGetter}
              rowCount={this.state.sortedList.length}
              scrollToIndex={scrollToIndex}
              sort={this._sort}
              sortBy={sortBy}
              sortDirection={sortDirection}
              width={width}
            >
              {
                this.state.columns.map((col, k) => {
                  if (k>10) {
                    return null;
                  }
                  return (
                  <Column key={k}
                    label={col.label}
                    dataKey={col.dataKey}
                    width={col.width}
                  />
                )})
              }
            </Table>
          )}
        }
        </AutoSizer>
        </>
      );
  }

  _getDatum(list, index) {
    return this.state.sortedList[index % this.state.sortedList.length];
  }

  _getRowHeight({index}) {
    let cellValue = this._getDatum(this.state.sortedList, index);
    if (cellValue.name.length > 15) {
      return 40;
    }
    return 20;
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
    return <div className={Styles.noRows}>No rows</div>;
  }

  _rowClassName({index}) {
    if (index < 0) {
      return Styles.headerRow;
    } else {
      return index % 2 === 0 ? Styles.evenRow : Styles.oddRow;
    }
  }

  _sort({sortBy, sortDirection}) {
    const sortedList = this._sortList({filteredList: this.state.filteredList, sortBy, sortDirection});

    this.setState({sortBy, sortDirection, sortedList});
  }

  _sortList({filteredList, sortBy, sortDirection}) {
    let newList = filteredList.sort((a, b) => {      
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

  handleSubmit = (event) => {
    event.preventDefault();
  };

  containsFilterText = (item, aFilterText) => {
    if (aFilterText == null) {
      return true;
    }
    const filterText = aFilterText.toLowerCase();
    let found = false;
    Object.keys(item).forEach(function(key,index) {
      if (found || key === '_id') {
        return;
      }
      let val = item[key].toString().toLowerCase();
      if (val.includes(filterText)) {
        console.log('val:', val, filterText, item);
        found = true;
        return;
      }
    });
    return found;
  }

  onApiSearchTextChanged = (event) => {
    const apiSearchText = event.target.value;
    this.setState({ apiSearchText  });
  }

  onApiSearch = () => {
    this.setState({ apiErrorMessage: '' });

    const cbSuccess = (newList) => {
      if (newList.length === 0) {        
        this.setState({ apiErrorMessage: 'No hits!' });
        return;
      }
      this.refreshColumns(newList[0]);
      this.setState({ list: newList });
      this.refreshLists(newList, this.state.filterText);  
    }

    const cbError = err => {
      this.setState({ apiErrorMessage: err });
      console.log(err);
    }

    getApiData(this.state.apiSearchText, cbSuccess, cbError);
  }

  refreshColumns = (firstListItem) => {
    let columns = [];
    Object.keys(firstListItem).forEach(function(key,index) {
      if (key === '_id') {
        return;
      }
      columns.push({
        label: key.toUpperCase(),
        dataKey: key,
        width: 150,
      });
    });
    this.setState({ columns });
  }

  onFilterChanged = (event) => {
    const filterText = event.target.value;
    this.setState({filterText});
    this.refreshLists(this.state.list, filterText);
  }

  refreshLists = (list, filterText) => {
    let filteredList = list.filter(item => this.containsFilterText(item, filterText));
    let sortedList = this._sortList({
      filteredList, 
      sortBy: this.state.sortBy, 
      sortDirection: this.state.sortDirection
    });
    this.setState({ filteredList, sortedList  });
  }
}