import { schema, schemaUI } from "./AANZFTACOOSchema";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  ROUTES } from '../../constants';
import { GenericJsonForm } from '@dvp/vc-ui';
import { CreateVC } from "../../services/createVC";

export interface CreateFormPageProps {
  readonly formTitle: string;
}

export const CreateFormPage = ({formTitle} :CreateFormPageProps) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>();
  const navigate = useNavigate();

  const submitForm = (formValues: any) => {
    setSubmitting(true);
    const credentialSubject = {
      ...formValues
    }

    CreateVC(credentialSubject).then((response) => {
      setServerError(undefined);
      navigate(ROUTES.VIEWER, {
        state:{ document: { ...response.data.verifiableCredential}, results:{ errors: [] }, hideVerifyResults: true },
      });
    }).catch((_e) => {
      //Check server validations when avaliable
      setServerError('Somthing went wrong please try again later');
      setSubmitting(false);
    });
  };

  return (
    <GenericJsonForm
      schema={schema}
      uiSchema={schemaUI}
      onSubmit={submitForm}
      title={formTitle}
      submitting={submitting}
      submissionError={serverError}
    />
  );
};
