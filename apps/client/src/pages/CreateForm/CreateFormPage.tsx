import { CredentialSubject } from '@dvp/api-interfaces';
import { GenericJsonForm } from '@dvp/vc-ui';
import { Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { BaseLayout } from '../../layouts';
import { issue } from '../../services';

export interface CreateFormPageProps {
  readonly title: string;
  readonly subTitle?: string;
}

export const CreateFormPage = ({ title, subTitle }: CreateFormPageProps) => {
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
    const credentialSubject: CredentialSubject = {
      ...formValues,
    };

    issue(
      credentialSubject,
      state?.credentialType as string,
      state?.formName as string,
      state?.formType as string
    )
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
        //Check server validations when available
        setServerError('Something went wrong. Please try again later');
        setSubmitting(false);
      });
  };

  return (
    <BaseLayout title="Issue Form">
      <Paper
        sx={{
          position: 'relative',
        }}
      >
        <GenericJsonForm
          schema={state?.form?.schema}
          uiSchema={state?.form?.uiSchema}
          onSubmit={submitForm}
          title={title}
          subTitle={subTitle}
          submitting={submitting}
          submissionError={serverError}
        />
      </Paper>
    </BaseLayout>
  );
};
