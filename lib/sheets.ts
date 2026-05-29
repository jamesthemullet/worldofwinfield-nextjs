export const fetchDataFromGoogleSheets = async (sheetID: string): Promise<string[][] | null> => {
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
