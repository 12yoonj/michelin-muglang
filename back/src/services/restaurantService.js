import { Restaurant } from "../db";

class restaurantService {
  static async getRestaurants() {
    const restaurants = await Restaurant.findAll();
    return restaurants;
  }

  static async getRestaurantInfo({ restaurant_id }) {
    const restaurant = await Restaurant.findById({ restaurant_id });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!restaurant) {
      const errorMessage = "해당 식당은 존재하지 않습니다.";
      return { errorMessage };
    }

    return restaurant;
  }
}

export { restaurantService };