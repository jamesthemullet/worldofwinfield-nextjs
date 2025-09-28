import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

type TypeProps = {
  sheetId: string;
  columnsToHide?: string[];
  indexRequired?: boolean;
  sortBy?: string;
  genreFilter?: string; // NEW
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

          // Filter by genre if genreFilter is set
          let filteredRows = dataRows;
          if (genreFilter && headerRow.includes('Genre')) {
            const genreIndex = headerRow.indexOf('Genre');
            filteredRows = dataRows.filter((row) => row[genreIndex] === genreFilter);
          }

          const scoreColumnIndex = headerRow.indexOf('Score');
          if (scoreColumnIndex !== -1) {
            filteredRows.sort((a, b) => b[scoreColumnIndex] - a[scoreColumnIndex]);
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
  }, [sheetId, JSON.stringify(columnsToHide), genreFilter]);

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
    &.heading-genre {
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
    &.heading-bought-from {
      width: 120px;
    }
  }
`;
