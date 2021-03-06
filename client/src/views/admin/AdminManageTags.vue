<template>
  <div>
    <NavbarTop :initial-title="title" />

    <div class="row">
      <ManageTabs />

      <div class="col-4">
        <form class="my-2">
          <div class="form-row">
            <div class="col-auto">
              <input type="text" v-model="newTagName" class="form-control" placeholder="新增標籤" />
            </div>
            <div class="col-auto">
              <button
                type="button"
                class="btn btn-primary"
                @click.stop.prevent="createTag"
                :disabled="isProcessing"
              >新增</button>
            </div>
          </div>
        </form>
      </div>

      <div class="col-4"></div>

      <Spinner class="col-12" v-if="isLoading" />
      <template v-else>
        <CategoryTable
          :initial-category="leftTableCategory"
          @after-editing-category="toggleIsEditing"
          @after-cancel-edit-category="handleCancel"
          @after-update-category="updateTag"
          @after-delete-category="deleteTag"
        />

        <CategoryTable
          :initial-category="rightTableCategory"
          @after-editing-category="toggleIsEditing"
          @after-cancel-edit-category="handleCancel"
          @after-update-category="updateTag"
          @after-delete-category="deleteTag"
        />
      </template>
    </div>

    <NavbarBottm />
  </div>
</template>

<script>
import NavbarTop from "../../components/navbar/NavbarTop";
import NavbarBottm from "../../components/navbar/NavbarBottm";
import ManageTabs from "../../components/tabs/ManageTabs";
import CategoryTable from "../../components/table/CategoryTable";
import adminTagAPI from "../../apis/admin/tag";
import Spinner from "../../components/spinner/Spinner";
import io from "socket.io-client";

export default {
  name: "AdminManageTags",
  components: {
    NavbarTop,
    NavbarBottm,
    ManageTabs,
    Spinner,
    CategoryTable
  },
  data() {
    return {
      title: "菜單管理",
      newTagName: "",
      tags: [],
      isLoading: true,
      isProcessing: false,
      socket: io("http://localhost:3000")
    };
  },
  computed: {
    leftTableCategory: function() {
      let tagsLength = this.tags.length - 1;
      let box = [];
      for (let i = 0; i <= tagsLength; i++) {
        if (i === 0 || i % 2 === 0) {
          box.push(this.tags[i]);
        }
      }
      return box;
    },
    rightTableCategory: function() {
      let tagsLength = this.tags.length - 1;
      let box = [];
      for (let i = 0; i <= tagsLength; i++) {
        if (i % 2 !== 0) {
          box.push(this.tags[i]);
        }
      }
      return box;
    }
  },
  created() {
    // add socket
    this.socket.emit("init");
    this.fetchTags();
  },
  methods: {
    async fetchTags() {
      try {
        const response = await adminTagAPI.tag.get();
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.tags = data.tags.map(tag => ({
          ...tag,
          used: tag.hasDishes.length || 0,
          isEditing: false
        }));
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    async createTag() {
      try {
        this.processing = true;
        if (this.newTagName.trim() === "") {
          this.$swal({
            type: "warning",
            title: "名稱不可空白"
          });
          return;
        }
        const { data, statusText } = await adminTagAPI.tag.post({
          name: this.newTagName
        });

        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.tags.push({
          ...data.tag,
          isEditing: false
        });

        this.newTagName = "";
        this.isProcessing = false;
        this.fetchTags();

        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          type: "success",
          title: "成功新增標籤",
          text: ""
        });
      } catch (error) {
        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          type: "warning",
          title: "無法新增標籤，請稍後再試",
          text: ""
        });
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    toggleIsEditing(TagId) {
      this.tags = this.tags.map(tag => {
        if (tag.id !== TagId) return tag;
        // 如果迴圈中的 tag.id 是欲修改的 tagId 則改變 isEditing 的值
        return {
          ...tag,
          nameCached: tag.name,
          isEditing: !tag.isEditing
        };
      });
    },
    handleCancel(TagId) {
      this.tags = this.tags.map(tag => {
        if (tag.id !== TagId) {
          return tag;
        }

        // 將原本的類別名稱還回去
        return {
          ...tag,
          name: tag.nameCached
        };
      });
      this.toggleIsEditing(TagId);
    },
    async updateTag({ categoryId, name }) {
      try {
        // eslint-disable-next-line
        const { data, statusText } = await adminTagAPI.tag.put({
          categoryId,
          name
        });
        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.toggleIsEditing(categoryId);
      } catch (error) {
        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          type: "warning",
          title: "無法更新標籤，請稍後再試",
          text: ""
        });
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    async deleteTag(TagId) {
      try {
        // eslint-disable-next-line
        const { data, statusText } = await adminTagAPI.tag.delete(TagId);

        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.tags = this.tags.filter(tag => tag.id !== TagId);

        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          type: "success",
          title: "成功刪除標籤",
          text: ""
        });
      } catch (error) {
        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          type: "warning",
          title: "無法刪除標籤，請稍後再試",
          text: ""
        });
        // eslint-disable-next-line
        console.log("error", error);
      }
    }
  }
};
</script>