import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

type TypeProps = {
  sheetId: string;
  columnsToHide?: string[];
  indexRequired?: boolean;
  sortBy?: string;
  genreFilter?: string;
};

const fetchDataFromGoogleSheets = async (sheetID: string) => {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
    const SHEET_NAME = 'Sheet1';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${SHEET_NAME}?alt=json&key=${API_KEY}`;

    const response = await fetch(url);
    const json = await response.json();
    return json.values;
  } catch (error) {
     
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
            filteredRows = dataRows.filter((row: string[]) => row[genreIndex] === genreFilter);
          }

          const normalize = (s: string) =>
            (s || '')
              .toString()
              .normalize('NFKD')
              .replace(/\s+/g, ' ')
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9 ]/g, '');

          const normalizedHeaders = headerRow.map((h: string) => normalize(h));

          const chooseSortColumnIndex = () => {
            // If no explicit sort selected (Default), don't apply any sorting and preserve sheet order
            if (!sortBy) return -1;

            const normSort = normalize(sortBy);
            const exact = normalizedHeaders.indexOf(normSort);
            if (exact !== -1) return exact;

            const fuzzy = normalizedHeaders.findIndex((h: string) => h && h.includes(normSort));
            if (fuzzy !== -1) return fuzzy;

            const starts = normalizedHeaders.findIndex((h: string) => h && h.startsWith(normSort));
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
              filteredRows.sort((a: string[], b: string[]) => {
                const rawA = (a[sortColumnIndex] ?? '').toString().replace(/,/g, '');
                const rawB = (b[sortColumnIndex] ?? '').toString().replace(/,/g, '');
                const av = parseFloat(rawA);
                const bv = parseFloat(rawB);
                // Handle missing/invalid data: sort them after valid numbers (ascending), before (descending)
                const aIsValid = !isNaN(av);
                const bIsValid = !isNaN(bv);
                if (!aIsValid && !bIsValid) return 0;
                if (!aIsValid) return sortIsAscending ? 1 : -1;
                if (!bIsValid) return sortIsAscending ? -1 : 1;
                return sortIsAscending ? av - bv : bv - av;
              });
            } else {
              filteredRows.sort((a: string[], b: string[]) => {
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
    <FavouritesContainer>
      <StyledTable>
        {data.length > 0 && (
          <>
            <thead>
              <tr>
                {indexRequired && <th className="index" scope="col"></th>}
                {data[0].map((header, cellIndex) => {
                  const className = `heading-${header.toString().toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}`;
                  return (
                    <th key={cellIndex} className={className} scope="col">
                      {header}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {data.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {indexRequired && <td className="index">{rowIndex + 1}.</td>}
                  {row.map((cellData, cellIndex) => {
                    const rawHeader = data[0][cellIndex] || '';
                    const className = `data-${rawHeader.toString().toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}`;

                    if (/link/.test(rawHeader.toString().toLowerCase())) {
                      const text = (cellData ?? '').toString();
                      const urlMatch =
                        text.match(/(https?:\/\/[^")\s]+)/i) || text.match(/(www\.[^\s]+)/i);
                      const mailtoMatch = text.match(/mailto:[^\s]+/i);
                      let href = '';
                      if (urlMatch) {
                        href = urlMatch[0];
                        if (!/^https?:\/\//i.test(href)) href = `http://${href}`;
                      } else if (mailtoMatch) {
                        href = mailtoMatch[0];
                      }

                      return (
                        <td key={cellIndex} className={className}>
                          {href ? (
                            <a href={href} target="_blank" rel="noopener noreferrer">
                              {text}
                            </a>
                          ) : (
                            text
                          )}
                        </td>
                      );
                    }

                    return (
                      <td key={cellIndex} className={className}>
                        {cellData}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </>
        )}
      </StyledTable>
    </FavouritesContainer>
  );
};

export default FavouriteResults;

const FavouritesContainer = styled.div`
  margin: 20px;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;

  @media (min-width: 768px) {
    min-width: 1000px;
  }

  th,
  td {
    text-align: left;
    padding: 0.35rem 0.5rem;
    vertical-align: middle;
    max-width: 500px;

    &.index {
      width: 30px;
    }

    &.data-artist-track-name,
    &.heading-artist-track-name {
      @media screen and (min-width: 768px) {
        width: 800px;
      }
    }

    &.data-author,
    &.data-title,
    &.data-name,
    &.data-brewery,
    &.data-beer-name,
    &.data-style,
    &.data-genre,
    &.data-country,
    &.data-date-read,
    &.heading-author,
    &.heading-title,
    &.heading-name,
    &.heading-brewery,
    &.heading-beer-name,
    &.heading-style,
    &.heading-genre,
    &.heading-country,
    &.heading-date-read {
      @media screen and (min-width: 768px) {
        width: 200px;
      }
    }

    &.data-score,
    &.data-year-read,
    &.data-abv,
    &.heading-score,
    &.heading-year-read,
    &.heading-abv {
      @media screen and (min-width: 768px) {
        width: 70px;
      }
    }

    &.data-comments,
    &.data-artist-track-name,
    &.data-about,
    &.data-link {
      width: 100%;
      @media screen and (min-width: 768px) {
        width: 500px;
      }
    }

    /* make long links wrap on mobile so they don't force horizontal scroll */
    &.data-link {
      a {
        display: inline-block;
        max-width: 100%;
        white-space: normal;
        overflow-wrap: anywhere;
        word-break: break-word;
        hyphens: auto;
        word-wrap: break-word;
      }
    }

    &.heading-comments,
    &.heading-artist-track-name,
    &.heading-about,
    &.heading-link {
      @media screen and (min-width: 768px) {
        width: 500px;
      }
    }

    &.data-date,
    &.data-language,
    &.data-bought-from,
    &.data-order-added,
    &.heading-date,
    &.heading-language,
    &.heading-bought-from,
    &.heading-order-added {
      @media screen and (min-width: 768px) {
        width: 120px;
      }
    }
  }

  thead {
    th.index {
      display: none;
      @media (min-width: 768px) {
        display: table-cell;
      }
    }

    th.heading-comments {
      @media (max-width: 767px) {
        display: none;
      }
    }
  }
`;
