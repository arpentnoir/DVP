import { Form, FormOption, Text, VCOptions } from '@dvp/vc-ui';
import { Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BaseLayout } from '../../layouts';
import {
  schema as partialCooSchema,
  schemaUI as partialCooSchemaUi,
} from '../CreateForm/AANZFTACOOPartialSchema';
import {
  schema as fullCooSchema,
  schemaUI as fullCooSchemaUi,
} from '../CreateForm/AANZFTACOOSchema';

export const Issue = () => {
  // TODO: Request forms from the backend.
  const forms = [
    {
      id: '001',
      name: 'AANZFTACoO',
      displayName: 'AANZFTA-COO',
      fullForm: { schema: fullCooSchema, uiSchema: fullCooSchemaUi },
      partialForm: { schema: partialCooSchema, uiSchema: partialCooSchemaUi },
    },
  ];

  const navigate = useNavigate();

  const goToForm = (
    form: Form,
    credentialType: any,
    name: string,
    formType?: string
  ) => {
    navigate('/form', {
      state: {
        form,
        credentialType,
        formName: name,
        formType,
      },
    });
  };

  const handleFormSelected = (selectedForm: FormOption) => {
    const { partialForm, fullForm, formType, credentialType, name } =
      selectedForm;

    goToForm(
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      formType === 'partial' ? (partialForm as Form) : (fullForm as Form),
      credentialType,
      name,
      formType
    );
  };

  return (
    <BaseLayout title="Form Select">
      <Text
        variant="h1"
        fontWeight="bold"
        paddingBottom="24px"
        data-testid="issue-header"
      >
        Issue document
      </Text>
      <Text>
        Issue your Document as a Verifiable Credential. Select the options for
        your document below.
      </Text>
      <Grid container>
        <Grid item display={'flex'} justifyContent={'center'} width={'100%'}>
          <Paper
            sx={{
              width: '100%',
              maxWidth: '38rem',
              padding: { xs: '20px', md: '56px' },
            }}
          >
            <VCOptions forms={forms} onFormSelected={handleFormSelected} />
          </Paper>
        </Grid>
      </Grid>
    </BaseLayout>
  );
};
