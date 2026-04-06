"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface Props {
  value: string;
  size?: number;
}

export default function QRCodeCanvas({ value, size = 200 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: "#1B2E4B",
          light: "#FFFFFF",
        },
      });
    }
  }, [value, size]);

  return <canvas ref={canvasRef} />;
}
