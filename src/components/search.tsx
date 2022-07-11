import {CenteredColumn} from "./helpers";

import "../styles/search-style.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBurger, faMagnifyingGlassArrowRight} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {Badge, Button, Col, Image, Row} from "react-bootstrap";
import {Component, useState} from "react";

class AppSearch extends Component<any, {
    recipe: RecipeResponse | null
}> {
    private static MEAL_RAND_URL = "https://www.themealdb.com/api/json/v1/1/random.php";

    constructor(props: any) {
        super(props);
        this.state = {
            recipe: null
        };
    }

    componentDidMount() {
        this.forceUpdate();
    }

    forceUpdate() {
        fetch(AppSearch.MEAL_RAND_URL)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    recipe: res.meals[0] as RecipeResponse
                });
            });
    }

    render() {
        return (
            <Col className="bgr-dark search-container d-flex flex-column align-content-center">
                <CenteredColumn className={"search-welcome"}>
                    <FontAwesomeIcon icon={faBurger} className={"fa-ico"} style={{
                        width: "80px", height: "80px"
                    }} />
                    <h1>Find recipe <span>right</span> for you.</h1>
                    <h2>Just click on button at the bottom of this lore and you should see your new recipe!</h2>
                    <Link to={"/"}>
                        <Button variant={"primary btn-round"} onClick={() => {
                            this.setState({
                                recipe: null
                            });
                            this.forceUpdate();
                        }}>
                        <span>
                            Find Another
                            <FontAwesomeIcon icon={faMagnifyingGlassArrowRight} className={"search-ico"} />
                        </span>
                        </Button>
                    </Link>
                </CenteredColumn>
                {this.state.recipe != null
                ? <RecipeSearchModule randRecipe={this.state.recipe} className={"search-module"} />
                : <RecipeSearchModule className={"search-module"} />}
            </Col>
        )
    }

}

class RecipeSearchModule extends Component<any, any> {

    render() {
        return (
            <Col className={this.props.className || ""}>
                {this.props.randRecipe != null
                ? <RecipeCard recipe={this.props.randRecipe} />
                : (() => (
                    <p>Finding random recipe...</p>
                    ))()}
            </Col>
        )
    }

}

const RecipeCard = (props: { recipe: any }) => {
    return (
        <Col className={"recipe-card"}>
            <Row className={"recipe-heading"}>
                <h2>{props.recipe.strMeal}</h2>
                <h3>{
                    (() => {
                        const ingredients = Object.keys(props.recipe)
                            .filter(k => k.includes("strIngredient"))
                            .map(k => props.recipe[k])
                            .filter(v => v != null && v.length > 0);
                        return ingredients.join(", ");
                    })()
                }</h3>
                {(() => {
                    const tagsString = props.recipe.strTags;
                    return (
                        <span>{[<Badge>{props.recipe.strArea}</Badge>, ...(tagsString != null
                            ? tagsString.split(",")
                            .map((tag: any) => {
                                return <Badge>{tag}</Badge>
                            })
                            : [])]}</span>
                    )
                })()}
            </Row>
            <Row className={"recipe-body"}>
                <Image src={props.recipe.strMealThumb} />
                <h2>Instructions:</h2>
                <p>{props.recipe.strInstructions}</p>
            </Row>
        </Col>
    )
};

type RecipeResponse = {
    strMeal: string;
    strMealThumb: string;
    strTags: string;
    strInstructions: string;
    strArea: string;
}

export default AppSearch;