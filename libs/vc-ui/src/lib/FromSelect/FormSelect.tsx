import { useState, useEffect, FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  SelectChangeEvent,
} from '@mui/material';

export interface Form {
  schema: Record<string, unknown>;
  uiSchema: Record<string, unknown>;
}

export interface FormOption {
  id: string;
  name: string;
  fullForm?: Form;
  partialForm?: Form;
}

interface FormSelectProps {
  forms: FormOption[];
  onFormSelected: (value: FormOption) => void;
}

export const FormSelect: FunctionComponent<FormSelectProps> = ({
  forms,
  onFormSelected,
}) => {
  const [availableForms, setAvailableForms] = useState<FormOption[]>([]);
  const [selectedForm, setSelectedForm] = useState('');
  const [selectedFormName, setSelectedFormName] = useState('');

  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  useEffect(() => {
    setAvailableForms(forms);
  }, [forms]);

  const handleSelectedForm = (event: SelectChangeEvent<string>) => {
    setSelectedForm(event.target.value);
    setSelectedFormName(
      availableForms.filter((value) => value.id === event.target.value)[0].name
    );
  };

  const handleSubmit = () => {
    onFormSelected(
      availableForms.filter((form) => form.id === selectedForm)[0]
    );
  };

  return (
    <Box>
      <Typography
        tabIndex={0}
        sx={{
          fontSize: '24px',
          fontWeight: 'bold',
          paddingTop: '10px',
          paddingBottom: '15px',
        }}
      >
        Select a Form
      </Typography>
      <FormControl
        fullWidth
        sx={{ marginBottom: '20px', width: { sm: '90%' } }}
      >
        <InputLabel
          id="form-select-label"
          htmlFor={'select-input-label-id'}
          aria-label={`Select a Form to Issue. ${
            selectedFormName ? `${selectedFormName} selected` : ''
          }`}
        >
          Select a Form to Issue
        </InputLabel>

        <Select
          labelId="form-select-label"
          label={'Select a Form to Issue'}
          value={selectedForm}
          onChange={handleSelectedForm}
          role={'listbox'}
          data-testid={'form-select'}
          inputProps={{ id: 'select-input-label-id' }}
        >
          {availableForms.map(({ id, name }, index: number) => (
            <MenuItem key={`menu-item-${index}`} value={id}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box
        display={'flex'}
        flexDirection={'row'}
        flexWrap={'wrap'}
        gap={'15px'}
      >
        <Button variant={'outlined'} onClick={goToHome}>
          Cancel
        </Button>
        <Button
          variant={'contained'}
          sx={{ color: 'white' }}
          onClick={handleSubmit}
          disabled={selectedForm ? false : true}
        >
          Issue
        </Button>
      </Box>
    </Box>
  );
};
