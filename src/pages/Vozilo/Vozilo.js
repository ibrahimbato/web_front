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
import VoziloFrom from '../Vozilo/VoziloForm';
import AddIcon from '@material-ui/icons/Add';
import Popup from '../../components/Popup';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ConfirmDialog from '../../components/controls/ConfirmDialog';

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
  { id: 'marka', label: 'MARKA' },
  { id: 'model', label: 'MODEL' },
  { id: 'godinaProizvodnje', label: 'GODINA PROIZVODNJE' },
  { id: 'registracija', label: 'REGISTRACIJA' },
  { id: 'actions', label: 'UREDJIVANJE', disableSorting: true },
];

export default function Vozilo() {
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

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);

  const fetchUrl = 'http://localhost:8080/web_mobilne/rest/vozilo/sva';

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
            x.model.toLowerCase().includes(target.value)
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
    console.log(item);
    fetch('http://localhost:8080/web_mobilne/rest/vozilo/obrisiVozilo', {
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
        <Paper className={classes.pageContent}>
          <Toolbar>
            <Controls.Input
              label='Pretraga vozila'
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
              text='Dodaj vozilo'
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
                  <TableCell align='center'>{item.marka} </TableCell>
                  <TableCell align='center'>{item.model} </TableCell>
                  <TableCell align='center'>{item.godinaProizvodnje}</TableCell>
                  <TableCell align='center'>{item.registracija} </TableCell>
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
                          title: 'Da li ste sigurni da zelite obrisati vozilo?',
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
          title='DODAVANJE VOZILA'
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <VoziloFrom recordForEdit={recordForEdit} />
        </Popup>
        <ConfirmDialog
          confirmDialog={confirmDialog}
          setConfirmDialog={setConfirmDialog}
        />
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity='success'>
            Vozilo uspjesno obrisano
          </Alert>
        </Snackbar>
      </CssBaseline>
    </>
  );
}
