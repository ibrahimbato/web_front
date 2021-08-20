import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import Controls from '../../components/controls/Controls';
import { useForm, Form } from '../../components/useForm';
import Alert from '@material-ui/lab/Alert';

const initialFValues = {
  id: 0,
  marka: '',
  model: '',
  godinaProizvodnje: '',
  registracija: '',
};

export default function InstruktorForm(props) {
  //eslint-disable-next-line
  const { addOrEdit, recordForEdit } = props;

  const [regState, setRegState] = useState([]);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('marka' in fieldValues)
      temp.marka = fieldValues.marka ? '' : 'Ovo polje je obavezno!';
    if ('model' in fieldValues)
      temp.model = fieldValues.model ? '' : 'Ovo polje je obavezno!';
    if ('godinaProizvodnje' in fieldValues)
      temp.godinaProizvodnje = fieldValues.godinaProizvodnje
        ? ''
        : 'Ovo polje je obavezno!';
    if ('registracija' in fieldValues)
      temp.registracija = fieldValues.registracija
        ? ''
        : 'Ovo polje je obavezno!';

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === '');
  };

  function registracija() {
    if (regState === 'Greska!') {
      return <Alert severity='error'>{regState}</Alert>;
    } else if (regState === 'Uspjesno dodato vozilo!') {
      return <Alert severity='success'>{regState}</Alert>;
    } else if (regState === 'Uspjesno azurirano vozilo!') {
      return <Alert severity='success'>{regState}</Alert>;
    }
  }

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      fetch('http://localhost:8080/web_mobilne/rest/vozilo/dodajVozilo', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
        .then((res) => {
          if (res) {
            res.text().then(function (text) {
              if (text === 'Uspjesno dodato vozilo!') {
                setRegState('Uspjesno dodato vozilo!');
              } else if (text === 'Uspjesno azurirano vozilo!') {
                setRegState('Uspjesno azurirano vozilo!');
              } else if (text === 'Greska!') {
                setRegState('Greska!');
              }
            });
          }
        })
        .catch(() => {
          setRegState('Greska!');
        });
      //  addOrEdit();
    }
  };

  useEffect(() => {
    if (recordForEdit != null)
      setValues({
        ...recordForEdit,
      });
    // eslint-disable-next-line
  }, [recordForEdit]);

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={6}>
          <Controls.Input
            name='marka'
            label='Marka'
            value={values.marka}
            onChange={handleInputChange}
            error={errors.marka}
          />
          <Controls.Input
            name='model'
            label='Model'
            value={values.model}
            onChange={handleInputChange}
            error={errors.model}
          />
          <Controls.Input
            label='GODINA PROIZVODNJE'
            name='godinaProizvodnje'
            value={values.godinaProizvodnje}
            onChange={handleInputChange}
            error={errors.godinaProizvodnje}
          />

          <div>{registracija()}</div>
        </Grid>
        <Grid item xs={6}>
          <Controls.Input
            label='Registracija'
            name='registracija'
            value={values.registracija}
            onChange={handleInputChange}
            error={errors.registracija}
          />

          <div>
            <Controls.Button type='submit' text='Submit' />
            <Controls.Button text='Reset' color='default' onClick={resetForm} />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
