import React, { useState } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';

export default function Nav() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTravelDropdownOpen, setIsTravelDropdownOpen] = useState(false);
  const [isFavouritesDropdownOpen, setIsFavouritesDropdownOpen] = useState(false);
  const [isWishListDropdownOpen, setIsWishListDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleFavouritesDropdown = (open?: boolean) => {
    if (open === undefined) {
      setIsFavouritesDropdownOpen((prev) => !prev);
    } else {
      setIsFavouritesDropdownOpen(open);
    }
  };

  const toggleTravelDropdown = (open?: boolean) => {
    if (open === undefined) {
      setIsTravelDropdownOpen((prev) => !prev);
    } else {
      setIsTravelDropdownOpen(open);
    }
  };

  const toggleWishListDropdown = (open?: boolean) => {
    if (open === undefined) {
      setIsWishListDropdownOpen((prev) => !prev);
    } else {
      setIsWishListDropdownOpen(open);
    }
  };

  return (
    <StyledNav>
      <BurgerButton onClick={toggleDropdown}>
        <span></span>
        <span></span>
        <span></span>
      </BurgerButton>
      <NavList className={isDropdownOpen ? 'open' : ''}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/blog">The Blog</Link>
        </li>
        <li>
          <Dropdown
            onMouseEnter={() => toggleFavouritesDropdown(true)}
            onMouseLeave={() => toggleFavouritesDropdown(false)}>
            <DropdownButton>Favourites</DropdownButton>
            <DropdownMenu isDropdownOpen={isFavouritesDropdownOpen}>
              <li>
                <Link href="/favourite-countries">Countries Visited</Link>
              </li>
              <li>
                <Link href="/favourite-cities">Cities Visited</Link>
              </li>
              <li>
                <Link href="/favourite-movies">Movies</Link>
              </li>
              <li>
                <Link href="/favourite-books">Books</Link>
              </li>
              <li>
                <Link href="/favourite-djs">DJs</Link>
              </li>
              <li>
                <Link href="/favourite-cheese">Cheese</Link>
              </li>
              <li>
                <Link href="/favourite-beers">Beers</Link>
              </li>
              <li>
                <Link href="/favourite-restaurants">Restaurants</Link>
              </li>
            </DropdownMenu>
          </Dropdown>
        </li>
        <li>
          <Dropdown
            onMouseEnter={() => toggleWishListDropdown(true)}
            onMouseLeave={() => toggleWishListDropdown(false)}>
            <DropdownButton>Wish Lists</DropdownButton>
            <DropdownMenu isDropdownOpen={isWishListDropdownOpen}>
              <li>
                <Link href="/holiday-wish-list">Holidays</Link>
              </li>
              <li>
                <Link href="/restaurant-wish-list">Restaurants</Link>
              </li>
            </DropdownMenu>
          </Dropdown>
        </li>
        <li>
          <Dropdown
            onMouseEnter={() => toggleTravelDropdown(true)}
            onMouseLeave={() => toggleTravelDropdown(false)}>
            <DropdownButton>Travel</DropdownButton>
            <DropdownMenu isDropdownOpen={isTravelDropdownOpen}>
              <li>
                <Link href="/countries-visited">Countries Visited</Link>
              </li>
            </DropdownMenu>
          </Dropdown>
        </li>
        <li>
          <Link href="/music">Music</Link>
        </li>
        <li>
          <Link href="/politics">Politics</Link>
        </li>
      </NavList>
    </StyledNav>
  );
}

const StyledNav = styled.nav`
  background-color: #333;
  color: #fff;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 2px;
  position: sticky;
  z-index: 10;
  top: 0;
  left: 0;
  padding: 1rem;

  @media screen and (min-width: 769px) {
    width: 100%;
    padding: 0;
  }
`;

const NavList = styled.ul`
  display: flex;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 1rem;
  @media (max-width: 768px) {
    padding: 0.5rem;
    display: none;

    &.open {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  li {
    margin: 0 auto;
    @media (min-width: 768px) {
      padding: 0.5rem 0.5rem;
      margin: unset;
    }
    @media (min-width: 1000px) {
      padding: 0.5rem 1rem;
    }

    div {
      text-align: center;
    }
  }
  a {
    color: #fff;
    text-decoration: none;
    font-size: 1.5rem;
  }
`;

const BurgerButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: relative;
    width: 30px;
    height: 22px;
    background-color: transparent;
    border: none;
    padding: 0;
    margin-right: 1rem;
    cursor: pointer;

    span {
      display: block;
      position: absolute;
      width: 100%;
      height: 2px;
      background-color: #fff;
      transition:
        transform 0.3s,
        opacity 0.3s;
    }

    span:nth-of-type(1) {
      top: 0;
    }

    span:nth-of-type(2) {
      top: 50%;
      transform: translateY(-50%);
    }

    span:nth-of-type(3) {
      bottom: 0;
    }
  }
`;

const Dropdown = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  text-decoration: none;
  font-size: 1.5rem;
  cursor: pointer;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 2px;
`;

const DropdownMenu = styled.ul<{ isDropdownOpen: boolean }>`
  overflow: hidden;
  max-height: ${(props) => (props.isDropdownOpen ? '1000px' : '0')};
  opacity: ${(props) => (props.isDropdownOpen ? 1 : 0)};
  transition:
    max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s;
  position: absolute;
  background-color: #333;
  list-style: none;
  margin: 0;
  padding: 0.5rem;
  min-width: 180px;
  z-index: 100;
  pointer-events: ${(props) => (props.isDropdownOpen ? 'auto' : 'none')};

  li {
    padding: 0;

    a {
      color: #fff;
      text-decoration: none;
      font-size: 18px;
    }
  }

  @media (max-width: 768px) {
    position: static;
    width: 100%;
    min-width: 0;
    padding: 0;
    box-shadow: none;
    background: none;
    li {
      background: #333;
    }
  }
`;
