import axios from "axios";

let api = "http://165.227.103.85:8080/usercrud/";

export default class UserService {

  getUsers() {
    return axios.get(api)
      .then((res) => res.data.data.userCrud);
  }

  createUsers(User){
    return axios.post(api, { User })
      .then(res => res );
  }

  updateUsers(User, id){
    return axios.put(api + id, { User })
      .then(res => res );
  }

  deleteUsers(id){
    return axios.delete(api + id)
      .then(res => res );
  }

}
