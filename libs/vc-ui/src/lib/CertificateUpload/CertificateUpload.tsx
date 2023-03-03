import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Alert,
  Box,
  Input,
  InputLabel,
  Stack,
  SxProps,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, {
  DragEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button } from '../Button';
import { Text } from '../Text';
interface ICertificateUpload {
  handleFiles: (files: FileList) => void;
  errorMessage?: string;
  acceptMessage?: string;
  style?: { mobile?: SxProps; desktop?: SxProps };
}

export const CertificateUpload = ({
  handleFiles,
  errorMessage,
  acceptMessage,
  style,
}: ICertificateUpload) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const theme = useTheme();

  useEffect(() => {
    if (errorMessage && errorRef.current) {
      errorRef.current.focus();
    }
  }, [errorMessage]);

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

  const onKeyUp = (event: any) => {
    event.preventDefault();
    if (event.key === ' ' || event.key === 'Enter') {
      inputRef?.current?.click();
    }
  };

  const onButtonClick = (event: any) => {
    event.preventDefault();
    inputRef?.current?.click();
  };

  const textColor = 'black';

  const matches = useMediaQuery(`(min-width:${theme.breakpoints.values.sm}px)`);

  return (
    <React.Fragment>
      <Box
        onDragEnter={handleDrag}
        id="certificate-upload"
        sx={{
          textAlign: 'center',
        }}
      >
        {!matches && (
          <Stack
            sx={{
              display: { xs: 'flex' },
              justifyContent: 'center',
              // Override style
              ...style?.mobile,
            }}
          >
            <Stack width="100%" gap="56px" alignItems="center">
              {errorMessage && (
                <Alert
                  severity="error"
                  id="vc-upload-error"
                  ref={errorRef}
                  aria-label={errorMessage}
                  tabIndex={0}
                  sx={{
                    backgroundColor: 'rgba(173, 26, 31, 0.04)',
                    width: '100%',
                    height: '60px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px solid #AD1A1F',
                    borderRadius: '8px',
                    color: '#AD1A1F',
                    whiteSpace: 'normal',
                  }}
                >
                  {errorMessage}
                </Alert>
              )}
              <Stack spacing={2} alignItems="center" width="100%">
                {/* TODO: A decision needs to be made whether we are providing the functionality to scan a QRCode */}
                <Button
                  sx={{
                    maxWidth: '510px',
                    width: '100%',
                    height: '42px',
                    backgroundColor: '#072243',
                    ':hover': {
                      boxShadow: 'none',
                      backgroundColor: '#092e5a',
                    },
                  }}
                  variant="text"
                  label={'Scan QR code'}
                  textProps={{ variant: 'h4', color: 'white', tabIndex: -1 }}
                ></Button>
                <Box sx={{ color: 'black' }}>
                  <Text
                    sx={{
                      display: 'inline',
                    }}
                    variant="body1"
                    tabIndex={-1}
                  >
                    Or &nbsp;
                  </Text>
                  <Box
                    role="button"
                    aria-controls="filename"
                    tabIndex={0}
                    aria-label={`Select a file. ${acceptMessage}`}
                    onKeyUp={onKeyUp}
                    onClick={onButtonClick}
                    sx={{
                      display: 'inline',
                      borderBottom: '1px solid',
                      ':hover': { cursor: 'pointer' },
                    }}
                  >
                    Select a file
                  </Box>
                </Box>
              </Stack>
            </Stack>
          </Stack>
        )}
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
          aria-label="Upload file"
          sx={{ height: '100%', display: { xs: 'hidden', sm: 'block' } }}
        >
          {matches && (
            <Stack
              sx={{
                height: '100%',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                borderWidth: '2px',
                borderRadius: '8px',
                borderStyle: 'dashed',
                borderColor: errorMessage ? '#AD1A1F' : '#cbd5e1',
                backgroundColor: errorMessage
                  ? 'rgba(173, 26, 31, 0.04)'
                  : 'white',
                // Override style
                ...style?.desktop,
              }}
            >
              <Stack
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px 100px',
                  gap: '14px',
                  color: textColor,
                }}
              >
                <CloudUploadIcon
                  fontSize="large"
                  sx={{
                    fill: '#0C1B2E',
                  }}
                />
                <Text
                  fontWeight="bold"
                  color={textColor}
                  variant="h6"
                  tabIndex={-1}
                >
                  Drop your document to verify
                </Text>
                <Box>
                  <Text
                    sx={{
                      display: 'inline',
                    }}
                    variant="body1"
                    tabIndex={-1}
                  >
                    Or &nbsp;
                  </Text>
                  <Box
                    role="button"
                    aria-controls="filename"
                    tabIndex={0}
                    aria-label={`Select a file. ${acceptMessage}`}
                    data-testid="file-select-button"
                    onKeyUp={onKeyUp}
                    sx={{
                      display: 'inline',
                      borderBottom: '1px solid',
                      ':hover': { cursor: 'pointer' },
                    }}
                  >
                    Select a file
                  </Box>
                </Box>

                {acceptMessage && (
                  <Text variant="body1" tabIndex={-1}>
                    {acceptMessage}
                  </Text>
                )}
                {errorMessage && (
                  <Alert
                    severity="error"
                    id="vc-upload-error"
                    ref={errorRef}
                    aria-label={errorMessage}
                    data-testid="vc-upload-error"
                    tabIndex={1}
                    sx={{
                      backgroundColor: 'transparent',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: 'none',
                      color: '#AD1A1F',
                      whiteSpace: 'normal',
                    }}
                  >
                    {errorMessage}
                  </Alert>
                )}
              </Stack>
            </Stack>
          )}
        </InputLabel>
        {dragActive && (
          <Box
            sx={{
              position: 'absolute',
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
    </React.Fragment>
  );
};
