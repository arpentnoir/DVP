import { Box, Button, Typography } from '@mui/material';
import { FunctionComponent } from 'react';
import { FormOption, Form } from '../index';

interface ChooseFormProps {
  form: FormOption;
  onSelected: (form: Form) => void;
}

export const ChooseForm: FunctionComponent<ChooseFormProps> = ({
  form,
  onSelected,
}) => {
  const handleClick = (form: Form | undefined) => {
    if (form) {
      onSelected(form);
    }
  };
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      marginBottom={'1.8rem'}
    >
      <Typography
        tabIndex={0}
        align="center"
        sx={{
          fontSize: '27px',
          fontWeight: 'bold',
          paddingTop: '1rem',
          paddingBottom: '1.5rem',
        }}
      >
        Would you like to
      </Typography>
      <Box display={'flex'} flexDirection={'column'} gap={'20px'}>
        <Button
          variant={'contained'}
          sx={{ color: 'white' }}
          onClick={() => handleClick(form?.partialForm)}
        >
          Upload an exisiting {form.name}
        </Button>
        <Button
          variant={'contained'}
          sx={{ color: 'white' }}
          onClick={() => handleClick(form?.fullForm)}
        >
          Create a new {form.name}
        </Button>
      </Box>
    </Box>
  );
};
