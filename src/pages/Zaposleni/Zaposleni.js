import {
  CssBaseline,
  InputAdornment,
  makeStyles,
  Paper,
  TableBody,
  TableCell,
  TableRow,
  Toolbar,
} from '@material-ui/core';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import useTable from '../../components/useTable';
import Controls from '../../components/controls/Controls';
import { Search } from '@material-ui/icons';
import ZaposleniForm from './ZaposleniForm';
import AddIcon from '@material-ui/icons/Add';
import Popup from '../../components/Popup';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';
import ConfirmDialog from '../../components/controls/ConfirmDialog';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Vozilo from '../Vozilo/Vozilo';

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: '50%',
  },
  newButton: {
    position: 'absolute',
    right: '10px',
  },
}));

const headCells = [
  { id: 'ime', label: 'IME' },
  { id: 'prezime', label: 'PREZIME' },
  { id: 'brojTelefona', label: 'TELEFON' },
  { id: 'adresa', label: 'ADRESA' },
  { id: 'vozilo', label: 'VOZILO' },
  { id: 'kategorija', label: 'KATEGORIJE' },
  { id: 'actions', label: 'UREDJIVANJE', disableSorting: true },
];

export default function Zaposleni() {
  const classes = useStyles();
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [records, setRecords] = useState([]);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [openPopup, setOpenPopup] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subTitle: '',
  });

  const [vozila, setVozila] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8080/web_mobilne/rest/vozilo/sva', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((resp) => setVozila(resp));
  }, [openPopup, confirmDialog]);

  const [kategorije, setKategorije] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8080/web_mobilne/rest/kategorije/sve', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((resp) => setKategorije(resp));
  }, []);

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);

  const fetchUrl = 'http://localhost:8080/web_mobilne/rest/zaposleni/svi';

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setRecords(request.data);
      return request;
    }
    fetchData();
  }, [openPopup, confirmDialog]);

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === '') return items;
        else
          return items.filter((x) =>
            x.ime.toLowerCase().includes(target.value)
          );
      },
    });
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  }

  const onDelete = (item) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    fetch('http://localhost:8080/web_mobilne/rest/zaposleni/obrisiZaposlenog', {
      method: 'POST',
      body: JSON.stringify(item),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => {
        if (res) {
          console.log('Zaposleni obrisan!');
          handleClick();
        }
      })
      .catch(() => {
        console.log('Greska!');
      });
  };

  return (
    <>
      <CssBaseline>
        <div className='header'>
          <div className='forImg'>
            <img src='employee.png' alt='' />
          </div>
          <h1 align='center' style={{ paddingTop: '10px', color: 'white' }}>
            VOZNI PARK EVIDENCIJA ZAPOSLENIH I VOZILA
          </h1>
          <div className='forImg'>
            <img src='racing.png' alt='' />
          </div>
        </div>
        <Paper className={classes.pageContent}>
          <Toolbar>
            <Controls.Input
              label='Pretraga zaposlenih'
              className={classes.searchInput}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search />
                  </InputAdornment>
                ),
              }}
              onChange={handleSearch}
            />
            <Controls.Button
              className={classes.newButton}
              text='Dodaj zaposlenog'
              variant='outlined'
              startIcon={<AddIcon />}
              onClick={() => {
                setOpenPopup(true);
                setRecordForEdit(null);
              }}
            />
          </Toolbar>
          <TblContainer>
            <TblHead />
            <TableBody>
              {recordsAfterPagingAndSorting().map((item) => (
                <TableRow key={item.id}>
                  <TableCell align='center'>{item.ime} </TableCell>
                  <TableCell align='center'>{item.prezime} </TableCell>
                  <TableCell align='center'>{item.brojTelefona} </TableCell>
                  <TableCell align='center'>{item.adresa} </TableCell>
                  <TableCell align='center'>
                    {item.vozilo.model} {item.vozilo.registracija}
                  </TableCell>
                  <TableCell align='center'>
                    {item.kategorije.map((el) => (
                      <div>{el.naziv}</div>
                    ))}
                  </TableCell>
                  <TableCell align='center'>
                    <Controls.ActionButton
                      id='actions'
                      color='primary'
                      onClick={() => {
                        openInPopup(item);
                      }}
                    >
                      <EditOutlinedIcon fontSize='small' />
                    </Controls.ActionButton>
                    <Controls.ActionButton
                      color='secondary'
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          title:
                            'Da li ste sigurni da zelite obrisati zaposlenog?',
                          subTitle: 'Ova radnja se ne moze opozvati!',
                          onConfirm: () => {
                            onDelete(item);
                          },
                        });
                      }}
                    >
                      <CloseIcon fontSize='small' />
                    </Controls.ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TblContainer>
          <TblPagination />
        </Paper>
        <Popup
          title='DODAVANJE ZAPOSLENOG'
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <ZaposleniForm
            recordForEdit={recordForEdit}
            vozila={vozila}
            kategorije={kategorije}
          />
        </Popup>
        <ConfirmDialog
          confirmDialog={confirmDialog}
          setConfirmDialog={setConfirmDialog}
        />
        <Vozilo />
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity='success'>
            Zaposleni uspjesno obrisan
          </Alert>
        </Snackbar>
      </CssBaseline>
    </>
  );
}
