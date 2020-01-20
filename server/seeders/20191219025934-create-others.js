'use strict';
const faker = require('faker')
const moment = require('moment')
const today = moment().toDate()
const lastMonth = moment().subtract(1, 'months').startOf('months').toDate()

const categorySeeder = ['New', '夏日氣泡世界', '冰低咖啡', '義式咖啡', '單品手沖', '茶飲']
const menuSeeder = {
  'New': [{ name: '燕麥奶拿鐵', price: 150 }, { name: '燕麥奶焦糖瑪奇朵', price: 160 }],
  '夏日氣泡世界':
    [{ name: '紫世界', price: 80 }, { name: '超美麗(草莓+荔枝)', price: 110 }, { name: '莓很芒(草莓+芒果)', price: 110 },
    { name: '鳳凰莓(鳳梨+莓果)', price: 110 }, { name: '蜜香氣泡咖啡', price: 130 }],
  '冰低咖啡': [{ name: '莊園冰低咖啡', price: 150 }],
  '義式咖啡':
    [{ name: '濃縮Espresso', price: 60 }, { name: '黑框美式', price: 80 }, { name: '小農輕拿鐵', price: 110 },
    { name: '小農重拿鐵', price: 120 }, { name: '卡布奇諾', price: 110 }, { name: '愛爾蘭拿鐵', price: 120 },
    { name: '焦糖瑪奇朵', price: 120 }, { name: '抹茶拿鐵', price: 130 }, { name: '抹茶歐蕾', price: 120 },
    { name: '巧克力歐蕾', price: 120 }, { name: '法式鮮奶茶', price: 130 }],
  '單品手沖':
    [{ name: '世界冠軍特選', price: 180 }, { name: '耶加阿赫雷', price: 150 }, { name: '耶加荷芙莎', price: 150 },
    { name: '巧克力情人', price: 150 }, { name: '皇后莊園', price: 130 }, { name: '百合花', price: 130 },
    { name: '牧童', price: 130 }, { name: '綠寶曼特寧', price: 130 }, { name: '超級黃金曼特寧', price: 160 },
    { name: '花神', price: 130 }],
  '茶飲':
    [{ name: '玫瑰水果茶', price: 150 }, { name: '蘋果水果茶', price: 150 }, { name: '黑森林水果茶', price: 150 },
    { name: '水蜜桃水果茶', price: 150 }, { name: '草莓水果茶', price: 150 }, { name: '白桃烏龍', price: 150 },
    { name: '荔枝烏龍', price: 150 }, { name: '草木紅葉', price: 150 }, { name: '有機薄荷', price: 150 }]
}
const tagSeeder = ["淺焙", "中焙", "深焙", "衣索比亞", "肯亞", "印尼", "微果酸", "果香味", "推荐", "新品"]




function createCategory(categories) {
  categories = categories.map((item, index) => ({
    id: index + 1,
    name: item
  })
  )
  return categories
}

function createDish(categories, dishes) {
  let menu = []
  let j = 1
  for (let i = 0; i < categories.length; i++) {
    dishes[categories[i].name].forEach(dish => {
      let obj = {
        id: j,
        name: dish.name,
        price: dish.price,
        image: faker.image.imageUrl(),
        description: faker.lorem.text(),
        CategoryId: i + 1
      }
      menu.push(obj)
      j++
    })
  }

  return menu
}

function createDishCombo(menu) {
  let combo = []
  for (let i = 0; i < 100; i++) {
    let dish = menu[Math.floor(Math.random() * menu.length)]
    let obj = {
      id: i + 1,
      // DishId: i + 1,
      DishId: dish.id,
      OrderId: i + 1,
      perQuantity: 1,
      perAmount: dish.price,
      createdAt: faker.date.between(lastMonth, today),
      updatedAt: new Date()
    }
    combo.push(obj)
  }
  return combo
}

function createOrder(combo) {
  let orders = []
  for (let i = 0; i < 100; i++) {
    let obj = {
      id: i + 1,
      amount: combo[i].perAmount,
      quantity: combo[i].perQuantity,
      memo: faker.lorem.words(),
      isTakingAway: true,
      state: 'paid',
      UserId: Math.floor(Math.random() * 30) + 2,
      createdAt: combo[i].createdAt,
      updatedAt: new Date()
    }
    orders.push(obj)
  }
  //console.log(orders)
  return orders
}

function createTag(arr) {
  let tags = []
  for (let i = 0; i < arr.length; i++) {
    let obj = { id: i + 1, name: arr[i] }
    tags.push(obj)
  }
  return tags
}

function createDishAttach(dishes) {
  let dishAttaches = []
  let index = 1
  for (let i = 0; i < dishes.length; i++) {
    for (let j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
      let obj = { id: index, DishId: dishes[i].id, TagId: Math.floor(Math.random() * 10) + 1 }
      dishAttaches.push(obj)
      index++
    }
  }
  //console.log(dishAttaches)
  return dishAttaches
}

function createUserPreferred() {
  let userPreferred = []
  for (let i = 0; i < 32; i++) {
    let obj = {
      id: i + 1,
      UserId: Math.floor(Math.random() * 30) + 2,
      TagId: Math.floor(Math.random() * 10) + 1,
      createdAt: faker.date.between(lastMonth, today),
      updatedAt: new Date()
    }
    userPreferred.push(obj)
  }
  //console.log(userPreferred)
  return userPreferred
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = createCategory(categorySeeder)
    const dishes = createDish(categories, menuSeeder)
    const combos = createDishCombo(dishes)
    const orders = createOrder(combos)
    const tags = createTag(tagSeeder)
    const dishAttaches = createDishAttach(dishes)
    const userPreferreds = createUserPreferred()

    await queryInterface.bulkInsert('Categories', categories, {})
    await queryInterface.bulkInsert('Dishes', dishes, {})
    await queryInterface.bulkInsert('DishCombinations', combos, {})
    await queryInterface.bulkInsert('Orders', orders, {})
    await queryInterface.bulkInsert('Tags', tags, {})
    await queryInterface.bulkInsert('DishAttachments', dishAttaches, {})
    await queryInterface.bulkInsert('UserPreferreds', userPreferreds, {})
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Categories', null, { truncate: true })
    queryInterface.bulkDelete('Dishes', null, { truncate: true })
    queryInterface.bulkDelete('DishCombinations', null, { truncate: true })
    queryInterface.bulkDelete('Orders', null, { truncate: true })
    queryInterface.bulkDelete('Tags', null, { truncate: true })
    queryInterface.bulkDelete('DishAttachments', null, { truncate: true })
    return queryInterface.bulkDelete('UserPreferreds', null, { truncate: true })
  }
};
