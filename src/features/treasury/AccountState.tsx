import { CashGraph } from './CashGraph';

const AccountState = () => {
  return (
    <div>
      <CashGraph
        header={'Estado de cuenta'}
        chartSeries={[
          {
            name: 'This year',
            data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
          },
          {
            name: 'Last year',
            data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13],
          },
        ]}
        sx={{ height: '100%' }}
      />
    </div>
  );
};

export default AccountState;
