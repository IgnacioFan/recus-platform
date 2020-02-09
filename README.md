# Recusplatform 濾客平台

An Online service for small shop owners to manage their daily operation and customer's relationship.

[sigin-in and you will see](https://recus.herokuapp.com/signin)

## indexes
* [About the project](#About-the-project)
* [Performance](#Performance)
* [Core user stories](#Core-user-stories)
* [API doc](#API-doc)
* [Middlewares/ third party APIs](#Middlewares-third-party-APIs)
* [Run locally](#Run-locally)
* [Upcomming feature](#Upcomming-feature)
* [Collaborators](#Collaborators)

## About the project
We provide a service for small business like coffee shop to collect row data from daily operation, and convert data to many visible charts, tables, evaluable datas. We focused on building valuable interaction and explored the innovated service experience.

## Performance
### The admin interface
![](https://i.imgur.com/mYxTgQz.gif)


### The member interface
![](https://i.imgur.com/ZyCYL8q.gif)


## Core user stories
As a admin, you can:
- sign in 
- make an order for customer
  - pick up a dish, choose number
  - click a dish and see its detail
  - fill in the other options(memo, takeaway etc.) in the right list
  - add a member info for the order by searching phone number
  - quickly sign up a new member 
  - submit the order
- look through all today's orders
  - switch to different states(pending, making, unpaid, paid)
  - change the state of order 
  - delete a specific order
- look through all member and their basic info
  - search a specific member
  - change member's validation
  - change member's role 
  - soft delete a specific member
- look through dishes
  - edit dish info
  - delete dish
- look through categories
  - add a new category
  - edit category info
  - delete category
- look through tags
  - add a new tag
  - edit tag info
  - delete tag
- add a new dish
  - add mulitple tags
  - select one category
  - upload pictures and description
- look through dashboard
  - select a time range(weekly/monthly) and fetch different result in pie chart
  - select a time range(weekly/monthly) and fetch different result in line chart
- look through your profile
  - update your profile info
- change your password
- sign out

As a member, you can:
- sign in 
- look through menu
- make an order
  - pick up a dish and choose number
  - go to order page, then filled up the options
  - submit the order, then go to state page
- look through your today's order
- look through your profile
- look through your order history
- change your password
- sign out

Our model relation(ERD)
![](https://i.imgur.com/VDRPwCo.jpg)


## API doc

### User API
| Verb  | URL | ACTION |
| ----- | ----| -------- |
| POST  | /api/signin  | should validate, then user can sigin in   |
| POST  | /api/signup  | should validate, then user can sigin up   |
| GET   | /api/user  | fetch a current user  |
| POST  | /api/password/change  | should validate, then user can change password |

### Admin API
**Profile**
| Verb  | URL | ACTION |
| ----- | ----| -------- |
| GET   | /api/profile  | fetch current user's profile   |
| PUT   | /api/profile  | should validate, then update user's profile   |

**Member**
| Verb  | URL | ACTION |
| ----- | ----| -------- |
| GET   | /api/members/         | fetch all members
| GET   | /api/members/:id/orders  | fetch a specific member's orders
| GET   | /api/members/:id/tags    | fetch a specific member's tags
| GET   | /api/members/search?phone=XX| search a specific member with phone numbers
| GET   | /api/members/:id         | fetch a spcific member with orders
| POST  | /api/members/            | add a new member and profile
| PUT   | /api/members/:id/isvalid | change the member's validation
| PUT   | /api/members/:id/isAdmin | change the member's role(admin/member)
| DELETE| /api/members/:id  | soft delete member, exclude admin   |

**Dish**
| Verb  | URL | ACTION |
| ----- | ----| -------- |
| GET   | /api/dishes     | fetch all dishes |
| GET   | /api/dishes/:id | fetch a specific dish |
| POST  | /api/dishes     | should validate, add a new dish   |
| PUT   | /api/dishes/:id | should validate, update a specific dish and its connected tags  |
| DELETE| /api/dishes/:id | stronge delete a specific dish and its connected tags |

**Category**
| Verb  | URL | ACTION |
| ----- | ----| -------- |
| GET   | /api/categories      | fetch all categories  |
| GET   | /api/categories/:id  | fetch a specific category  |
| POST  | /api/categories      | should validate, add a specific category    |
| PUT   | /api/categories/:id  | should validate, update a specific category |
| DELETE| /api/categories/:id  | delete a specific category |

**Tag**
| Verb  | URL | ACTION |
| ----- | ----| --------  |
| GET   | /api/tags       | fetch all tags  |
| GET   | /api/tag?tag=XX | search a specific tag with tag name  |
| GET   | /api/tags/:id   | fetch a specific tag  |
| POST  | /api/tags       | should validate, add a specific tag   |
| PUT   | /api/tags/:id   | should validate, update a specific tag |
| DELETE| /api/tags/:id   | delete a specific tag |

**Order**
| Verb  | URL | ACTION |
| ----- | ----| -------- |
| GET   | /api/orders      | fetch all orders       |
| GET   | /api/orders/:id  | fetch a specific order |
| GET   | /api/orders/pendingNums    | count orders by pending   |
| GET   | /api/orders/unpaidNums     | count orders by unpaid   |
| POST  | /api/orders  | add a new order and dish combos   |
| PUT   | /api/orders/:id/prevState  | move back state of order    |
| PUT   | /api/orders/:id/nextState  | move forward state of order   |
| DELETE| /api/order/:id  | strong delete(pending, making, unpaid)/soft delete order(paid)|

**Dashboard**
| Verb  | URL | ACTION |
| ----- | ----| --------  |
| GET   | /api/dashboard  | fetch basic infor  |
| GET   | /api/dashboard/pieChart?range=weekly | fetch top 5 products/ top 5 tags/ top 5 visiting members |
| GET   | /api/dashboard/lineChart?type=product&range=weekly&id=X | fetch the growing of product/tag/member by ids  |

### Member API
**Profile**
| Verb  | URL | ACTION |
| ----- | ----| --------  |
| GET   | /api/profile | fetch user profile |
| PUT   | /api/prolile | should validate, then update user's profile  |

**tag**
| Verb  | URL | ACTION |
| ----- | ----| --------  |
| GET   | /api/tag?tag=XX | search a specific tag with tag name |
| GET   | /api/tags  | fetch all tags   |

**Order**
| Verb  | URL | ACTION |
| ----- | ----| --------  |
| GET   | /api/orders/today | fetch all today's orders  |
| GET   | /api/orders  | fetch all user's orders, exclude today |
| POST  | /api/orders  | add a new order   |

**Menu**
| Verb  | URL | ACTION |
| ----- | ----| --------  |
| GET   | /api/member/menu' | fetch categories and dishes |

## Middlewares/ third party APIs 
**Front End**

- used [vue-chartjs](https://github.com/apertureless/vue-chartjs) to visualize order and customer's relative data 
- used [Vuelidate](https://github.com/vuelidate/vuelidate) to validate form input formate such as signup, signin etc.
- used [vue-sweetalert2](https://github.com/avil13/vue-sweetalert2) to customize popup component
- used [Vuex](https://github.com/vuejs/vuex) to control state of Vue.js
- used [Sass](https://github.com/sass/node-sass) to make CSS code much reusable.
- used [moment.js](https://github.com/moment/moment/) to transform datetime format to match the user's need


**Back End**


- used [express-validator](https://github.com/express-validator/express-validator) to validate request data from fontend, before store them in database
- used [JSON Web Tokens](https://github.com/auth0/node-jsonwebtoken) to add token based authentication to RESTful API
- used [Multer](https://github.com/expressjs/multer) 、[imgur-node-api](https://github.com/jamiees2/imgur-node-api) to upload image/avatar
- used [socket.io](https://github.com/socketio/socket.io) to compute realtime order data 
- used [moment.js](https://github.com/moment/moment/) to parse datetime attribute of data from database or fetch data in a range of time or tranform to a specific format
- used [mocha](https://github.com/mochajs/mocha) / [chai](https://github.com/chaijs/chai) / [sinon](https://github.com/sinonjs/sinon) / [supertest](https://github.com/visionmedia/supertest) to do automated Testing
- used [TravisCI](https://travis-ci.org/) for seting the flow of continuous integration

## Run locally
The following instructions will get you a copy of the project and the setting needed to run the back-end server on your local machine.

### Prerequirements
- npm // v6.12.1
- Node.js 
- MySQL 
- MySQL Workbench (option)

### Set up Backend
**1. clone to locally machine**
```
$ git clone https://github.com/IgnacioFan/recus-platform.git
```

**2. Enter the project folder**
```
$ cd recus-platform
```

**3. Install packages via npm**
```
$ npm install
```

**4. Create .env file**
```
$ touch .env
```

**5. Store API Key in .env file and save**
```
JWT_SECRET=<YOUR JWT SECRET
```

**6. Edit password in config.json**
```
  "development": {
    "username": <your user name>,
    "password": <your password>,
    "database": <your dev database name>,
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
   "test": {
    "username": <your user name>,
    "password": <your password>,
    "database": <your test database name>,
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  }
```

**7. run migrations, then seeders**
```
$ cd recus-platform/server
$ npx sequelize db:migrate
$ npx sequelize db:migrate --env=test
$ npx sequelize db:seeder:all
```

**8. fire your web app locally**
```
$ npm run dev
// you will see "Server is listing to port 3000" print out on console later
```

open browser and type http://localhost:3000/api/test.

if you see a string {status: 'success', msg: 'successfully connected'}, then it means you have fired the backend service.

### Set up frontend
The following instructions will go through the setting needed to run the front-end app on your local machine.

**1. Enter the project folder**

> Open a new terminal and enter the folder
```
$ cd recus-platform/client
```

**2. Install packages via npm**

```
$ npm install
```

**3. Compiles and hot-reloads for development**
```
$ npm run serve
```

## Upcomming feature
comming soon...

## Collaborators
- Nacho
[經營你的顧客關係 — 打造CRM系統](https://medium.com/@fan01856472/經營你的顧客關係-打造crm系統-f1d15474af84)
- Kerwin
[CRM-系統濾客平台](https://medium.com/@sh940718/濾客平台-crm系統濾客平台-9e0af7178eb)