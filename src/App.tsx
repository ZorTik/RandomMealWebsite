import React from 'react';
import {Container} from "react-bootstrap";
import AppFooter from "./components/footer";
import {Route, Routes} from "react-router-dom";
import NotFound from "./components/not-found";
import AppHeader from "./components/header";

import "./App.css";
import AppSearch from "./components/search";
import {useCookies} from "react-cookie";

function App() {
    const [cookies, setCookie] = useCookies();
  return (
      <Container fluid className={"App"}>
          <Routes>
              <Route path="/" element={<AppSearch />}></Route>
              <Route path="*" element={<NotFound />} />
          </Routes>
          <AppFooter />
      </Container>
  );
}

export default App;
