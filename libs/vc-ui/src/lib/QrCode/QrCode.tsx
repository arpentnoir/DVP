import * as QRCode from 'qrcode';
import { useEffect, useRef } from 'react';

interface IQrCode {
  url: string;
  qrCodeOptions?: QRCode.QRCodeRenderersOptions;
}

export const QrCode = ({ url, qrCodeOptions = { width: 200 } }: IQrCode) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        ...qrCodeOptions,
      }).catch(() => {
        throw new Error('Error generating the QRCode');
      });
    }
  }, [url, qrCodeOptions]);

  return (
    <canvas
      tabIndex={0}
      aria-label="QRCode that contains the Verifiable Credentials Uniform Resource Identifier"
      ref={canvasRef}
      data-testid={'qrcode'}
    ></canvas>
  );
};
