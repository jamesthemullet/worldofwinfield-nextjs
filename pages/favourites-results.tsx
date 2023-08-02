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
    const fetchFavoriteData = async () => {
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
        const data = await fetchDataFromGoogleSheets(sheetID);
        setData(data);
      }
    };

    fetchFavoriteData();
  }, [type]);

  return (
    <div>
      {data.map((row, index) => (
        <StyledRow key={index}>
          <p>{row[0]}</p>
          <p>{row[1]}</p>
          <p>{row[2]}</p>
        </StyledRow>
      ))}
    </div>
  );
};

export default FavouriteResults;

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;
