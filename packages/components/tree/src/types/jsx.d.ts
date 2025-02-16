declare namespace JSX {
  interface IntrinsicElements {
    svg: {
      xmlns?: string;
      viewBox?: string;
      width?: string | number;
      height?: string | number;
      fill?: string;
    };
    path: {
      d?: string;
    };
  }
} 