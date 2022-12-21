/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { FormSelect } from '@dvp/vc-ui';
import { Grid, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  schema as partialCooSchema,
  schemaUI as partialCooSchemaUi,
} from './CreateForm/AANZFTACOOPartialSchema';
import {
  schema as fullCooSchema,
  schemaUI as fullCooSchemaUi,
} from './CreateForm/AANZFTACOOSchema';
import { Form, FormOption } from '@dvp/vc-ui';
import { ChooseForm } from '@dvp/vc-ui';

export const Issue = () => {
  const [formSelected, setFormSelected] = useState<FormOption>();

  // TODO: Request forms from the backend.
  const forms = [
    {
      id: '001',
      name: 'AANZFTA-COO',
      fullForm: { schema: fullCooSchema, uiSchema: fullCooSchemaUi },
      partialForm: { schema: partialCooSchema, uiSchema: partialCooSchemaUi },
    },
  ];

  const navigate = useNavigate();

  const goToForm = (form: Form) => {
    if (form) {
      navigate('/form', {
        state: {
          form,
        },
      });
    }
  };

  useEffect(() => {
    const { partialForm, fullForm } = formSelected ?? {};
    if (formSelected && (!partialForm || !fullForm)) {
      goToForm(partialForm ? partialForm : (fullForm as Form));
    }
  }, [formSelected]);

  const handleFormSelected = (selectedForm: FormOption) => {
    setFormSelected(selectedForm);
  };

  return (
    <Grid container>
      <Grid item display={'flex'} justifyContent={'center'} width={'100%'}>
        <Paper
          sx={{
            width: '100%',
            maxWidth: '38rem',
            padding: '20px',
            marginTop: '15rem',
          }}
        >
          {!formSelected ? (
            <FormSelect forms={forms} onFormSelected={handleFormSelected} />
          ) : (
            <ChooseForm form={formSelected} onSelected={goToForm} />
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};
