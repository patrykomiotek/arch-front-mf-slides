import Reveal from "reveal.js";
import Markdown from "reveal.js/plugin/markdown/markdown.esm.js";
import Highlight from "reveal.js/plugin/highlight/highlight.esm.js";
import Notes from "reveal.js/plugin/notes/notes.esm.js";
import Search from "reveal.js/plugin/search/search.esm.js";

// Fonty hostowane lokalnie - slajdy muszą działać bez sieci (npm start offline).
import "@fontsource/lato/400.css";
import "@fontsource/lato/400-italic.css";
import "@fontsource/lato/700.css";
import "@fontsource/lato/700-italic.css";
import "@fontsource/lato/900.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";

import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/white.css";
import "reveal.js/plugin/highlight/monokai.css";
import "../css/theme.css";

const deck = new Reveal({
  hash: true,
  slideNumber: "c/t",
  history: true,
  controls: true,
  progress: true,
  center: false,
  transition: "slide",
  width: 1280,
  height: 720,
  margin: 0.06,
  minScale: 0.2,
  maxScale: 2.0,
  pdfSeparateFragments: false,
  plugins: [Markdown, Highlight, Notes, Search],
});

deck.initialize();

window.deck = deck;
