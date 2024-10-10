import logging
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)  # Set level to DEBUG for detailed logs


# Sample recipes database
recipes = {
    "all":{
    "pasta": {
        "type": "vegetarian",
        "ingredients": {
            "pasta": "200g",
            "tomato sauce": "1 cup",
            "cheese": "100g, grated"
        },
        "instructions": [
            "Boil a pot of water and add a pinch of salt.",
            "Add 200g of pasta and cook for about 8-10 minutes until al dente.",
            "In a separate saucepan, heat 1 cup of tomato sauce.",
            "Drain the pasta and mix it with the tomato sauce.",
            "Serve topped with 100g of grated cheese."
        ]
    },
    "salad": {
        "type": "vegan",
        "ingredients": {
            "lettuce": "1 head, chopped",
            "tomato": "2, diced",
            "cucumber": "1, sliced",
            "olive oil": "2 tablespoons",
            "vinegar": "1 tablespoon",
            "salt": "to taste"
        },
        "instructions": [
            "In a large bowl, combine the chopped lettuce, diced tomatoes, and sliced cucumber.",
            "In a small bowl, whisk together 2 tablespoons of olive oil, 1 tablespoon of vinegar, and salt to taste.",
            "Pour the dressing over the salad and toss to combine."
        ]
    },
    "chocolate cake": {
        "type": "vegetarian",
        "ingredients": {
            "flour": "1 ¾ cups",
            "sugar": "2 cups",
            "cocoa powder": "¾ cup",
            "baking powder": "1 ½ teaspoons",
            "milk": "1 cup",
            "eggs": "2",
            "butter": "½ cup, melted",
            "vanilla extract": "2 teaspoons"
        },
        "instructions": [
            "Preheat the oven to 350°F (175°C).",
            "In a bowl, mix 1 ¾ cups flour, 2 cups sugar, ¾ cup cocoa powder, and 1 ½ teaspoons baking powder.",
            "In another bowl, whisk together 1 cup milk, 2 eggs, ½ cup melted butter, and 2 teaspoons vanilla extract.",
            "Combine the wet and dry ingredients and mix until smooth.",
            "Pour the batter into a greased cake pan.",
            "Bake for 30 minutes or until a toothpick comes out clean."
        ]
    },
    "chicken stir fry": {
        "type": "non-vegetarian",
        "ingredients": {
            "chicken breast": "500g, sliced",
            "bell peppers": "2, sliced",
            "onion": "1, sliced",
            "soy sauce": "3 tablespoons",
            "ginger": "1 teaspoon, minced",
            "garlic": "2 cloves, minced",
            "oil": "2 tablespoons"
        },
        "instructions": [
            "Heat 2 tablespoons of oil in a large pan over medium-high heat.",
            "Add 500g of sliced chicken breast and cook until browned.",
            "Add 2 sliced bell peppers, 1 sliced onion, 1 teaspoon minced ginger, and 2 cloves minced garlic.",
            "Stir fry for 5-7 minutes until vegetables are tender.",
            "Add 3 tablespoons of soy sauce and mix well before serving."
        ]
    },
    "vegetable soup": {
        "type": "vegan",
        "ingredients": {
            "carrots": "2, diced",
            "celery": "2 stalks, diced",
            "onion": "1, chopped",
            "vegetable broth": "4 cups",
            "potatoes": "2, diced",
            "spinach": "2 cups, chopped",
            "salt": "to taste",
            "pepper": "to taste"
        },
        "instructions": [
            "In a large pot, sauté 1 chopped onion, 2 diced carrots, and 2 diced celery stalks in a little oil until softened.",
            "Add 4 cups of vegetable broth and 2 diced potatoes.",
            "Bring to a boil and then reduce heat to simmer for 15 minutes.",
            "Stir in 2 cups of chopped spinach and cook for an additional 5 minutes.",
            "Season with salt and pepper to taste."
        ]
    },
    "omelette": {
        "type": "vegetarian",
        "ingredients": {
            "eggs": "3",
            "milk": "2 tablespoons",
            "cheese": "50g, grated",
            "bell peppers": "1, diced",
            "onions": "½, diced",
            "salt": "to taste",
            "pepper": "to taste",
            "butter": "1 tablespoon"
        },
        "instructions": [
            "In a bowl, whisk together 3 eggs, 2 tablespoons of milk, salt, and pepper.",
            "In a non-stick skillet, melt 1 tablespoon of butter over medium heat.",
            "Add ½ diced onion and 1 diced bell pepper, and sauté until soft.",
            "Pour the egg mixture into the skillet and cook until the edges start to set.",
            "Sprinkle 50g of grated cheese on top and fold the omelette in half.",
            "Cook for another minute until the cheese melts."
        ]
    },
    "guacamole": {
        "type": "vegan",
        "ingredients": {
            "avocados": "2, ripe",
            "lime juice": "1 lime",
            "onion": "¼, finely chopped",
            "tomato": "1, diced",
            "cilantro": "¼ cup, chopped",
            "salt": "to taste"
        },
        "instructions": [
            "Cut 2 ripe avocados in half, remove the pit, and scoop the flesh into a bowl.",
            "Mash the avocado with a fork until smooth.",
            "Add the juice of 1 lime, ¼ finely chopped onion, 1 diced tomato, ¼ cup chopped cilantro, and salt to taste.",
            "Mix until combined and serve immediately."
        ]
    },
    "beef tacos": {
        "type": "non-vegetarian",
        "ingredients": {
            "ground beef": "500g",
            "taco shells": "8",
            "lettuce": "1 cup, shredded",
            "cheese": "100g, grated",
            "tomato": "1, diced",
            "taco seasoning": "1 packet"
        },
        "instructions": [
            "In a skillet, cook 500g of ground beef over medium heat until browned.",
            "Add 1 packet of taco seasoning and follow the package instructions.",
            "Warm taco shells according to the package instructions.",
            "Fill each taco shell with the seasoned beef, shredded lettuce, diced tomato, and 100g of grated cheese."
        ]
    },
    "banana bread": {
        "type": "vegetarian",
        "ingredients": {
            "ripe bananas": "3, mashed",
            "flour": "1 ½ cups",
            "sugar": "1 cup",
            "eggs": "2",
            "baking soda": "1 teaspoon",
            "butter": "½ cup, melted",
            "vanilla extract": "1 teaspoon"
        },
        "instructions": [
            "Preheat the oven to 350°F (175°C).",
            "In a bowl, mix 1 ½ cups flour, 1 cup sugar, and 1 teaspoon baking soda.",
            "In another bowl, combine 3 mashed bananas, 2 eggs, ½ cup melted butter, and 1 teaspoon vanilla extract.",
            "Combine the wet and dry ingredients and mix until just combined.",
            "Pour the batter into a greased loaf pan and bake for 60 minutes."
        ]
    },
    "pancakes": {
        "type": "vegetarian",
        "ingredients": {
            "flour": "1 cup",
            "milk": "1 cup",
            "eggs": "1",
            "sugar": "2 tablespoons",
            "baking powder": "2 teaspoons",
            "butter": "2 tablespoons, melted"
        },
        "instructions": [
            "In a bowl, mix 1 cup flour, 2 tablespoons sugar, and 2 teaspoons baking powder.",
            "In another bowl, whisk together 1 cup milk, 1 egg, and 2 tablespoons melted butter.",
            "Combine the wet and dry ingredients, stirring until just mixed.",
            "Pour batter onto a hot griddle and cook until bubbles form, then flip and cook until golden brown."
        ]
    },
    "lasagna": {
        "type": "non-vegetarian",
        "ingredients": {
            "lasagna noodles": "9 sheets",
            "ricotta cheese": "1 cup",
            "mozzarella cheese": "2 cups, shredded",
            "marinara sauce": "3 cups",
            "ground beef": "500g, cooked and drained",
            "parmesan cheese": "½ cup, grated"
        },
        "instructions": [
            "Preheat the oven to 375°F (190°C).",
            "In a baking dish, spread 1 cup of marinara sauce on the bottom.",
            "Layer 3 sheets of lasagna noodles over the sauce.",
            "Spread half of the ricotta cheese, half of the ground beef, and a third of the mozzarella cheese.",
            "Repeat the layers, finishing with noodles and marinara sauce on top.",
            "Sprinkle with remaining mozzarella and ½ cup grated parmesan.",
            "Cover with foil and bake for 25 minutes, then remove foil and bake for an additional 15 minutes."
        ]
    },
    "apple pie": {
        "type": "vegetarian",
        "ingredients": {
            "apples": "6, peeled and sliced",
            "sugar": "¾ cup",
            "cinnamon": "1 teaspoon",
            "pie crust": "1 (9-inch) pie crust",
            "butter": "2 tablespoons, diced"
        },
        "instructions": [
            "Preheat the oven to 425°F (220°C).",
            "In a large bowl, mix 6 sliced apples with ¾ cup sugar and 1 teaspoon cinnamon.",
            "Place the pie crust in a pie dish and fill it with the apple mixture.",
            "Dot the top with 2 tablespoons of diced butter.",
            "Cover with a second crust, seal the edges, and cut slits for steam.",
            "Bake for 45 minutes or until the crust is golden brown."
        ]
    },
    "shrimp scampi": {
        "type": "non-vegetarian",
        "ingredients": {
            "shrimp": "500g, peeled and deveined",
            "garlic": "4 cloves, minced",
            "butter": "½ cup",
            "lemon juice": "¼ cup",
            "parsley": "¼ cup, chopped",
            "spaghetti": "300g"
        },
        "instructions": [
            "Cook 300g of spaghetti according to package instructions.",
            "In a large skillet, melt ½ cup of butter over medium heat.",
            "Add 4 minced garlic cloves and cook until fragrant.",
            "Add 500g of shrimp and cook until pink, about 3-4 minutes.",
            "Stir in ¼ cup lemon juice and ¼ cup chopped parsley.",
            "Toss the cooked spaghetti in the skillet and mix well before serving."
        ]
    }
    }
}

