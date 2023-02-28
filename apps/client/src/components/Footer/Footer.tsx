import { Button } from '@dvp/vc-ui';
import { Box, Stack } from '@mui/material';
import { FOOTER_LOGO_ALT_TEXT } from '../../constants';

const LOGO_PATH = 'assets/footer-logo-white.svg';

export const Footer = () => {
  return (
    <Stack
      sx={{
        backgroundColor: 'black',
        alignItems: 'center',
      }}
    >
      <Stack
        sx={{
          maxWidth: '1140px',
          width: '100%',
          padding: { xs: '20px 20px', md: '20px 10px' },
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Stack
          sx={{
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
          }}
        >
          <Button
            sx={{ color: 'white' }}
            variant="text"
            label={'Who we are'}
            onClick={() => null}
          />
          <Button
            sx={{ color: 'white' }}
            variant="text"
            label={'Our Ministers'}
            onClick={() => null}
          />
          <Button
            sx={{ color: 'white' }}
            variant="text"
            label={'About us'}
            onClick={() => null}
          />
          <Button
            sx={{ color: 'white' }}
            variant="text"
            label={'Contact us'}
            onClick={() => null}
          />
        </Stack>
        <Box
          component="img"
          tabIndex={0}
          sx={{
            width: '150px',
          }}
          alt={FOOTER_LOGO_ALT_TEXT}
          src={LOGO_PATH}
        />
      </Stack>
    </Stack>
  );
};
