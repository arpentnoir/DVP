import { ChangeEvent, FunctionComponent, useRef } from 'react';
import { Button, Box, InputLabel } from '@mui/material';
import { fileToBase64, FileData } from '../../utils/fileToBase64';

interface FileUploadProps {
  buttonText: string;
  multiple: boolean;
  acceptedFiles?: string;
  required?: boolean;
  onChange(value: string | string[]): void;
}

export const FileUpload: FunctionComponent<FileUploadProps> = ({
  buttonText,
  multiple,
  acceptedFiles,
  required,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  function processFiles(files: FileList): Promise<FileData[]> {
    return Promise.all([].map.call(files, fileToBase64)) as Promise<FileData[]>;
  }

  const _onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesInfo = await processFiles(event.target.files);
      if (multiple) {
        return onChange(filesInfo.map((fileInfo) => fileInfo.dataURL));
      } else {
        return onChange(filesInfo[0].dataURL);
      }
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef?.current?.click();
    }
  };

  return (
    <Box>
      <input
        ref={inputRef}
        hidden
        type="file"
        id="file-upload-input"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onChange={_onChange}
        multiple={multiple}
        accept={acceptedFiles}
        data-testid="file-upload-input"
      />

      <InputLabel
        required={required}
        id="file-upload-label"
        htmlFor="file-upload-input"
      >
        <Button
          aria-label={buttonText}
          variant="contained"
          onClick={handleClick}
          data-testid="file-upload-button"
        >
          {buttonText}
        </Button>
      </InputLabel>
    </Box>
  );
};
