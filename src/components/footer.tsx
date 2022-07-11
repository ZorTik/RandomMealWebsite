import {Col, Row} from "react-bootstrap";

import "../styles/footer.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRocket} from "@fortawesome/free-solid-svg-icons";

const AppFooter = () => {
    return (
        <Row className={"footer"}>
            <Col>
                <h2>About the website</h2>
                <h3>This website was created as application to <span>Orbital Studios <FontAwesomeIcon icon={faRocket} /></span> by ZorTik.</h3>
            </Col>
        </Row>
    )
};

export default AppFooter;