export const getEmptyResponse = (fakeData?: any[]): any => {
  if (Array.isArray(fakeData)) {
    return {
      data: fakeData,
      total: fakeData.length,
      pageIndex: 1,
      pageSize: 10,
      count: fakeData.length,
      pageCount: 1,
      resultByPage: 10,
    };
  }

  return {
    data: [],
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    count: 0,
    pageCount: 1,
    resultByPage: 10,
  };
};
