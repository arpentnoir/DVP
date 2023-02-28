import { Container, ContainerProps } from '@mui/material';
import { Helmet } from 'react-helmet';

interface IBaseLayout extends ContainerProps {
  children: React.ReactNode;
  title: string;
}

export const BaseLayout = ({ children, title, ...rest }: IBaseLayout) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <Container
        maxWidth={false}
        {...rest}
        sx={{
          paddingX: { xs: '40px', lg: '0' },
          paddingY: { xs: '40px', md: '60px' },
          maxWidth: '950px',
          flex: 1,
          ...rest.sx,
        }}
        disableGutters
      >
        {children}
      </Container>
    </>
  );
};
