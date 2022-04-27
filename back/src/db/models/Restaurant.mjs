import { RestaurantModel } from "../schemas/restaurant.mjs";

class Restaurant {
  static async create({
    name,
    address,
    location,
    minPrice,
    maxPrice,
    currency,
    cuisine,
    longitude,
    latitude,
    phoneNumber,
    url,
    websiteUrl,
    award,
  }) {
    const createdNewRestaurant = await RestaurantModel.create({
      name,
      address,
      location,
      minPrice,
      maxPrice,
      currency,
      cuisine,
      longitude,
      latitude,
      phoneNumber,
      url,
      websiteUrl,
      award,
    });
    return createdNewRestaurant;
  }

  static async findByName({ name }) {
    const restaurant = await RestaurantModel.findOne({ name });
    return restaurant;
  }

  static async findById({ id }) {
    const restaurant = await RestaurantModel.findOne({ _id: id });
    return restaurant;
  }

  static async findAllByCountry({ country }) {
    const restaurants = await RestaurantModel.find({ country });
    return restaurants;
  }

  static async findAll() {
    const restaurants = await RestaurantModel.find({});
    return restaurants;
  }

  static async findAllByCountryPaging({ page, pageSize, country }) {
    try {
      const restaurants = await RestaurantModel.find({ country })
        .sort({ _id: 1 })
        .skip(page * pageSize)
        .limit(pageSize);
      return restaurants;
    } catch (error) {
      return error;
    }
  }

  static async findAllPaging({ page, pageSize }) {
    try {
      const restaurants = await RestaurantModel.find({})
        .sort({ _id: 1 })
        .skip(page * pageSize)
        .limit(pageSize);
      return restaurants;
    } catch (error) {
      return error;
    }
  }

  static async findAllByCuisinePaging({ page, pageSize, cuisine }) {
    try {
      const restaurants = await RestaurantModel.find({
        cuisine,
      })
        .sort({ _id: 1 })
        .skip(page * pageSize)
        .limit(pageSize);
      return restaurants;
    } catch (error) {
      return error;
    }
  }

  static async findAllByQuery({
    page,
    pageSize,
    name = "",
    address = "",
    location = "",
    minPrice = 0,
    maxPrice = Infinity,
    cuisine = "",
    award = "",
  }) {
    try {
      const restaurants = await RestaurantModel.find({
        name: { $regex: name, $options: "i" },
        address: { $regex: address, $options: "i" },
        location: { $regex: location, $options: "i" },
        minPrice: { $gte: parseInt(minPrice) },
        maxPrice: { $lte: parseInt(maxPrice) },
        cuisine: { $regex: cuisine, $options: "i" },
        award: { $regex: award, $options: "i" },
      })
        .sort({ _id: 1 })
        .skip(page * pageSize)
        .limit(pageSize);
      return restaurants;
    } catch (error) {
      return error;
    }
  }
}

export { Restaurant };
