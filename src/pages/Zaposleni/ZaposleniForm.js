import React, { useEffect, useState } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';
import Controls from '../../components/controls/Controls';
import { useForm, Form } from '../../components/useForm';
import Alert from '@material-ui/lab/Alert';

const initialFValues = {
  id: 0,
  ime: '',
  prezime: '',
  adresa: '',
  brojTelefona: '',
  vozilo: {},
  kategorije: [],
};

export default function ZaposleniForm(props) {
  const { recordForEdit } = props;

  const [regState, setRegState] = useState([]);

  const vozilaa = [];
  props.vozila.map((vozilo) =>
    vozilaa.push({
      id: vozilo.id,
      title: vozilo.model,
    })
  );

  const kategorijee = [];
  props.kategorije.map((kategorija) =>
    kategorijee.push({
      id: kategorija.id,
      title: kategorija.naziv,
    })
  );

  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ('ime' in fieldValues)
      temp.ime = fieldValues.ime ? '' : 'Ovo polje je obavezno!';
    if ('prezime' in fieldValues)
      temp.prezime = fieldValues.prezime ? '' : 'Ovo polje je obavezno!';
    if ('adresa' in fieldValues)
      temp.adresa = fieldValues.adresa ? '' : 'Ovo polje je obavezno!';
    if ('brojTelefona' in fieldValues)
      temp.brojTelefona =
        fieldValues.brojTelefona.length === 9 &&
        !isNaN(fieldValues.brojTelefona)
          ? ''
          : 'Telefonski broj mora imati devet cifara!';
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === '');
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

  function registracija() {
    if (regState === 'Greska!') {
      return <Alert severity='error'>{regState}</Alert>;
    } else if (regState === 'Uspjesno dodat zaposleni!') {
      return <Alert severity='success'>{regState}</Alert>;
    } else if (regState === 'Uspjesno azuriran zaposleni!') {
      return <Alert severity='success'>{regState}</Alert>;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      values.vozilo = { id: values.vozilo };

      let categories = [];
      // eslint-disable-next-line array-callback-return
      values.kategorije.map((kat) => {
        if (!kat.id) {
          categories.push({ id: kat });
        }
      });

      values.kategorije = categories;

      fetch(
        'http://localhost:8080/web_mobilne/rest/zaposleni/dodajZaposlenog',
        {
          method: 'POST',
          body: JSON.stringify(values),
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        }
      )
        .then((res) => {
          if (res) {
            res.text().then(function (text) {
              if (text === 'Uspjesno dodat zaposleni!') {
                setRegState('Uspjesno dodat zaposleni!');
              } else if (text === 'Uspjesno azuriran zaposleni!') {
                setRegState('Uspjesno azuriran zaposleni!');
              } else if (text === 'Greska!') {
                setRegState('Greska!');
                return;
              }
            });
          }
        })
        .catch(() => {
          setRegState('Greska!');
          return;
        });
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
    <CssBaseline>
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={6}>
            <Controls.Input
              name='ime'
              label='Ime'
              value={values.ime}
              onChange={handleInputChange}
              error={errors.ime}
            />
            <Controls.Input
              label='Prezime'
              name='prezime'
              value={values.prezime}
              onChange={handleInputChange}
              error={errors.prezime}
            />
            <Controls.Select
              name='vozilo'
              label='Vozilo'
              value={values.vozilo}
              onChange={handleInputChange}
              options={vozilaa}
            />
            <div>{registracija()}</div>
          </Grid>
          <Grid item xs={6}>
            <Controls.Input
              label='Adresa'
              name='adresa'
              value={values.adresa}
              onChange={handleInputChange}
              error={errors.adresa}
            />
            <Controls.Input
              label='Broj telefona'
              name='brojTelefona'
              value={values.brojTelefona}
              onChange={handleInputChange}
              error={errors.brojTelefona}
            />
            <Controls.Select
              multiple
              name='kategorije'
              label='Kategorije'
              value={values.kategorije}
              onChange={handleInputChange}
              options={kategorijee}
            />
            <div>
              <Controls.Button type='submit' text='Submit' />
              <Controls.Button
                text='Reset'
                color='default'
                onClick={resetForm}
              />
            </div>
          </Grid>
        </Grid>
      </Form>
    </CssBaseline>
  );
}
