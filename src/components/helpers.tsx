import {Col} from "react-bootstrap";

const CenteredColumn = (props: any) => {
    return (
        <Col className={props.className || ""} style={{
                textAlign: "center"
            }}>
            {props.children}
        </Col>
    );
}

export {CenteredColumn};