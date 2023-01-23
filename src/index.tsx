import React from "react";
import ReactDOM from "react-dom/client";
import { createGlobalStyle } from "styled-components";
import { ClientProvider } from "./components/clients";
import { App } from "./components/app";

const entryPoint = document.createElement("div");
document.body.appendChild(entryPoint);

const GlobalStyle = createGlobalStyle`
  * {
    font-family: "Zilla Slab", HelveticaNeue, Helvetica, Arial, sans-serif;
  }
  body {
    background-color: #070606;
    color: white;
    --width: 0px;
  }
  a { 
      color: #828fff;
      &:hover {
        text-decoration: underline;
        filter: brightness(80%);
    }
  }
  textarea {
    resize: none;
    overflow: hidden;
  }
  input[type=text], textarea, select {
    display: block;
    box-sizing: border-box;
    width: calc(275px - var(--width));
  }
`;

const root = ReactDOM.createRoot(entryPoint);
root.render(
  <ClientProvider>
    <GlobalStyle />
    <App />
  </ClientProvider>
);
