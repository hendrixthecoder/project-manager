<template lang="">
  <div class="p-2 max-w-56 min-w-56 flex flex-col">
    <button
      v-if="!showAddBoardForm"
      @click="handleOpenForm"
      class="border border-gray-600 shadow bg-gray-800 rounded-md flex items-center gap-1 w-full p-2 text-gray-500"
    >
      <AddBoardIcon :size="20" />
      <span>Add board</span>
    </button>
    <div class="flex flex-col gap-3" v-else>
      <textarea
        ref="addBoardInput"
        name=""
        autoFocus
        placeholder="Enter board name here.."
        v-model="boardName"
        class="outline-none border rounded border-gray-700 p-2 bg-gray-800 placeholder:text-sm"
        id=""
        cols="19"
        rows="1"
      >
      </textarea>
      <div class="flex justify-end gap-2 items-center text-sm">
        <button class="text-gray-300" @click="handleCloseForm">
          <CloseIcon :size="20" />
        </button>
        <button
          :class="[!boardName ? 'cursor-not-allowed' : '']"
          class="bg-gray-800 px-2 p-1 rounded border border-gray-600 shadow"
          :disabled="!boardName"
          @click="handleAddNewBoard"
        >
          Add
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";

export default {
  components: {
    AddBoardIcon: () =>
      import("vue-material-design-icons/ViewDashboardOutline.vue"),
    CloseIcon: () => import("vue-material-design-icons/Close.vue"),
  },
  data() {
    return {
      showAddBoardForm: false,
      boardName: "",
    };
  },
  methods: {
    ...mapMutations(["addBoard"]),
    handleCloseForm() {
      this.showAddBoardForm = false;
      this.boardName = "";
    },
    handleOpenForm() {
      this.showAddBoardForm = true;

      if (this.$refs.addBoardInput) {
        this.$refs.addBoardInput.focus();
      }
    },
    handleAddNewBoard() {
      this.addBoard({
        name: this.boardName,
      });

      this.boardName = "";
      this.showAddBoardForm = false;
    },
  },
};
</script>
<style lang=""></style>
