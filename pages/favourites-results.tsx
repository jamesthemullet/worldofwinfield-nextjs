import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

type TypeProps = {
  sheetId: string;
  columnsToHide?: string[];
  indexRequired?: boolean;
  sortBy?: string;
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

const FavouriteResults = ({ sheetId, columnsToHide = [], indexRequired = true }: TypeProps) => {
  const [data, setData] = useState([]);
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

          const scoreColumnIndex = headerRow.indexOf('Score');
          if (scoreColumnIndex !== -1) {
            dataRows.sort((a, b) => b[scoreColumnIndex] - a[scoreColumnIndex]);
          }

          const updatedData = [headerRow, ...dataRows];
          setData(updatedData);
        } catch (error) {
          console.error('Error processing sheet data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFavouriteData();
  }, [sheetId, JSON.stringify(columnsToHide)]);

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
    }
  }

  &.header-row {
    @media (min-width: 768px) {
      min-width: 1000px;
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

    &.Comments {
      width: 800px;
      @media (max-width: 768px) {
        padding-bottom: 20px;
      }
    }

    &.Score,
    &.Language {
      @media (min-width: 768px) {
        width: 100px;
      }
    }

    &.Year {
      @media (max-width: 768px) {
        display: none;
      }
    }

    &.data {
      @media (max-width: 768px) {
        flex-wrap: wrap;
      }
    }
  }

  p {
    &.data-artist-track-name,
    &.heading-artist-track-name {
      width: 800px;
    }
  }
`;
