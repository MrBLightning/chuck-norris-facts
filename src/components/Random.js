import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Button, FormControl, InputBase, Select, MenuItem, ListItemText, Checkbox, Input, InputLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios';
import Header from '../components/Header';
import '../App.css';

const useStyles = makeStyles(() => ({
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
    overflow: 'hidden'
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
  input: {
    border: '1px solid lightgray',
    paddingLeft: '15px',
    borderRadius: '0',
    width: '200px',
    backgroundColor: '#fff'
  },
  select: {
    border: '1px solid lightgray',
    borderRadius: '0',
    width: '200px',
    maxHeight: '50px',
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
    borderRadius: "0 5px 5px 0",
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
    borderRadius: "5px 0 0 5px",
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
  selectTag: {
    color: "#aaa",
    opacity: 0.8,
    paddingLeft: '15px',
    marginTop:'-14px',
    zIndex: 10,
  }
}));

export default function Random() {
  const classes = useStyles();
  const history = useHistory();
  const [name, setName] = useState('');
  const [category, setCategory] = useState([]);
  const [quote, setQuote] = useState('');
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`https://api.chucknorris.io/jokes/categories`, {
        headers: {
          'accept': 'application/json',
        },
      })
      .then(({ data }) => {
        setAllCategories(data);
      })
      .catch((error) => {
        alert('Something went wrong getting the categories: ', error);
      });
  }, []);

  const generateQuote = async () => {
    let localQuote = '';
    if (category.length > 0) {
      await axios
        .get(`https://api.chucknorris.io/jokes/random?category=` + category.join(","), {
          headers: {
            'accept': 'application/json',
          },
        })
        .then(({ data }) => {
          localQuote = data.value;
        })
        .catch((error) => {
          alert('Something went wrong getting the quote: ', error);
        });
    } else {
      await axios
        .get(`https://api.chucknorris.io/jokes/random`, {
          headers: {
            'accept': 'application/json',
          },
        })
        .then(({ data }) => {
          localQuote = data.value;
        })
        .catch((error) => {
          alert('Something went wrong getting the quote: ', error);
        });
    }
    if (name !== '') {
      localQuote = localQuote.replace('Chuck Norris', name);
    }
    if (localQuote.length > 300) {
      generateQuote();
    } else {
      setQuote(localQuote);
    }
  }

  const goToRandom = async () => {
    history.push(`/`);
  }

  const goToSearch = async () => {
    history.push(`/search`);
  }

  return (
    <>
      <Header />
      <div className={classes.container}>
        <div className={classes.locationContainer}>
          <button variant="contained" className={classes.selectedLocation} onClick={() => goToRandom()}>
            Random
          </button>
          <button variant="contained" className={classes.location} onClick={() => goToSearch()}>
            Search
          </button>
        </div>
        <div className={classes.fieldContainer}>
          <div>Your name</div>
          <InputBase
            className={classes.input}
            placeholder="e.g Chuck Norris"
            inputProps={{ "aria-label": "enter your name" }}
            onChange={(event) => setName(event.target.value)}
            onKeyPress={event => event.key === 'Enter' ? generateQuote() : null}
          />
          <div>Category</div>
          <FormControl>
            <Select
              input={<Input id="select-multiple-checkbox" />}
              className={classes.select}
              value={category}
              renderValue={(selected) => selected.join(', ')}
              multiple
              disableUnderline
              onChange={(event) => setCategory(event.target.value)}
            >
              {allCategories.map((selection) => (
                <MenuItem key={"Category_" + Math.random()} value={selection}>
                  <Checkbox checked={category.indexOf(selection) > -1} />
                  <ListItemText primary={selection} />
                </MenuItem>
              ))}
            </Select>
            <InputLabel shrink={false} htmlFor="select-multiple-checkbox" className={classes.selectTag}>
              {category.length > 0 ? undefined : 'Pick categories'}
            </InputLabel>
          </FormControl>
          <Button variant="contained" className={classes.button} onClick={() => generateQuote()}>
            Go!
          </Button>
        </div>
        {quote !== '' &&
          <div className={"quoteContainer"}>
            <div className={"quoteFrame"}>
              {quote}
            </div>
          </div>}
      </div>
    </>
  );
}