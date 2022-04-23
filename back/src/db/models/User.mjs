import { UserModel } from "../schemas/user.mjs";

class User {
  static async create({ newUser }) {
    const createdNewUser = await UserModel.create(newUser);
    return createdNewUser;
  }

  static async findByEmail({ email }) {
    const user = await UserModel.findOne({ email });
    return user;
  }

  static async findById({ user_id }) {
    const user = await UserModel.findOne({ id: user_id });
    return user;
  }

  static async findAll() {
    const users = await UserModel.find({});
    return users;
  }

  static async update({ user_id, fieldToUpdate, newValue }) {
    const filter = { id: user_id };
    const update = { [fieldToUpdate]: newValue };
    const option = { returnOriginal: false };

    const updatedUser = await UserModel.findOneAndUpdate(
      filter,
      update,
      option,
    );
    return updatedUser;
  }

  static async delete({ user_id }) {
    const ret = await UserModel.findOneAndDelete({ id: user_id });
    return ret;
  }

  static async updateBookmark({ user_id, restaurantId }) {
    const filter = { id: user_id };
    const update = { $push: { bookmarks: restaurantId } };
    const option = { returnOriginal: false };

    const bookmarkInfo = UserModel.findOne({
      id: user_id,
      bookmarks: { $in: { restaurantId } },
    });
    if (bookmarkInfo) {
      const errorMessage =
        "해당 id를 가진 사용자는 해당 음식점에 대한 북마크 내역이 이미 있습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    const bookmarks = await UserModel.findOneAndUpdate(filter, update, option);
    return bookmarks;
  }

  static async findBookmarks({ user_id }) {
    const bookmarks = await UserModel.findOne({ id: user_id }).populate(
      "bookmarks",
    );

    return bookmarks;
  }

  static async deleteBookmark({ user_id, restaurantId }) {
    const filter = { id: user_id };
    const update = { $pull: { bookmarks: restaurantId } };
    const option = { returnOriginal: false };

    const bookmarkInfo = UserModel.findOne({
      id: user_id,
      bookmarks: { $in: { restaurantId } },
    });
    if (!bookmarkInfo) {
      const errorMessage =
        "해당 id를 가진 사용자는 해당 음식점에 대한 북마크 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    const bookmarks = await UserModel.findOneAndUpdate(filter, update, option);
    return bookmarks;
  }
}

export { User };
