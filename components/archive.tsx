import React from 'react';
import { useRouter } from 'next/router';
import { getMonthNumber } from './utils';
import { StyledSelect } from './core-components';

const ArchiveDropdown = () => {
  const router = useRouter();
  const months = Array.from(
    { length: (new Date().getFullYear() - 2010) * 12 + new Date().getMonth() + 1 },
    (_, index) => {
      const monthNumber = (index % 12) + 1; // Add 9 to start from January 2010
      const year = Math.floor(index / 12) + 2010; // Calculate the year
      return new Date(year, monthNumber - 1, 1).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    }
  );

  const handleSelectMonth = async (event) => {
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
      <StyledSelect onChange={handleSelectMonth}>
        <option value="">Select Month</option>
        {months.map((month) => (
          <option key={month} value={`${month}`}>
            {month}
          </option>
        ))}
      </StyledSelect>
    </div>
  );
};

export default ArchiveDropdown;
