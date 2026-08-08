import type { GlobalSearchCategoryKey } from './types';

export type SearchableSheet = {
  key: GlobalSearchCategoryKey;
  label: string;
  sheetId: string;
  path: string;
  titleColumn: string;
  subtitleColumn?: string;
};

export const searchableSheets: SearchableSheet[] = [
  {
    key: 'books',
    label: 'Favourite books',
    sheetId: '1G-QrN1NDpKAr12VyIi50Nod8_g-YOSGP3bovCXxDHlY',
    path: '/favourite-books',
    titleColumn: 'Title',
    subtitleColumn: 'Author',
  },
  {
    key: 'movies',
    label: 'Favourite movies',
    sheetId: '1q3LFzLYqK0tLWHjvHYxFE1IIF-FrOJuqJ6XBIQIEl6U',
    path: '/favourite-movies',
    titleColumn: 'Name',
    subtitleColumn: 'Language',
  },
  {
    key: 'restaurants',
    label: 'Favourite restaurants',
    sheetId: '1J1znKQxeNR3Y6Q1mEPzZyMfCAGK4FQyxasoCQx35NVQ',
    path: '/favourite-restaurants',
    titleColumn: 'Name',
  },
  {
    key: 'cities',
    label: 'Favourite cities visited',
    sheetId: '1WBfOTfhC70AygxrTcIIgvigzlvOD65WfI9Ysrd3aF5o',
    path: '/favourite-cities',
    titleColumn: 'Name',
  },
  {
    key: 'countries',
    label: 'Favourite countries visited',
    sheetId: '1zyzuLzWY0S6mUp-FVjcIa3QFAENcU94WVD9ZF0JWERY',
    path: '/favourite-countries',
    titleColumn: 'Name',
  },
  {
    key: 'tracks',
    label: 'Favourite tracks',
    sheetId: '1ifEAiSgIMKrtTJ6fSHNGmQ-kMzR_MyAa-PjvBWOsBRA',
    path: '/favourite-tracks',
    titleColumn: 'Artist/Track Name',
    subtitleColumn: 'Label',
  },
  {
    key: 'djs',
    label: 'Favourite DJs',
    sheetId: '1_zpDBFlpW2ZWTVsXQHoW6Y4FbGw8Vi53nMYpZiOypbg',
    path: '/favourite-djs',
    titleColumn: 'Name',
  },
  {
    key: 'holidayWishList',
    label: 'Holiday wish list',
    sheetId: '1GX6KF20f3Nrb3m8T9th7UIV_uuePj4Ivlc_yLgo-4Bo',
    path: '/holiday-wish-list',
    titleColumn: 'Name',
    subtitleColumn: 'Country',
  },
  {
    key: 'restaurantWishList',
    label: 'Restaurant wish list',
    sheetId: '13gz7lPQ61f_WKQ_xio_QBlUcFB9Dl0yVBynwEadVO_4',
    path: '/restaurant-wish-list',
    titleColumn: 'Restaurant Name',
    subtitleColumn: 'Cuisine',
  },
  {
    key: 'articles',
    label: 'Favourite articles',
    sheetId: '1R928oTM4hiTFXZ6Ww9-2pMKLAWy2Wjf3Z9xrXC6GTa0',
    path: '/favourite-articles',
    titleColumn: 'About',
  },
  {
    key: 'beers',
    label: 'Favourite beers',
    sheetId: '1pNNIw849xWrQHtDptwInGs6Un0AZh-fgXUssC3XIrHM',
    path: '/favourite-beers',
    titleColumn: 'Beer Name',
    subtitleColumn: 'Brewery',
  },
  {
    key: 'cheese',
    label: 'Favourite cheese',
    sheetId: '1UDjT7_Q5rBPQasn4o2qxUOsEcElEI67nl-ep9YTLc-E',
    path: '/favourite-cheese',
    titleColumn: 'Name',
    subtitleColumn: 'Bought From',
  },
];
