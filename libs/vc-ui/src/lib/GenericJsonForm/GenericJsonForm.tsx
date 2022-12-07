import { JsonForms } from '@jsonforms/react';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { useState } from 'react';
import { Container } from '@mui/system';
import {
  createAjv,
  JsonSchema,
  UISchemaElement,
} from '@jsonforms/core';
import Typography from '@mui/material/Typography';
import { Alert, ThemeProvider, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ErrorObject } from 'ajv';
import { Renderers } from './Renders';
import { jsonFormTheme } from '../../theme';
import { JsonFormsErrorMapper } from './util';

interface genericJsonFormProps {
  schema: JsonSchema;
  uiSchema?: UISchemaElement;
  onSubmit: (data: any) => void;
  title: string;
  submitting: boolean;
  submissionError?: string;
  formData?: FormsData;
}

export interface FormsData {
  data?: any;
  errors?: ErrorObject<string, Record<string, any>, unknown>[] | undefined;
}

export const GenericJsonForm = ({
  schema,
  uiSchema,
  onSubmit,
  title,
  submitting,
  submissionError,
  formData,
}: genericJsonFormProps) => {
  const [formValues, setFormValues] = useState<FormsData>({ ...formData });
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const ajv = createAjv();

  const onFormUpdate = (formData: FormsData) => {
    setFormValues(formData);
    if (formData.errors && formData.errors.length === 0) {

      //Json forms dosnt do deep checks for requird. so this checks for that.
      const isValid = ajv.validate(schema, formData?.data);
      if (isValid) setIsFormValid(true);
      else setIsFormValid(false);

    } else setIsFormValid(false);
  };
  return (
    <Container sx={{  '@media (min-width:800px)': { width: '80%', }, marginBottom: "1em" }}>
      <Typography variant="h5">
        {title}
      </Typography>
      <Divider sx={{ marginTop: "0.5em", marginBottom: "0.5em" }}/>
      <ThemeProvider theme={jsonFormTheme}>
        <JsonForms
          ajv={ajv}
          schema={schema}
          data={formValues?.data}
          cells={materialCells}
          renderers={[...Renderers, ...materialRenderers]}
          uischema={uiSchema}
          onChange={({ data, errors }) => onFormUpdate({ data, errors })}
          i18n={{ translateError: JsonFormsErrorMapper }}
        />
      </ThemeProvider>
      {submissionError && <Alert severity="error">{submissionError}</Alert>}
      <LoadingButton
        disabled={!isFormValid}
        loading={submitting}
        onClick={() => onSubmit(formValues?.data)}
        variant="contained"
        sx={{ float: 'right', color: 'white', marginTop: "2em", marginBottom: "2em" }}
      >
        Submit
      </LoadingButton>
    </Container>
  );
};