# Route to render the home page (HTML)
@app.route('/', methods=['GET', 'POST'])
def home():
    app.logger.debug(f"Request method: {request.method}")  # Log the request method
    if request.method == 'POST':
        # Handle the form submission
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        return f"User {username} registered with email {email}."
    return render_template('index.html')  # Ensure your index.html is in the 'templates' folder

# API endpoint to return all recipes
@app.route('/recipes', methods=['GET'])
def get_recipes():
    return jsonify(recipes)

# API endpoint to return a specific recipe or filtered recipes
@app.route('/recipe', methods=['GET'])
def get_recipe():
    recipe_type = request.args.get('type')
    recipe_name = request.args.get('name')

    matched_recipes = {}

    # Check if recipe_type is provided
    if recipe_type:
        if recipe_type.lower() == 'all':
            matched_recipes = recipes['all']
        else:
            matched_recipes = {k: v for k, v in recipes['all'].items() if v['type'] == recipe_type.lower()}
    else:
        matched_recipes = recipes['all']

    # Filter by recipe name if provided
    if recipe_name:
        matched_recipes = {k: v for k, v in matched_recipes.items() if k.lower() == recipe_name.lower()}

    return jsonify(matched_recipes), 200

if __name__ == '__main__':
    # Run the Flask app on a specific port and allow it to be accessible externally
    app.run(host='0.0.0.0', port=3306, debug=True)
