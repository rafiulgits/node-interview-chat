[TOC]

# Interview Chat Application

This Project is designed for taking interview online in an interactive way. Interviewer and candidates can talk to each other by messages and interviewer can give some problem and candidates can solve and verify them in one place.



## System

**Server and User Interface**

* Express and Node HTTP
* Socket.IO
* Bootstrap 4
* jQuery 
* axios



**Engine**

* [JavaScript Engine](https://github.com/hacksparrow/safe-eval)
* [Python Engine](https://github.com/extrabacon/python-shell)



**UI Modifier**

* [highlight.js](https://github.com/highlightjs/highlight.js)
* [highlightjs-line-numbers.js](https://github.com/wcoder/highlightjs-line-numbers.js)
* [code-prettify](https://github.com/google/code-prettify)
* [Drawdown](https://github.com/adamvleggett/drawdown)




## Functionality 

### Chat Room

This application is support only one chat room. A group of people can join with their username and role type. User will be uniquely identify by their **username** as well as their role also. A user can't join with the name of existing user.

There are two types of user

* Interviewer 
  * Can see the active user list
  * Can see the messages
  * Can send messages
  * Can see the problem list and solutions
  * Can submit a solution of a particular problem
* Candidate
  * Can see the active user list
  * Can see the messages
  * Can send messages
  * Can see the problem list and solutions
  * Can submit a solution of a particular problem
  * **Can set and update problem**



#### Addition features

* Markdown support (without heading)
* Load previous messages and pinned problem on join
* Join and Leave notification
* Auto copy code line by click on code line number






### Problem And Solution

An interviewer can set a problem task on problem area. Only (s)he can edit the problem statement (question only). This problem is actually a **programming problem** statement. A problem can have **one** or **many** test cases or **not**.

To set a problem an interviewer just fill up the question box. If interviewer don't want to set any test case on a problem (s)he just have to leave the **sample test case** area. If want to set test case (s)he must to give the test cases in a **manner format**. And this manner format is in **JSON** type. Let's assume interviewer set a problem to find out **large value from an array of integer**; the test case format can be

* **single test case**

  ```json
  {
      "input" : [10, 20, 5, - 10, 100, 59],
      "output" : 100
  }
  ```

  

* **multiple test case**

  ```json
  [
      {
          "input" : [1,2,3,4],
          "output" : 4
      },
      {
          "input" : [30, 20, 10],
          "output" : 30
      }
  ]
  ```

**Sample test cases can't  be edited.** Only problem statement or question can be edited by the setter only.



### Solution Submission

A solution can be submitted by both interviewer and candidate. Currently **Python** and **JavaScript** runtime environment is supported.

The solution code should submit in proper to successfully executed. A solution structure is completely dependent on problem statement and sample testcases.

If a problem doesn't have any sample testcases, the solution code execute as a script only. Otherwise a solution code must have a **main** function and input test case will given by as argument (`main(arg)`).



#### Solution structure without sample test cases

Lets assume interviewer set a problem to find out large value of an array of integers without any sample test cases. 

##### JavaScript

 Code can have multiple functions, but every `console.log()` will be ignored. Every single statement that have return value will be printed by the engine. For example solution JavaScript of above problem is

```javascript
const getMax = arr => {
    let l = arr.length;
    arr.sort()
    return arr[l-1]
}
// don't use console.log() just use the statement
getMax([4,1,2,5,0]) // this statemt will be printed automatically by engine

```

Standard JavaScript library can be use in code. Not `node_modules`



##### Python

Python code will executed as python script format. Like to print multiple line just use

```python
print("hello")
print("world")
print(10+20)
```

all the print output will be given as a list of outputs.

```
[hello , world ,30]
```

To solve the above problem by python use

```python
def getMax(arr):
    arr.sort()
    l = len(arr)
    return arr[]

print(getMax([4,1,2,5,0]))
```

Standard python library can be used in code.





#### Solution structure with sample test cases

If a problem has one or multiple test cases, then user code must to submitted in a structured way. 

User code must have a **main** function and **every test case input** will be given to this main function as argument. 

If a problem have single test case then execution engine will call the main function once and return the output. For multiple (assume n) test case engine will call the main function n times and finally return all outputs as an array or list if there is no runtime error.



##### JavaScript

To solve the problem of find out the large item of an array of integer a JS solution is

```javascript
const main = arg => {
  if (typeof arg === "undefined") {
    return -1;
  }

  if (!Array.isArray(arg)) {
    return -1;
  }

  var arr = arg;
  arr = arr.sort();
  let l = arr.length;
  return arr[l - 1];
}
```

A particular test case input will be given the `arg` parameter and user code have to explore it and finally return the result.  User code must have the `main` function with `arg` parameter otherwise engine will be failed to execute the code. The user code can have other function as well. But no variable, constant, function or anything can be named by `arg` because its a **global** variable for JS solution.



##### Python

To solve the problem of find out the large item of an array of integer, A python solution is 

```python
def main(arg):
    if type(arg) != list:
        return -1
    arr = arg
    arr.sort()
    l = len(arr)
    return arr[l-1]
```

Scenario is similar as JavaScript instead of `arg` is not global for python solution. The python solution can have other functions, classes or statements as well with the `main` function.



##### Result

Case actual output, user code output and comparison status will be return by the engine and display to user interface.

```
Actual output : 8
Found result : 9
Status : worng
```



