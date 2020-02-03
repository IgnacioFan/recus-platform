<template>
  <div class="h-100">
    <Spinner v-if="loadingProfile && loadingTags" />
    <template v-else>
      <ProfileForm
        :initial-profile="profile"
        :initial-tags="allTags"
        :initial-editing="editing"
        :initial-isProcessing="isProcessing"
        @after-edit="edit"
        @after-submit="handleSubmit"
      />
    </template>
    <MemberNavbarBottom />
  </div>
</template>

<script>
import Spinner from "@/components/Spinner/Spinner";
import MemberNavbarBottom from "@/components/Navbar/MemberNavbarBottom";
import ProfileForm from "@/components/Form/ProfileForm";
import memberProfileAPI from "@/apis/member/profile";
import memberTagAPI from "@/apis/member/tag";

export default {
  name: "MemberProfile",
  components: {
    Spinner,
    ProfileForm,
    MemberNavbarBottom
  },
  data() {
    return {
      profile: {
        account: "",
        phone: "",
        name: "",
        email: "",
        avatar: "",
        preferredTags: []
      },
      allTags: [],
      saveAccount: "",
      savePhone: "",
      saveName: "",
      saveEmail: "",
      saveAvatar: "",
      savePreferredTags: [],
      loadingProfile: true,
      loadingTags: true,
      isProcessing: false,
      editing: false
    };
  },
  created() {
    this.loadProfile();
    this.fetchTags();
  },
  methods: {
    async fetchTags() {
      try {
        const response = await memberTagAPI.get();
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.allTags = data;
        this.loadingTags = false;
      } catch (error) {
        this.loadingTags = false;
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    async loadProfile() {
      try {
        const response = await memberProfileAPI.get();
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        if (data.status === "error") {
          this.$swal({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 3000,
            icon: "warning",
            title: "未找到會員",
            text: ""
          });
          this.loadingProfile = false;
        } else {
          this.profile.account = data.user.account;
          this.profile.phone = data.user.phone;
          this.profile.name = data.user.Profile.name;
          this.profile.email = data.user.Profile.email;
          this.profile.avatar = data.user.Profile.avatar;
          this.profile.preferredTags = data.user.preferredTags;

          this.saveAccount = data.user.account;
          this.savePhone = data.user.phone;
          this.saveName = data.user.Profile.name;
          this.saveEmail = data.user.Profile.email;
          this.saveAvatar = data.user.Profile.avatar;
          this.savePreferredTags = [...data.user.preferredTags];
          this.loadingProfile = false;
        }
      } catch (error) {
        this.loadingProfile = false;
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    async handleSubmit() {
      try {
        this.isProcessing = true;
        const response = await memberProfileAPI.put({
          account: this.profile.account,
          name: this.profile.name,
          phone: this.profile.phone,
          avatar: this.profile.avatar,
          tags: this.profile.preferredTags,
          email: this.profile.email
        });
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          icon: "success",
          title: data.msg
        });
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        this.$swal({
          icon: "warning",
          title: "註冊失敗，請稍後再試"
        });
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    edit() {
      if (this.editing) {
        this.profile.account = this.saveAccount;
        this.profile.phone = this.savePhone;
        this.profile.name = this.saveName;
        this.profile.email = this.saveEmail;
        this.profile.avatar = this.saveAvatar;
        this.profile.preferredTags = this.savePreferredTags;
        this.editing = false;
      } else {
        this.editing = true;
      }
    }
  }
};
</script>