import {Col, Row} from "react-bootstrap";

import "../styles/util.css";

const CenteredColumn = (props: any) => {
    return (
        <Col className={props.className || ""} style={{
                textAlign: "center"
            }}>
            {props.children}
        </Col>
    );
}

const HrText = (props: {
    text: string
}) => {
    return (
        <Row className={"hr-text"}>
            <Col className={"hr-text-line"} />
            <Col className={"hr-text-content"}><p>{props.text}</p></Col>
            <Col className={"hr-text-line"} />
        </Row>
    );
};

export {CenteredColumn, HrText};