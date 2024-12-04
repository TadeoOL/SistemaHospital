import { CashGraph } from './CashGraph';

const Treasury = () => {
  return (
    <div>
      <CashGraph
        header={'Menu tesoreria'}
        chartSeries={[
          {
            name: 'This year',
            data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
          },
        ]}
        sx={{ height: '100%' }}
      />
    </div>
  );
};

export default Treasury;
