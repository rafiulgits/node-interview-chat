class UserDB {
  /*
    format:
    {
      id : socket id
      name : username
      type : interviewer/candidate/creator
      time : entry time
    }

  */
  constructor() {
    this._array = [];
  }

  get(name) {
    let result = this._array.find((user) => {
      return user.name === name;
    });
    if (typeof result === "undefined") {
      return null;
    }
    return result;
  }

  getById(id) {
    let result = this._array.find((user) => {
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

  legth() {
    return this._array.length;
  }

  isOnlyServerExists() {
    return this._array.length <= 1;
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

  clear() {
    this._array = [];
  }
}

class ProblemDB {
  /*
    problem = {
        id: "random string",
        question: "find second max of an array",
        author: "username",
        time: new Date().toLocaleString(),
        sampleTestCases = object or array of object
        solutions: [
          {
            problemId : "from problem"
            author: "username",
            time: new Date().toLocaleString(),
            code: "code string",
            language: "js"
          }
        ]
      }
  */
  constructor() {
    this._array = [];
  }

  add(instance) {
    this._array.push(instance);
  }

  get(id) {
    let result = this._array.find((problem) => {
      return problem.id === id;
    });
    if (typeof result === "undefined") {
      return null;
    }
    return result;
  }

  update(instance) {
    let index = this._array.findIndex((problem) => {
      return problem.id === instance.id;
    });
    if (index === -1) {
      return false;
    }
    this._array[index] = instance;
    return true;
  }

  addSolutionOn(id, solutionInstance) {
    let index = this._array.findIndex((problem) => {
      return problem.id === id;
    });
    if (index === -1) {
      return false;
    }
    this._array[index].solutions.push(solutionInstance);
    return true;
  }

  getAll() {
    return this._array;
  }

  clear() {
    this._array = [];
  }
}

var Users = new UserDB();
var Messages = new MessageDB();
var Problems = new ProblemDB();

export { Users, Messages, Problems };
