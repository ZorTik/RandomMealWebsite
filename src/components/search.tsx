import {CenteredColumn, HrText} from "./helpers";

import "../styles/search-style.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBurger, faMagnifyingGlassArrowRight} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {Badge, Button, Col, Image, Row} from "react-bootstrap";
import {Component, useState} from "react";
import {Cookies, withCookies} from "react-cookie";
import {Circle} from "./shapes";

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
        this.forceMealUpdate();
    }

    forceMealUpdate(recipe: RecipeResponse | null = null) {
        if(recipe == null) {
            console.log("Recipe null");
            fetch(AppSearch.MEAL_RAND_URL)
                .then(res => res.json())
                .then(res => {
                    this.forceMealUpdate(res.meals[0] as RecipeResponse);
                });
            return;
        }
        this.setState({
            recipe: recipe
        });
    }

    render() {
        return (
            <Col className="bgr-dark search-container d-flex flex-column align-content-center">
                <Col className={"search-welcome-bg"}>
                    <CenteredColumn className={"search-welcome"}>
                        <FontAwesomeIcon icon={faBurger} className={"fa-ico"} style={{
                            width: "80px", height: "80px"
                        }} />
                        <h1>Find recipe <span>just</span> for you.</h1>
                        <h2>Just click on button at the bottom of this lore and you should see your new recipe!</h2>
                        <Link to={"/"}>
                            <Button variant={"primary btn-round"} onClick={() => {
                                this.setState({
                                    recipe: null
                                });
                                this.forceMealUpdate();
                            }}>
                        <span>
                            Find Another
                            <FontAwesomeIcon icon={faMagnifyingGlassArrowRight} className={"search-ico"} />
                        </span>
                            </Button>
                        </Link>
                    </CenteredColumn>
                </Col>
                <Row>
                    {this.state.recipe != null
                        ? <RecipeSearchModule parent={this} cookies={this.props.cookies} randRecipe={this.state.recipe} className={"search-module"} />
                        : <RecipeSearchModule parent={this} cookies={this.props.cookies} className={"search-module"} />}
                </Row>
            </Col>
        )
    }

}

class RecipeSearchModule extends Component<any, any> {

    private parent: AppSearch;
    private cookies: Cookies;
    private lastRecipes: any[] = [];

    constructor(props: any) {
        super(props);
        this.parent = props.parent;
        this.cookies = props.cookies;
        this.state = {
            cookies: (() => {
                try {
                    return [...Object.values(this.cookies.get("lastMeals") || "[]")];
                } catch(e) {
                    console.error(`An error occured while loading last meals cookie! (${e})`);
                    this.cookies.set("lastMeals", "[]", {path: "/"})
                    return [];
                }
            })()
        };
    }

    async updateLastRecipes() {
        this.lastRecipes = (await Promise.allSettled(this.state.cookies.map((id: any) => {
            return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
                .then(res => {
                    return res.json();
                });
        }))).filter(obj => obj.status === "fulfilled")
            .map(obj => (obj as PromiseFulfilledResult<any>).value)
            .filter(obj => obj.meals != null)
            .flatMap(obj => obj.meals);
        console.log(this.lastRecipes);
    }

    setState<K extends keyof any>(state: any, callback?: () => void) {
        super.setState(state, callback);
        this.cookies.set("lastMeals", JSON.stringify([...Array.from(new Set(
            state.cookies || []
        ).values())]), {
            path: "/"
        })
    }

    componentDidMount() {
        this.updateLastRecipes();
    }

    render() {
        const randRecipe = this.props.randRecipe || null;
        if(randRecipe != null && !(Array.from(this.state.cookies) as any[])
            .some((mealId: any) => mealId === randRecipe.idMeal)) {
            this.setState({
                cookies: [randRecipe, ...(this.state.cookies as any[])]
            });
        }
        const lastMealElements: JSX.Element[] = [];
        let index = 0;
        while(lastMealElements.length < 3) {
            const style = (index + 2) % 3 === 0
                ? { margin: "0px 5px" } : {};
            const rcp = this.lastRecipes.length > index
                ? this.lastRecipes[index] : null;
            lastMealElements.push(rcp != null
                ?
                <RecipeCard preview recipe={rcp} style={style}>
                    <Row className={"recipe-preview-body d-flex flex-row justify-content-center"}>
                        <Button onClick={() => this.parent.forceMealUpdate(rcp)}>
                            Load Recipe
                        </Button>
                    </Row>
                </RecipeCard>
                : <RecipeCard preview style={style} />);
            index++;
        }
        return (
            <Col className={this.props.className || ""}>
                <HrText text={"Random Recipe"} />
                {randRecipe != null
                ? <RecipeCard recipe={randRecipe} />
                : (() => (
                    <p>Finding random recipe...</p>
                    ))()}
                <HrText text={"Your Last Recipes"} />
                <Row>
                    {lastMealElements}
                </Row>
            </Col>
        )
    }

}

const RecipeCard = (props: any) => {
    return (
        props.recipe
        ? <Col className={"recipe-card"} style={props.style || {}}>
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
                {
                    !(props.preview || false) ? <Row className={"recipe-body"}>
                        <Image src={props.recipe.strMealThumb} />
                        <h2>Instructions:</h2>
                        <p>{props.recipe.strInstructions}</p>
                    </Row> : undefined
                }
                {props.children || []}
            </Col>
            : <Col className={"recipe-card-empty"} style={props.style || {}} />
    )
};


type RecipeResponse = {
    strMeal: string;
    strMealThumb: string;
    strTags: string;
    strInstructions: string;
    strArea: string;
}

export default withCookies(AppSearch);