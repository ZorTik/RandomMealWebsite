import "../App.css";

const Circle = (props: {
    size: number
    color: any,
    style: any
}) => {
    const style = props.style;
    style.width = `${props.size}px`;
    style.height = `${props.size}px`;
    style.backgroundColor = props.color;
    return (
        <div className={"circle"} style={style} />
    )
};

export {Circle};