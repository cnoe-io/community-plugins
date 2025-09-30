import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import type { CSSProperties, FC, ReactNode } from 'react';

type TablePaperProps = {
  children: ReactNode[];
  style: CSSProperties;
};

export const TablePaper: FC<TablePaperProps> = ({ children, style }) => {
  return (
    <Grid direction="column" xs={12} style={{ width: '100%' }}>
      {[
        children[1],
        <Paper elevation={3} style={{ ...style, marginTop: '50px' }}>
          {[children[2], children[3], children[5]]}
        </Paper>,
      ]}
    </Grid>
  );
};
