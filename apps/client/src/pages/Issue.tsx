import { Form, FormOption, Text, VCOptions } from '@dvp/vc-ui';
import { Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BaseLayout } from '../layouts';
import {
  schema as partialCooSchema,
  schemaUI as partialCooSchemaUi,
} from './CreateForm/AANZFTACOOPartialSchema';
import {
  schema as fullCooSchema,
  schemaUI as fullCooSchemaUi,
} from './CreateForm/AANZFTACOOSchema';

export const Issue = () => {
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

  const goToForm = (form: Form, credentialType: any) => {
    navigate('/form', {
      state: {
        form,
        credentialType,
      },
    });
  };

  const handleFormSelected = (selectedForm: FormOption) => {
    const { partialForm, fullForm, formType, credentialType } = selectedForm;

    goToForm(
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      formType === 'partial' ? (partialForm as Form) : (fullForm as Form),
      credentialType
    );
  };

  return (
    <BaseLayout title="Form Select">
      <Text variant="h4" fontWeight="bold" paddingBottom="24px">
        Issue document
      </Text>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis
        molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
        fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
        elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
        lectus. Class aptent taciti sociosqu ad litora torquent per conubia
        nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
        egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse
        ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi
        convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
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
