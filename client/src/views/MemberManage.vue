<template>
  <div class="container py-5">
    <form class="my-4">
      <div class="form-row">
        <div class="col-auto">
          <input type="text" class="form-control" placeholder="輸入手機電話..." />
        </div>
        <div class="col-auto">
          <button type="button" class="btn btn-primary">搜尋</button>
        </div>
      </div>
    </form>
    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th scope="col">Name</th>
          <th scope="col">手機</th>
          <th scope="col">消費次數</th>
          <th scope="col" width="110">刪除</th>
          <th scope="col" width="110">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="profile in profiles" :key="profile.id">
          <th scope="row">{{ profile.account }}</th>
          <td class="position-relative">
            <div class="profile-name">{{ profile.phone }}</div>
          </td>
          <td class="position-relative">
            <div class="profile-name">{{ profile.consumeCount }}</div>
          </td>
          <td class="position-relative">
            <button type="button" class="btn btn-link mr-2">Delete</button>
          </td>
          <td class="d-flex justify-content-between">
            <button type="button" class="btn btn-link mr-2">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
const dummyData = {
  profiles: [
    {
      id: 1,
      account: "root",
      phone: "0900",
      password: "12345678",
      name: "root",
      email: "root@example.com",
      image: "",
      isAdmin: true,
      isValid: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      Orders: [{ id: 1 }, { id: 2 }, { id: 3 }]
    },
    {
      id: 2,
      account: "user1",
      phone: "0901",
      password: "12345678",
      name: "Nacho",
      email: "user1@example.com",
      image: "",
      isAdmin: false,
      isValid: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      Orders: [{ id: 1 }, { id: 2 }, { id: 3 }]
    },
    {
      id: 3,
      account: "user2",
      phone: "0902",
      password: "12345678",
      name: "yoshi",
      email: "user2@example.com",
      image: "",
      isAdmin: false,
      isValid: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      Orders: [{ id: 1 }, { id: 2 }, { id: 3 }]
    }
  ]
};

export default {
  components: {},
  data() {
    return {
      profiles: []
    };
  },
  created() {
    this.fetchProfiles();
  },
  methods: {
    fetchProfiles() {
      this.profiles = dummyData.profiles.map(profile => ({
        ...profile,
        consumeCount: profile.Orders.length
      }));
    }
  }
};
</script>