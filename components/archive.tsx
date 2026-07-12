import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { StyledSelect } from './core-components';
import { getMonthNumber } from './utils';

const ArchiveDropdown = () => {
  const router = useRouter();
  const months = useMemo(() => {
    const now = new Date();
    const count = (now.getFullYear() - 2010) * 12 + now.getMonth() + 1;
    return Array.from({ length: count }, (_, index) => {
      const monthNumber = (index % 12) + 1;
      const year = Math.floor(index / 12) + 2010;
      return new Date(year, monthNumber - 1, 1).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    });
  }, []);

  const handleSelectMonth = async (event: React.ChangeEvent<HTMLSelectElement>): Promise<void> => {
    const selectedValue = event.target.value;

    if (selectedValue) {
      const [selectedMonth, selectedYear] = selectedValue.split(' ');
      const monthNumber = getMonthNumber(selectedMonth);
      router.push({
        pathname: '/archive-page',
        query: {
          month: monthNumber,
          year: selectedYear,
        },
      });
    }
  };

  return (
    <div>
      <p>Posts from the archives</p>
      <ArchiveSelectRow>
        <label htmlFor="archive-month-select">Select month</label>
        <StyledSelect id="archive-month-select" onChange={handleSelectMonth}>
          <option value="">Select Month</option>
          {months.map((month) => (
            <option key={month} value={`${month}`}>
              {month}
            </option>
          ))}
        </StyledSelect>
      </ArchiveSelectRow>
    </div>
  );
};

const ArchiveSelectRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
`;

export default ArchiveDropdown;
