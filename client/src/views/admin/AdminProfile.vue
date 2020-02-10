<template>
  <ProfileForm
    :initial-profile="profile"
    :initial-editing="editing"
    :initial-isLoading="isLoading"
    :initial-isProcessing="isProcessing"
    @after-edit="edit"
    @after-submit="handleSubmit"
  />
</template>

<script>
import ProfileForm from "@/components/Form/ProfileForm";
import adminProfileAPI from "@/apis/admin/profile";

export default {
  name: "AdminProfile",
  components: {
    ProfileForm
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
      saveAccount: "",
      savePhone: "",
      saveName: "",
      saveEmail: "",
      saveAvatar: "",
      savePreferredTags: [],
      isLoading: true,
      isProcessing: false,
      editing: false
    };
  },
  created() {
    this.LoadProfile();
  },
  methods: {
    async LoadProfile() {
      try {
        const response = await adminProfileAPI.get();
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
          this.isLoading = false;
        } else {
          this.profile.account = data.user.account;
          this.profile.phone = data.user.phone;
          this.profile.name = data.user.Profile.name;
          this.profile.email = data.user.Profile.email;
          this.profile.avatar = data.user.Profile.avatar;

          this.saveAccount = data.user.account;
          this.savePhone = data.user.phone;
          this.saveName = data.user.Profile.name;
          this.saveEmail = data.user.Profile.email;
          this.saveAvatar = data.user.Profile.avatar;
          this.isLoading = false;
        }
      } catch (error) {
        this.isLoading = false;
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    async handleSubmit() {
      try {
        this.isProcessing = true;
        const response = await adminProfileAPI.put({
          account: this.profile.account,
          name: this.profile.name,
          phone: this.profile.phone,
          avatar: this.profile.avatar,
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
        this.editing = false;
      } else {
        this.editing = true;
      }
    }
  }
};
</script>

<style scoped>
.user-avatar {
  border-radius: 30%;
}
.box-center {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>