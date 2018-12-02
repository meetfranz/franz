import AppApi from './AppApi';
import ServicesApi from './ServicesApi';
import RecipePreviewsApi from './RecipePreviewsApi';
import RecipesApi from './RecipesApi';
import UserApi from './UserApi';
import LocalApi from './LocalApi';
import PaymentApi from './PaymentApi';
import NewsApi from './NewsApi';
import FeaturesApi from './FeaturesApi';

export default (server, local) => ({
  app: new AppApi(server, local),
  services: new ServicesApi(server, local),
  recipePreviews: new RecipePreviewsApi(server, local),
  recipes: new RecipesApi(server, local),
  features: new FeaturesApi(server, local),
  user: new UserApi(server, local),
  local: new LocalApi(server, local),
  payment: new PaymentApi(server, local),
  news: new NewsApi(server, local),
});
