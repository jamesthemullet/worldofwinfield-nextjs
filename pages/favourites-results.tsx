import axios from 'axios';
import { useEffect, useState } from 'react';
import getConfig from 'next/config';
import styled from '@emotion/styled';

const favouriteMoviesSheetID = '1q3LFzLYqK0tLWHjvHYxFE1IIF-FrOJuqJ6XBIQIEl6U';
const favouriteBooksSheetID = '1G-QrN1NDpKAr12VyIi50Nod8_g-YOSGP3bovCXxDHlY';
const favouriteDJsSheetID = '1_zpDBFlpW2ZWTVsXQHoW6Y4FbGw8Vi53nMYpZiOypbg';
const favouriteCheeseSheetID = '1UDjT7_Q5rBPQasn4o2qxUOsEcElEI67nl-ep9YTLc-E';
const favouriteBeerSheetID = '1pNNIw849xWrQHtDptwInGs6Un0AZh-fgXUssC3XIrHM';
const favouriteRestaurantsSheetID = '1J1znKQxeNR3Y6Q1mEPzZyMfCAGK4FQyxasoCQx35NVQ';
const { publicRuntimeConfig } = getConfig();

type TypeProps = {
  type: string;
};

const fetchDataFromGoogleSheets = async (sheetID) => {
  try {
    const API_KEY = publicRuntimeConfig.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
    const SHEET_NAME = 'Sheet1';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${SHEET_NAME}?alt=json&key=${API_KEY}`;

    const response = await axios.get(url);
    return response.data.values;
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    return null;
  }
};

const FavouriteResults = ({ type }: TypeProps) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchfavouriteData = async () => {
      let sheetID;

      if (type === 'favouriteMoviesSheetID') {
        sheetID = favouriteMoviesSheetID;
      } else if (type === 'favouriteBooksSheetID') {
        sheetID = favouriteBooksSheetID;
      } else if (type === 'favouriteDJsSheetID') {
        sheetID = favouriteDJsSheetID;
      } else if (type === 'favouriteCheeseSheetID') {
        sheetID = favouriteCheeseSheetID;
      } else if (type === 'favouriteBeerSheetID') {
        sheetID = favouriteBeerSheetID;
      } else if (type === 'favouriteRestaurantsSheetID') {
        sheetID = favouriteRestaurantsSheetID;
      }

      if (sheetID) {
        const rawData = await fetchDataFromGoogleSheets(sheetID);

        // Separate the header row from data rows
        const headerRow = rawData[0];
        console.log(1, headerRow);
        const dataRows = rawData.slice(1);

        // Hide the "date" column if it exists (assuming "date" is in the header row)
        const dateColumnIndex = headerRow.indexOf('Date');
        if (dateColumnIndex !== -1) {
          for (const row of dataRows) {
            row.splice(dateColumnIndex, 1);
          }
          headerRow.splice(dateColumnIndex, 1);
        }

        // Sort data by the "score" column if it exists (assuming "score" is in the header row)
        const scoreColumnIndex = headerRow.indexOf('Score');
        if (scoreColumnIndex !== -1) {
          dataRows.sort((a, b) => b[scoreColumnIndex] - a[scoreColumnIndex]);
        }

        // Reassemble the data with the header row at the beginning
        const updatedData = [headerRow, ...dataRows];
        setData(updatedData);
      }
    };

    fetchfavouriteData();
  }, [type]);

  return (
    <FavouritesContainer isHeading={false}>
      {data.map((row, rowIndex) => (
        <StyledRow key={rowIndex}>
          {rowIndex === 0 ? <p className="index"></p> : <p className="index">{rowIndex}.</p>}{' '}
          {/* Index column */}
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
  gap: 1rem;
  align-items: flex-start;
`;

const FavouritesContainer = styled.div<{ isHeading: boolean }>`
  display: flex;
  flex-direction: column;
  margin: 20px;

  p {
    margin: 0;
    display: flex;
    align-items: ${({ isHeading }) => (isHeading ? 'flex-start' : 'center')};
    width: 200px;

    &.Comments {
      width: 800px;
    }

    &.Score,
    &.Language {
      width: 100px;
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
