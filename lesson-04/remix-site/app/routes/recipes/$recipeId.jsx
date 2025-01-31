import { Link, redirect } from "remix";
import { useLoaderData } from "remix";
import db from "~/db/db.server";
import RecipeStylesUrl from "~/styles/Recipe.css";

export const loader = async function ({ params }) {
  const recipe = db.data.recipes.find((p) => p.id === params.recipeId);

  if (!recipe) {
    throw new Error("recipe not found");
  }
  return {
    recipe,
  };
};

export const action = async function ({ request, params }) {
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    db.data.recipes = db.data.recipes.filter((p) => p.id !== params.recipeId);
    db.write();
    return redirect("/recipes");
  }
};

export function links() {
  return [
    {
      rel: "stylesheet",
      href: RecipeStylesUrl,
    },
  ];
}

export default function Recipe() {
  const { recipe } = useLoaderData();

  return (
    <div>
      <div className="page-header">
        <h1>{recipe.title}</h1>
        <Link to=".." className="btn btn-reverse">
          Back
        </Link>
      </div>
      <div className="recipe-content">
        <img src={recipe.img} ></img>
        <div className="recipe-info">
          <h2>Description</h2>
          <p className="page-content">{recipe.body}</p>
          <h2>Ingredients</h2>
          <ul className="page-content">
            {recipe.seperatedIngredients.map((ingredient) => {
                return (
                  <li>
                    {ingredient}
                  </li>
              )
            })}</ul>
            <h2>Author</h2>
            <p className="page-content">{recipe.author}</p>
        </div>
        </div>
      <div className="page-footer">
        <form method="post">
          <input type="hidden" name="_method" value="delete" />
          <button type="submit" className="btn btn-delete">
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
