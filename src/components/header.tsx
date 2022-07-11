import {Nav} from "react-bootstrap";
import {Link} from "react-router-dom";

import "../styles/header.css";
import "../App.css";

const AppHeader = () => {
    return (
        <Nav className={"header bgr-dark"}>
            <Link to={"/"} >Home</Link>
        </Nav>
    );
}

export default AppHeader;