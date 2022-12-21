import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Paper } from '@mui/material';
import { GenericJsonForm } from '@dvp/vc-ui';
import { IssueVC } from '../../services/issueVC';
import { ROUTES } from '../../constants';

export interface CreateFormPageProps {
  readonly formTitle: string;
}

export const CreateFormPage = ({ formTitle }: CreateFormPageProps) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>();

  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  useEffect(() => {
    if (!state?.form?.schema && !state?.form?.uiSchema) {
      navigate(ROUTES.ISSUE);
    }
  }, []);

  const submitForm = (formValues: any) => {
    setSubmitting(true);
    const credentialSubject = {
      ...formValues,
    };

    IssueVC(credentialSubject)
      .then((response) => {
        setServerError(undefined);
        navigate(ROUTES.VIEWER, {
          state: {
            document: { ...response.data.verifiableCredential },
            results: { errors: [] },
            hideVerifyResults: true,
            viewer: response.data.verifiableCredential.credentialSubject
              .originalDocument
              ? 'PDF-VIEW'
              : '',
          },
        });
      })
      .catch((_e) => {
        //Check server validations when avaliable
        setServerError('Somthing went wrong please try again later');
        setSubmitting(false);
      });
  };

  return (
    <Box marginTop={'6rem'} marginBottom={'6rem'}>
      <Paper
        sx={{
          position: 'relative',
          paddingTop: '2.5rem',
          paddingBottom: '2.5rem',
        }}
      >
        <GenericJsonForm
          schema={state?.form?.schema}
          uiSchema={state?.form?.uiSchema}
          onSubmit={submitForm}
          title={formTitle}
          submitting={submitting}
          submissionError={serverError}
        />
      </Paper>
    </Box>
  );
};
