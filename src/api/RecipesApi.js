export default class RecipesApi {
  constructor(server) {
    this.server = server;
  }

  all() {
    return this.server.getInstalledRecipes();
  }

  install(recipeId) {
    return this.server.getRecipePackage(recipeId);
  }

  update(recipes) {
    return this.server.getRecipeUpdates(recipes);
  }
}
