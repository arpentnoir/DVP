import {
  Alert,
  Box,
  Button,
  Divider,
  Input,
  InputLabel,
  Stack,
  Typography,
} from '@mui/material';
import React, {
  DragEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

export const CertificateUpload = ({
  handleFiles,
  errorMessage,
  acceptMessage,
}: {
  handleFiles: (files: FileList) => void;
  errorMessage: string;
  acceptMessage: string;
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errorMessage && errorRef.current) {
      errorRef.current.focus();
    }
  }, []);

  const handleDrag = function (
    event: DragEvent<HTMLDivElement | HTMLFormElement>
  ) {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    } else if (event.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = function (event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event?.dataTransfer?.files && event.dataTransfer.files[0]) {
      handleFiles(event.dataTransfer.files);
    }
  };

  const handleChange = function (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    event.preventDefault();
    const target = event?.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      handleFiles(target.files);
    }
  };

  const onButtonClick = () => {
    if (null !== inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <Box
      onDragEnter={handleDrag}
      id="certificate-upload"
      sx={{
        width: { xs: '22rem', sm: '28rem' },
        height: '16rem',
        maxWidth: ' 100%',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <Input
        inputRef={inputRef}
        type="file"
        id="input-file-upload"
        inputProps={{ 'data-testid': 'input-file-upload' }}
        onChange={handleChange}
        sx={{ display: 'none' }}
      />

      <InputLabel
        id="label-file-upload"
        htmlFor="input-file-upload"
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: '2px',
          borderRadius: '1rem',
          borderStyle: 'dashed',
          borderColor: '#cbd5e1',
          backgroundColor: '#f8fafc',
        }}
      >
        <Stack sx={{ justifyContent: 'space-evenly', height: '100%' }}>
          <Stack sx={{ justifyContent: 'space-evenly', height: '100%' }}>
            <Typography>Drag and drop your file here</Typography>
            <div>
              <Divider>or</Divider>
            </div>
            <Button
              variant="contained"
              sx={{ textTransform: 'none' }}
              onClick={onButtonClick}
            >
              <Typography
                color="white"
                aria-label={`Select a file. ${acceptMessage}`}
              >
                Select a file
              </Typography>
            </Button>

            <Typography sx={{ fontSize: { xs: 'smaller', sm: 'medium' } }}>
              {acceptMessage}
            </Typography>
            {errorMessage ? (
              <Alert
                tabIndex={1}
                severity="error"
                id="vc-upload-error"
                ref={errorRef}
                aria-label={errorMessage}
              >
                {errorMessage}
              </Alert>
            ) : null}
          </Stack>
        </Stack>
      </InputLabel>
      {dragActive && (
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: ' 100%',
            borderRadius: '1rem',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
          }}
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragExit={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        />
      )}
    </Box>
  );
};
