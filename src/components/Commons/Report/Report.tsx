import { useCallback, useState } from 'react';
import { getReport } from '../../../services/reports/reportService';
import { openBase64InNewTab } from '../../../utils/functions/dataUtils';
import { Backdrop, Button } from '@mui/material';
import { ReportLoader } from './ReportLoader';

interface ReportProps {
  data: any[];
  headers: string[];
  hasChildren?: boolean;
  headersChildren?: string[];
}

export const Report = (props: ReportProps) => {
  const { data, headers, headersChildren } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReportChildren = useCallback(async () => {
    if (!headersChildren) return;
    setIsLoading(true);

    const newData = data.flatMap((item) => {
      const filteredEntries = Object.entries(item).filter(
        ([key]) => key !== 'id' && key !== 'fechaCreacion' && key !== 'fechaModificacion'
      );

      const filterKeys = (key: string) => !/^id(_|$)/i.test(key);

      if (filteredEntries.length === 0) return [{}];

      const parentObject: any = {};
      const childrenObjects: any[] = [];

      for (let i = 0; i < filteredEntries.length; i++) {
        const [key, value] = filteredEntries[i];
        if (Array.isArray(value)) {
          childrenObjects.push(
            ...value.map((child: any) => {
              const childObject: any = {};
              const filteredChildEntries = Object.entries(child).filter(
                ([childKey]) => childKey !== 'id' && childKey !== 'fechaCreacion' && childKey !== 'fechaModificacion'
              );
              for (let j = 0; j < filteredChildEntries.length; j++) {
                const [childKey, childValue] = filteredChildEntries[j];
                if (filterKeys(childKey)) {
                  childObject[headersChildren[j]] = childValue;
                }
              }
              return { ...parentObject, ...childObject };
            })
          );
        } else {
          if (filterKeys(key)) {
            parentObject[headers[i]] = value;
          }
        }
      }

      if (childrenObjects.length === 0) return [parentObject];

      return childrenObjects;
    });

    const dataStringify = JSON.stringify(newData);
    try {
      const res = await getReport(dataStringify);
      openBase64InNewTab(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [data, headers, headersChildren]);

  const handleGenerateReport = useCallback(async () => {
    setIsLoading(true);
    const newData = data.map((item) => {
      const filteredEntries = Object.entries(item).filter(
        ([key]) => key !== 'id' && key !== 'fechaCreacion' && key !== 'fechaModificacion'
      );

      const filterKeys = (key: string) => !key.toLowerCase().includes('id');

      const newObject: any = {};
      for (let i = 0; i < filteredEntries.length; i++) {
        const [key, value] = filteredEntries[i];
        if (filterKeys(key)) {
          newObject[headers[i]] = value;
        }
      }

      return newObject;
    });
    const dataStringify = JSON.stringify(newData);
    try {
      const res = await getReport(dataStringify);
      openBase64InNewTab(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [data, headers]);

  return (
    <>
      <Button variant="contained" onClick={props.hasChildren ? handleGenerateReportChildren : handleGenerateReport}>
        Generar reporte
      </Button>
      <Backdrop open={isLoading}>
        <ReportLoader />
      </Backdrop>
    </>
  );
};
