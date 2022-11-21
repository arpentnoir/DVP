import { useState } from 'react';
import {
  Box,
  Stack,
  IconButton,
  TextField,
  InputAdornment,
  Paper,
  Link,
} from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import { VerifiableCredential } from '@dvp/api-interfaces';
import { QrCode } from '../QrCode';
import { copyToClipboard } from '../../utils';

export interface IVcUtility {
  document: VerifiableCredential;
  onPrint: () => void;
  isPrintable: boolean;
}

export const VcUtility = ({ document, onPrint, isPrintable }: IVcUtility) => {
  const [isQrCodePopoverOpen, setIsQrCodePopoverOpen] = useState(false);
  const verifiableCredential = document;
  const { name, links } = verifiableCredential.credentialSubject ?? {};

  const fileName = (name as string) ?? 'untitled';
  const qrcodeUrl = links?.self?.href ?? '';

  return (
    <Stack
      direction={'row'}
      justifyContent={'flex-end'}
      style={{ flexWrap: 'wrap' }}
      spacing={2}
      marginBottom={'15px'}
      marginTop={'15px'}
      data-testid="vc-utility"
    >
      {qrcodeUrl && (
        <Box>
          <IconButton
            tabIndex={0}
            aria-label="Access the Verifiable Credentials Uniform Resource Identifier and QRCode dropdown"
            data-testid="uri-dropdown-button"
            onClick={() => {
              setIsQrCodePopoverOpen(!isQrCodePopoverOpen);
            }}
            sx={{ border: '1px solid grey', borderRadius: '10px' }}
          >
            <QrCode2Icon color={'primary'} />
          </IconButton>
          <Paper
            sx={{
              display: isQrCodePopoverOpen ? 'flex' : 'none',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              position: 'absolute',
              border: '1px solid grey',
              borderRadius: '10px',
              width: 'min-content',
              padding: '20px 10px 15px 10px',
              marginTop: '10px',
              right: '20px',
              zIndex: 1,
            }}
          >
            <TextField
              aria-label="Verifiable Credentials Uniform Resource Identifier"
              data-testid="vc-uri"
              value={qrcodeUrl}
              style={{
                width: '92%',
                marginBottom: '10px',
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      tabIndex={0}
                      aria-label="Copy the Verifiable Credentials Uniform Resource Identifier to the clipboard"
                      data-testid="copy-uri-button"
                      onClick={() => {
                        void copyToClipboard(qrcodeUrl);
                      }}
                    >
                      <ContentCopyIcon color={'primary'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <QrCode url={qrcodeUrl} qrCodeOptions={{ width: 200 }} />
          </Paper>
        </Box>
      )}
      {isPrintable && (
        <Box>
          <IconButton
            tabIndex={0}
            aria-label="Print the Verifiable Credential"
            data-testid="print-button"
            onClick={() => {
              onPrint();
            }}
            sx={{ border: '1px solid grey', borderRadius: '10px' }}
          >
            <PrintIcon color={'primary'} />
          </IconButton>
        </Box>
      )}
      <Box>
        <Link
          tabIndex={-1}
          data-testid="download-link"
          href={`data:text/json;,${encodeURIComponent(
            JSON.stringify(document, null, 2)
          )}`}
          download={`${fileName}.json`}
          rel="noreferrer"
        >
          <IconButton
            tabIndex={0}
            aria-label="Download the Verifiable Credential"
            data-testid="download-button"
            sx={{ border: '1px solid grey', borderRadius: '10px' }}
          >
            <DownloadIcon color={'primary'} />
          </IconButton>
        </Link>
      </Box>
    </Stack>
  );
};
