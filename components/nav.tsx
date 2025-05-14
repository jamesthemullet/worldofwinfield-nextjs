import React, { useState } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';

export default function Nav() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTravelDropdownOpen, setIsTravelDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleTravelDropdown = (open?: boolean) => {
    if (open === undefined) {
      setIsTravelDropdownOpen((prev) => !prev);
    } else {
      setIsTravelDropdownOpen(open);
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
          <Link href="/favourites">Favourites</Link>
        </li>
        <li>
          <Link href="/wants">Want To Do</Link>
        </li>
        <li>
          <Dropdown
            onMouseEnter={() => toggleTravelDropdown(true)}
            onMouseLeave={() => toggleTravelDropdown(false)}>
            <DropdownButton>Travel</DropdownButton>
            <DropdownMenu isTravelDropdownOpen={isTravelDropdownOpen}>
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
    @media (min-width: 768px) {
      padding: 0.5rem 0.5rem;
    }
    @media (min-width: 1000px) {
      padding: 0.5rem 1rem;
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

const DropdownMenu = styled.ul<{ isTravelDropdownOpen: boolean }>`
  display: ${(props) => (props.isTravelDropdownOpen ? 'block' : 'none')};
  position: absolute;
  background-color: #333;
  list-style: none;
  margin: 0;
  padding: 0.5rem;

  &.open {
    display: block;
  }

  li {
    padding: 0.5rem 1rem;

    a {
      color: #fff;
      text-decoration: none;
    }
  }
`;
