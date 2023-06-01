import React from "react";
import Link from "next/link";
import styled from "@emotion/styled";

export default function Nav() {
  return (
    <StyledNav>
      <ul>
        <li>
          <Link href='/'>Home</Link>
        </li>
        <li>
          <Link href='/roasts'>Roasts</Link>
        </li>
        <li>
          <Link href='/music'>Music</Link>
        </li>
        <li>
          <Link href='/travel'>Travel</Link>
        </li>
        <li>
          <Link href='/sites'>Sites</Link>
        </li>
      </ul>
    </StyledNav>
  );
}

const StyledNav = styled.nav`
  background-color: #333;
  color: #fff;
  padding: 1rem;
  ul {
    display: flex;
    justify-content: space-evenly;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    padding: 0;
  }
  a {
    color: #fff;
    text-decoration: none;
  }
`;
