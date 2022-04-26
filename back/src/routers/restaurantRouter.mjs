import { Router } from "express";
import { restaurantService } from "../services/restaurantService.mjs";

const restaurantRouter = Router();

// Path: /restaurants
restaurantRouter.get("/restaurants", async function (req, res, next) {
  // 특정 국가에 있는 식당들의 정보를 얻음 (/restaurants?country=${검색할 국가 이름})
  // if (req.query.country) {
  //   try {
  //     // URI로부터 country(query)를 추출함
  //     const country = req.query.country;
  //     const restaurants = await restaurantService.getRestaurantsByCountry({
  //       country,
  //     });

  //     if (restaurants.errorMessage) {
  //       throw new Error(restaurants.errorMessage);
  //     }

  //     res.status(200).send(restaurants);
  //     return;
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  // // pagenation 시도! (/restaurants?page=${페이지 시작 위치}&pageSize=${페이지 크기})
  // else if (req.query.page && req.query.pageSize) {
  if (req.query.page && req.query.pageSize) {
    try {
      const { page, pageSize } = req.query;

      if (page <= 0) {
        const error = new Error("페이지는 1부터 시작합니다.");
        error.code = 500;
        throw error;
      }

      // 국가별 레스토랑 정보도 pagination 시도!
      if (req.query.country) {
        try {
          // URI로부터 country(query)를 추출함
          const country = req.query.country;
          console.log(country);
          const restaurants =
            await restaurantService.getRestaurantsByCountryPaging({
              page,
              pageSize,
              country,
            });

          if (restaurants.errorMessage) {
            throw new Error(restaurants.errorMessage);
          }

          res.status(200).send(restaurants);
          return;
        } catch (error) {
          next(error);
        }
      }

      const restaurants = await restaurantService.getRestaurantsPaging({
        page: parseInt(page) - 1,
        pageSize: parseInt(pageSize),
      });

      if (restaurants.errorMessage) {
        throw new Error(restaurants.errorMessage);
      }

      res.status(200).send(restaurants);
      return;
    } catch (error) {
      next(error);
    }
  }

  // 전체 식당의 목록을 얻음
  try {
    const restaurants = await restaurantService.getRestaurants();
    res.status(200).send(restaurants);
  } catch (error) {
    next(error);
  }
});

// Path: /restaurants/:id
restaurantRouter.get("/restaurants/:id", async function (req, res, next) {
  // 특정 식당의 가격에 대한 환전 결과를 얻음 (/restaurants/:id?currency=${환전할 통화 코드})
  if (req.query.currency) {
    try {
      // URI로부터 restaurant_id(params)와 currency(query)를 추출함
      const id = req.params.id;
      const currencyCode = req.query.currency;

      // currency exchange된 minPrice와 maxPrice를 얻음
      const prices = await restaurantService.getConvertedPrice({
        id,
        currencyCode,
      });

      if (prices.errorMessage) {
        throw new Error(prices.errorMessage);
      }

      res.status(200).send(prices);
      return;
    } catch (error) {
      next(error);
    }
  }

  // 특정 식당의 정보를 얻음
  try {
    // URI로부터 restaurant_id를 추출함
    const id = req.params.id;
    const restaurant = await restaurantService.getRestaurantInfo({ id });

    if (restaurant.errorMessage) {
      throw new Error(restaurant.errorMessage);
    }

    res.status(200).send(restaurant);
  } catch (error) {
    next(error);
  }
});

export { restaurantRouter };
