import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { Button, InputBase } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from 'moment';
import axios from 'axios';
import Header from '../components/Header';
import { DataGrid } from 'devextreme-react';
import { HeaderFilter, LoadPanel, Paging, Column, Selection, MasterDetail, Pager } from 'devextreme-react/data-grid';
import '../App.css';

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    textAlign: "center",
    alignItems: "center",
    minWidth: '800px',
    fontFamily: 'Helvetica',
    fontSize: '14px',
    height: "67vh",
  },
  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    textAlign: "center",
    alignItems: "center",
    minWidth: '800px',
    padding: '20px',
    backgroundColor: "#fff2ee"
  },
  smallContainer: {
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  input: {
    border: '1px solid lightgray',
    paddingLeft: '15px',
    borderRadius: '0',
    width: '500px',
    backgroundColor: '#fff'
  },
  locationContainer: {
    marginTop: '50px',
    marginBottom: '25px'
  },
  location: {
    color: "#f15a24 !important",
    background: "#FFFFFF",
    fontWeight: 600,
    padding: "10px",
    display: "inline-block",
    border: "2px solid #f15a24",
    width: "150px",
    borderRadius: "5px 0 0 5px",
    "&:hover": {
      backgroundColor: "coral",
      border: "2px solid coral",
      color: "#fff !important"
    },
  },
  selectedLocation: {
    color: "#fff !important",
    background: "#f15a24",
    fontWeight: 600,
    padding: "10px",
    display: "inline-block",
    border: "2px solid #f15a24",
    width: "150px",
    borderRadius: "0 5px 5px 0",
    "&:hover": {
      backgroundColor: "#f15a24",
    },
  },
  button: {
    color: "#fff !important",
    background: "#f15a24",
    fontWeight: 400,
    display: "inline-block",
    width: "100px",
    height: "30px",
    "&:hover": {
      backgroundColor: "coral",
      color: "#fff !important"
    },
  },
  quoteBoxBG: {
    backgroundColor: '#eff4f7',
    width: '100%',
    height: '100%'
  },
}));

export default function Search() {
  const classes = useStyles();
  const history = useHistory();
  const [searchStr, setSearchStr] = useState('');
  const [selectedRowId, setSelectedRowId] = useState('');
  const [allQuotes, setAllQuotes] = useState([]);

  const getAllQuotes = async () => {
    let localAllQuotes = [];
    setSelectedRowId('');
    if (searchStr !== '') {
      await axios
        .get(`https://api.chucknorris.io/jokes/search?query=` + searchStr, {
          headers: {
            'accept': 'application/json',
          },
        })
        .then(({ data }) => {
          data.result = data.result.map(line => ({
            ...line,
            allCategories: line.categories.join(),
            createdFormat: moment(new Date(line.created_at)).format("MMM Do, YYYY hh:mm:ss a")
          }));
          data.result.sort((a, b) => (a.createdFormat > b.createdFormat) ? 1 : ((b.createdFormat > a.createdFormat) ? -1 : 0));
          localAllQuotes = data.result;
        })
        .catch((error) => {
          alert('Something went wrong getting the quote: ', error);
        });
    }
    setAllQuotes(localAllQuotes);
  }

  const goToRandom = async () => {
    history.push(`/`);
  }

  const goToSearch = async () => {
    history.push(`/search`);
  }

  function renderDetail(line) {
    return (
      <div className={classes.quoteBoxBG}>
        <div className={"quoteContainereSearch"}>
          <div className={"quoteFrameSearch"}>
            {line.data.data.value}
          </div>
        </div>
      </div>
    );
  };


  return (
    <>
      <Header />
      <div className={classes.container}>
        <div className={classes.locationContainer}>
          <button variant="contained" className={classes.location} onClick={() => goToRandom()}>
            Random
          </button>
          <button variant="contained" className={classes.selectedLocation} onClick={() => goToSearch()}>
            Search
          </button>
        </div>
        <div className={classes.fieldContainer}>
          <div className={classes.smallContainer}>
            <div>Key word(s)&nbsp;&nbsp;&nbsp;&nbsp;</div>
            <InputBase
              className={classes.input}
              placeholder="e.g egg, break, Chuck Norris, dumb"
              inputProps={{ "aria-label": "enter your name" }}
              onChange={(event) => setSearchStr(event.target.value)}
              onKeyPress={event => event.key === 'Enter' ? getAllQuotes() : null}
            />
          </div>
          <Button variant="contained" className={classes.button} onClick={() => getAllQuotes()}>
            Go!
          </Button>
        </div>
        {allQuotes.length > 0 &&
          <DataGrid
              dataSource={allQuotes}
              activeStateEnabled={false}
              showColumnLines={false}
              showRowLines={true}
              showBorders={false}
              showIndicator={true}
              allowColumnResizing={false}
              allowColumnReordering={false}
              width={'800px'}
              onRowClick={(e) => {
                // the click should only work if the row ISN'T a detail row
                if (e.rowType !== 'detail') {
                  e.component.collapseAll(-1);
                  if (selectedRowId !== e.key.id) {
                    e.component.expandRow(e.key);
                    setSelectedRowId(e.key.id);
                  }
                  if (selectedRowId === e.key.id) {
                    setSelectedRowId('');
                    e.component.deselectRows(e.component.getSelectedRowKeys());
                  }
                }
              }}
            >
              <LoadPanel enabled={true} />
              <HeaderFilter visible={true} />
              <Paging defaultPageSize={10} />
              <Pager
                showPageSizeSelector={true}
                allowedPageSizes={[5, 10, 20]}
                showInfo={true}
              />
              <Selection mode="single" />
              <Column dataField={'id'} caption={'ID'}></Column>
              <Column dataField={'allCategories'} caption={'Category'}
              ></Column>
              <Column dataField={'createdFormat'} caption={'Created at'}></Column>
              <MasterDetail
                enabled={false}
                component={e => renderDetail(e)}
              />
            </DataGrid>
        }
      </div>
    </>
  );
}
