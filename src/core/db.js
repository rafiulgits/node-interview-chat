class UserDB {
  /*
    format:
    {
      id : socket id
      name : username
      time : entry time
    }

  */
  constructor() {
    this._array = [];
  }

  get(name) {
    let result = this._array.find(user => {
      return user.name === name;
    });
    if (typeof result === "undefined") {
      return null;
    }
    return result;
  }

  getById(id) {
    let result = this._array.find(user => {
      return user.id === id;
    });
    if (typeof result === "undefined") {
      return null;
    }
    return result;
  }

  getAll() {
    return this._array;
  }

  remove(instance) {
    let index = this._array.indexOf(instance);
    if (index > -1) {
      this._array.splice(index, 1);
    }
  }

  update(instance) {
    let user = this.get(instance.name);
    this.remove(user);
    this.add(instance);
  }

  add(instance) {
    this._array.push(instance);
  }

  clear() {
    this._array = [];
  }
}

class MessageDB {
  /*
    message format

    {
      username : rafi
      body : "This is message body",
      time : date object
    }

  */
  constructor() {
    this._array = [];
  }

  add(instance) {
    this._array.push(instance);
  }

  getAll() {
    return this._array;
  }
}

var Users = new UserDB();
var Messages = new MessageDB();

export { Users, Messages };
