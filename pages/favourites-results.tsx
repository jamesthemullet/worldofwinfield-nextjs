/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

const wantToVisitSheetID = '1GX6KF20f3Nrb3m8T9th7UIV_uuePj4Ivlc_yLgo-4Bo';
const wantToEatHereSheetID = '13gz7lPQ61f_WKQ_xio_QBlUcFB9Dl0yVBynwEadVO_4';

type TypeProps = {
  sheetId?: string;
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

const FavouriteResults = ({ sheetId }: TypeProps) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchfavouriteData = async () => {
      if (sheetId) {
        const rawData = await fetchDataFromGoogleSheets(sheetId);

        const headerRow = rawData[0];
        const dataRows = rawData.slice(1);

        const dateColumnIndex = headerRow.indexOf('Date');
        if (dateColumnIndex !== -1) {
          for (const row of dataRows) {
            row.splice(dateColumnIndex, 1);
          }
          headerRow.splice(dateColumnIndex, 1);
        }

        const scoreColumnIndex = headerRow.indexOf('Score');
        if (scoreColumnIndex !== -1) {
          dataRows.sort((a, b) => b[scoreColumnIndex] - a[scoreColumnIndex]);
        }

        const updatedData = [headerRow, ...dataRows];
        setData(updatedData);
      }
    };

    fetchfavouriteData();
  }, [sheetId]);

  return (
    <FavouritesContainer isHeading={false}>
      {data.map((row, rowIndex) => (
        <StyledRow key={rowIndex} className={rowIndex === 0 ? 'header-row' : 'data-row'}>
          {rowIndex === 0 ? <p className="index"></p> : <p className="index">{rowIndex}.</p>}{' '}
          {row.map((cellData, cellIndex) => (
            <p
              key={cellIndex}
              className={
                rowIndex === 0 ? `heading ${data[0][cellIndex]}` : `data ${data[0][cellIndex]}`
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

  &.data-row {
    @media (max-width: 768px) {
      flex-wrap: wrap;
    }
  }

  &.header-row {
    .Comments {
      @media (max-width: 768px) {
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
    @media (min-width: 768px) {
      width: 200px;
    }

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

  p:first-of-type {
    width: 30px; /* Adjust the width as needed */
    display: flex;
    align-items: center;

    &.Comments {
      width: 800px;
    }

    &.Score,
    &.Language {
      width: 100px;
    }
  }
`;
