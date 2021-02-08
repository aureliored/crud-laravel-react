import axios from "axios";

export default class UserService {

  getUsers() {
    return axios.get("data/users.json").then((res) => res.data.data);
  }

}
