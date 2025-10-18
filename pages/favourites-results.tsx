import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

type TypeProps = {
  sheetId: string;
  columnsToHide?: string[];
  indexRequired?: boolean;
  sortBy?: string;
  genreFilter?: string;
};

const fetchDataFromGoogleSheets = async (sheetID) => {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
    const SHEET_NAME = 'Sheet1';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${SHEET_NAME}?alt=json&key=${API_KEY}`;

    const response = await axios.get(url);
    return response.data.values;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching data from Google Sheets:', error);
    return null;
  }
};

const FavouriteResults = ({
  sheetId,
  columnsToHide = [],
  indexRequired = true,
  sortBy,
  genreFilter,
}: TypeProps) => {
  const [data, setData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavouriteData = async () => {
      if (sheetId && !loading) {
        setLoading(true);
        try {
          const rawData = await fetchDataFromGoogleSheets(sheetId);

          if (!rawData || !rawData.length) {
            console.error('No data received from Google Sheets');
            return;
          }

          const headerRow = rawData[0];
          const dataRows = rawData.slice(1);

          columnsToHide.forEach((columnName) => {
            const columnIndex = headerRow.indexOf(columnName);
            if (columnIndex !== -1) {
              for (const row of dataRows) {
                row.splice(columnIndex, 1);
              }
              headerRow.splice(columnIndex, 1);
            }
          });

          let filteredRows = dataRows;
          if (genreFilter && headerRow.includes('Genre')) {
            const genreIndex = headerRow.indexOf('Genre');
            filteredRows = dataRows.filter((row) => row[genreIndex] === genreFilter);
          }

          const normalize = (s: string) =>
            (s || '')
              .toString()
              .normalize('NFKD')
              .replace(/\s+/g, ' ')
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9 ]/g, '');

          const normalizedHeaders = headerRow.map((h) => normalize(h));

          const chooseSortColumnIndex = () => {
            if (!sortBy) {
              const orderIdx = normalizedHeaders.indexOf(normalize('Order Added'));
              if (orderIdx !== -1) return orderIdx;

              const fallbacks = ['Country', 'Order Added', 'Score'];
              for (const name of fallbacks) {
                const idx = normalizedHeaders.indexOf(normalize(name));
                if (idx !== -1) return idx;
              }
              return -1;
            }

            const normSort = normalize(sortBy);
            const exact = normalizedHeaders.indexOf(normSort);
            if (exact !== -1) return exact;

            const fuzzy = normalizedHeaders.findIndex((h) => h && h.includes(normSort));
            if (fuzzy !== -1) return fuzzy;

            const starts = normalizedHeaders.findIndex((h) => h && h.startsWith(normSort));
            if (starts !== -1) return starts;

            // If no match, fall back to -1
            return -1;
          };

          const sortColumnIndex = chooseSortColumnIndex();
          if (sortColumnIndex !== -1) {
            const headerName = headerRow[sortColumnIndex] || '';
            const normalizedHeaderName = normalizedHeaders[sortColumnIndex] || '';
            const combinedHeader = `${headerName} ${normalizedHeaderName}`;
            const isNumeric = /\b(score|year|abv|order|amount|quantity|price|count)\b/i.test(
              combinedHeader,
            );
            const sortIsAscending = !isNumeric;

            if (isNumeric) {
              filteredRows.sort((a, b) => {
                const rawA = (a[sortColumnIndex] ?? '').toString().replace(/,/g, '');
                const rawB = (b[sortColumnIndex] ?? '').toString().replace(/,/g, '');
                const av = parseFloat(rawA) || 0;
                const bv = parseFloat(rawB) || 0;
                return sortIsAscending ? av - bv : bv - av;
              });
            } else {
              filteredRows.sort((a, b) => {
                const av = (a[sortColumnIndex] ?? '').toString().trim().toLowerCase();
                const bv = (b[sortColumnIndex] ?? '').toString().trim().toLowerCase();
                const cmp = av.localeCompare(bv);
                return sortIsAscending ? cmp : -cmp;
              });
            }
          }

          const updatedData = [headerRow, ...filteredRows];
          setData(updatedData);
        } catch (error) {
          console.error('Error processing sheet data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFavouriteData();
  }, [sheetId, JSON.stringify(columnsToHide), genreFilter, sortBy]);

  return (
    <FavouritesContainer isHeading={false}>
      {data.map((row, rowIndex) => (
        <StyledRow key={rowIndex} className={rowIndex === 0 ? 'header-row' : 'data-row'}>
          {indexRequired &&
            (rowIndex === 0 ? <p className="index"></p> : <p className="index">{rowIndex}.</p>)}
          {row.map((cellData, cellIndex) => (
            <p
              key={cellIndex}
              className={
                rowIndex === 0
                  ? `heading-${data[0][cellIndex].toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}`
                  : `data-${data[0][cellIndex].toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}`
              }>
              {rowIndex === 0 ? <strong>{cellData}</strong> : cellData}
            </p>
          ))}
        </StyledRow>
      ))}
    </FavouritesContainer>
  );
};

export default FavouriteResults;

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 0.5rem;
  @media (min-width: 768px) {
    gap: 1rem;
  }
  align-items: flex-start;
  margin: 0 auto;

  &.data-row {
    @media (min-width: 768px) {
      flex-wrap: wrap;
      min-width: 1000px;
      flex: 1;
      display: flex;
      justify-content: center;
    }
  }

  &.header-row {
    @media (min-width: 768px) {
      min-width: 1000px;
      display: flex;
      justify-content: center;
    }
    .Comments {
      @media (max-width: 767px) {
        display: none;
      }
    }
  }
`;

const FavouritesContainer = styled.div<{ isHeading: boolean }>`
  display: flex;
  flex-direction: column;
  margin: 20px;

  p {
    margin: 0;
    display: flex;
    align-items: ${({ isHeading }) => (isHeading ? 'flex-start' : 'center')};
    max-width: 500px;

    &.index {
      width: 30px;
    }

    &.data-artist-track-name,
    &.heading-artist-track-name {
      width: 800px;
    }
    &.data-author,
    &.heading-author,
    &.data-title,
    &.heading-title,
    &.data-name,
    &.heading-name,
    &.data-brewery,
    &.heading-brewery,
    &.data-beer-name,
    &.heading-beer-name,
    &.data-style,
    &.heading-style,
    &.data-genre,
    &.heading-genre,
    &.data-country,
    &.heading-country {
      width: 200px;
    }

    &.data-score,
    &.heading-score,
    &.data-year-read,
    &.heading-year-read,
    &.data-abv,
    &.heading-abv {
      width: 70px;
    }

    &.data-comments,
    &.heading-comments,
    &.data-artist-track-name,
    &.heading-artist-track-name {
      width: 500px;
    }

    &.data-date,
    &.heading-date,
    &.data-language,
    &.heading-language,
    &.data-bought-from,
    &.heading-bought-from,
    &.data-order-added,
    &.heading-order-added {
      width: 120px;
    }
  }
`;
