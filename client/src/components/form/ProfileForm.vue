<template>
  <div class="box-center" style="background-color: #F0E8DD;height: 100%;">
    <div class="container border border-secondary" style="max-width: 500px;border-radius: 5%;">
      <h1 class="py-3 text-center">會員資料</h1>
      <form class="row">
        <div class="form-group col-12 text-center">
          <button
            class="btn btn-primary px-4 py-2"
            style="position: absolute;right: 0;"
            :disabled="initialIsProcessing"
            @click.stop.prevent="edit()"
          >{{ initialEditing ? "取消" : "編輯" }}</button>
          <img :src="profile.avatar | emptyImage" class="user-avatar" width="150" height="150" />

          <input
            id="image"
            type="file"
            name="image"
            accept="image/*"
            @change="handleFileChange"
            class="align-bottom"
            v-show="initialEditing"
            :disabled="initialIsProcessing || !initialEditing"
          />
        </div>

        <div
          v-if="this.$store.state.currentUser.role === `member`"
          class="form-label-group mb-3 col-12"
        >
          <div v-show="initialEditing">
            <label>標籤</label>
            <div class="form-inline mb-2">
              <input
                class="form-control mr-sm-2"
                type="text"
                name="searchTag"
                v-model="tagName"
                :disabled="initialIsProcessing"
                placeholder="Search Tag name"
              />
              <button
                type="button"
                class="btn btn-primary"
                :disabled="initialIsProcessing"
                @click.stop.prevent="searchTag"
              >搜尋</button>
            </div>
            <button
              v-for="dtag in tagsDisplay"
              :key="dtag.id"
              class="btn btn-primary mr-2 mt-2"
              :disabled="initialIsProcessing"
              @click.stop.prevent="addTag(dtag)"
            >{{ dtag.name }}</button>
          </div>

          <label class="d-block">偏好標籤</label>
          <div class="d-inline-block" v-for="tag in profile.preferredTags" :key="tag.id">
            <button
              v-show="initialEditing"
              class="btn btn-primary mr-2 mb-2"
              :disabled="initialIsProcessing"
              @click.stop.prevent="removeTag(tag)"
            >#{{ tag.name }}</button>
            <div v-show="!initialEditing" class="badge badge-danger">{{tag.name}}</div>
          </div>
        </div>

        <div
          class="form-label-group mb-3 col-sm-6 col-12"
          :class="{'form-group--error': $v.profile.name.$error}"
        >
          <label for="name">Name</label>
          <input
            @input="$v.profile.name.$touch"
            :disabled="initialIsProcessing || !initialEditing"
            maxlength="20"
            minlength="1"
            id="name"
            v-model="profile.name"
            name="name"
            type="text"
            class="form-control"
            placeholder="name"
            required
            autofocus
          />
          <small v-if="$v.profile.name.$error" class="text-danger">長度介於 1 - 20</small>
        </div>

        <div
          class="form-label-group mb-3 col-sm-6 col-12"
          :class="{'form-group--error': $v.profile.phone.$error}"
        >
          <label for="name">Phone</label>
          <input
            @input="$v.profile.phone.$touch"
            :disabled="initialIsProcessing || !initialEditing"
            maxlength="15"
            minlength="8"
            id="phone"
            v-model="profile.phone"
            name="phone"
            type="number"
            class="form-control"
            placeholder="phone"
            required
            autofocus
          />
          <small v-if="$v.profile.phone.$error" class="text-danger">長度需為 10</small>
        </div>

        <div
          class="form-label-group mb-3 col-sm-6 col-12"
          :class="{'form-group--error': $v.profile.email.$error && !$v.profile.email.$pending}"
        >
          <label for="email">Email</label>
          <input
            @input="$v.profile.email.$touch"
            :disabled="initialIsProcessing || !initialEditing"
            id="email"
            v-model="profile.email"
            name="email"
            type="email"
            class="form-control"
            placeholder="email"
            required
            autofocus
          />
          <small
            v-if="!$v.profile.email && $v.profile.email.$dirty"
            class="text-danger"
          >請輸入格式正確的電子信箱</small>
          <small
            v-if="!$v.profile.email.required && $v.profile.email.$dirty"
            class="text-danger"
          >電子信箱必填</small>
        </div>

        <div
          class="form-label-group mb-3 col-sm-6 col-12"
          :class="{'form-group--error': $v.profile.account.$error}"
        >
          <label for="name">Account</label>
          <input
            @input="$v.profile.account.$touch"
            :disabled="initialIsProcessing || !initialEditing"
            maxlength="30"
            minlength="6"
            id="account"
            v-model="profile.account"
            name="account"
            type="text"
            class="form-control"
            placeholder="account"
            required
          />
          <small v-show="$v.profile.account.$error" class="text-danger">長度介於 5 - 30</small>
        </div>
        <div class="col-12 pb-4">
          <button
            class="btn btn-primary w-50 p-2"
            :disabled="initialIsProcessing"
            @click.stop.prevent="$router.back()"
          >回上一頁</button>

          <button
            class="btn btn-primary w-50 p-2"
            :disabled="initialIsProcessing || $v.$invalid || !initialEditing"
            type="submit"
            @click.stop.prevent="handleSubmit"
          >{{ initialIsProcessing ? "處理中..." : "送出" }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import memberTagAPI from "../../apis/member/tag";
import { emptyImageFilter } from "../../utils/mixins";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";

export default {
  name: "ProfileForm",
  mixins: [emptyImageFilter],
  props: {
    initialProfile: {
      type: Object,
      default: () => ({
        account: "",
        phone: "",
        name: "",
        email: "",
        avatar: "",
        preferredTags: [{ id: 1, name: "" }]
      })
    },
    initialTags: {
      type: Array,
      default: () => []
    },
    initialIsProcessing: {
      type: Boolean,
      default: false
    },
    initialEditing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      profile: this.initialProfile,
      tags: this.initialTags,
      tagName: "",
      tag: "",
      searchResult: []
    };
  },
  validations: {
    profile: {
      account: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(30)
      },
      phone: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(10)
      },
      name: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(20)
      },
      email: {
        required,
        email
      }
    }
  },
  watch: {
    initialProfile(profile) {
      this.profile = {
        ...this.profile,
        ...profile
      };
    },
    initialTags(tags) {
      this.tags = {
        ...this.tags,
        ...tags
      };
    }
  },
  computed: {
    tagsDisplay: function() {
      let tagBox = [...this.searchResult, ...this.initialTags];
      const filtered = tagBox.filter(function({ id, name }) {
        const key = `${id}${name}`;
        return !this.has(key) && this.add(key);
      }, new Set());
      let e = filtered.slice(0, 6);
      return e;
    }
  },
  created() {},
  methods: {
    edit() {
      this.$emit("after-edit");
    },
    async searchTag() {
      try {
        const response = await memberTagAPI.search({ name: this.tagName });
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        if (data.length === 0) {
          this.$swal({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 3000,
            icon: "warning",
            title: "未找到相關標籤",
            text: ""
          });
        }

        this.searchResult = [];

        data.map(tag => {
          this.searchResult.push({ id: tag.id, name: tag.name });
        });
      } catch (error) {
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    handleFileChange(e) {
      const files = e.target.files;
      if (!files.length) return; // 如果沒有檔案則離開此函式
      // 否則產生預覽圖...
      const imageURL = window.URL.createObjectURL(files[0]);
      this.profile.avatar = imageURL;
    },
    handleSubmit() {
      this.$emit("after-submit");
    },
    addTag(tag) {
      var result = this.profile.preferredTags
        .map(item => {
          return item.name;
        })
        .indexOf(tag.name);

      if (result === -1) {
        this.profile.preferredTags.unshift(tag);
      }
    },
    removeTag(tag) {
      this.profile.preferredTags = this.profile.preferredTags.filter(
        e => e !== tag
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.user-avatar {
  border-radius: 30%;
}
.box-center {
  @include response(md) {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>