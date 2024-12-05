import { Button, CardActions, CardContent, Divider, Grid, SvgIcon, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ApexChart from 'react-apexcharts';
import { MainCard } from '@/common/components';

const useChartOptions = () => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.25)],
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
      type: 'solid',
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        columnWidth: '40px',
      },
    },
    stroke: {
      colors: ['transparent'],
      show: true,
      width: 2,
    },
    theme: {
      mode: theme.palette.mode,
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true,
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true,
      },
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        offsetY: 5,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value: any) => (value > 0 ? `${value}K` : `${value}`),
        offsetX: -10,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
  };
};
interface IOverviewSales {
  header?: any;
  innerHeader?: any;
  chartSeries: any;
  sx: any;
}
export const CashGraph = (props: IOverviewSales) => {
  const { chartSeries, header, innerHeader } = props;
  const chartOptions = useChartOptions();

  return (
    <>
      <Grid container direction={'row'} alignItems="center" justifyContent="space-between">
        {typeof header === 'string' ? <Typography variant="h5">{header}</Typography> : header}
      </Grid>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <CardContent>
          {typeof innerHeader === 'string' ? <Typography variant="h5">{innerHeader}</Typography> : innerHeader}
          <ApexChart height={350} options={chartOptions} series={chartSeries} type="bar" width="100%" />
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            color="inherit"
            endIcon={
              <SvgIcon fontSize="small">
                <ArrowForwardIcon />
              </SvgIcon>
            }
            size="small"
          >
            Ver
          </Button>
        </CardActions>
      </MainCard>
    </>
    // <Card sx={sx}>
    //   <CardHeader
    //     action={
    //       <Button
    //         color="inherit"
    //         size="small"
    //         startIcon={
    //           <SvgIcon fontSize="small">
    //             <SyncIcon />
    //           </SvgIcon>
    //         }
    //       >
    //         Actualizar
    //       </Button>
    //     }
    //     title="Ventas del año"
    //   />
    // </Card>
  );
};