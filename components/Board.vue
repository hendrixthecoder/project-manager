<template lang="">
  <section
    :class="[isDraggingOver ? 'border-gray-500' : 'border-transparent']"
    class="border p-2 flex flex-col gap-3 min-w-64 max-w-64 rounded transition-colors"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @dragover="handleDragOver"
    @drop="handleDrop"
    ref="board"
    :data-board-id="board.id"
  >
    <div class="flex group gap-1.5">
      <div
        ref="boardNameInput"
        @click="isEditingName = true"
        @blur="handleBlur"
        @keydown="handleKeyDown"
        :class="[isEditingName ? ' ring-2 ring-gray-600' : '']"
        class="text-gray-400 font-medium text-lg flex-grow rounded outline-none break-all"
        :contenteditable="true"
      >
        {{ board.name }}
      </div>
      <button
        @click="handleDeleteBoard"
        class="text-red-600 invisible group-hover:visible"
      >
        <TrashIcon :size="20" />
      </button>
    </div>

    <div class="overflow-y-scroll max-h-[480px]">
      <Cards :cards="board.cards" :board="board" />
    </div>

    <AddCard :board="board" />
  </section>
</template>
<script>
import { mapMutations } from "vuex";

export default {
  props: {
    board: {
      type: Object | null,
      default: () => ({}),
    },
  },
  data() {
    return {
      isDraggingOver: false,
      isEditingName: false,
    };
  },
  methods: {
    ...mapMutations(["removeBoard", "changeCardName", "pushCardToBoard"]),
    handleKeyDown(event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        this.$refs.boardNameInput.blur();
      }
    },
    handleDeleteBoard() {
      this.removeBoard({
        boardId: this.board.id,
      });
    },
    handleDragEnter() {
      this.isDraggingOver = true;
    },
    getIndicators() {},
    handleBlur(event) {
      this.isEditingName = false;
      const newName = event.target.textContent.trim();
      if (!newName) return (event.target.textContent = this.board.name);

      this.changeCardName({
        boardId: this.board.id,
        newName,
      });
    },
    handleDragLeave() {
      this.isDraggingOver = false;
    },
    handleDragOver(event) {
      event.preventDefault();
      this.isDraggingOver = true;
      event.dataTransfer.dropEffect = "move";
    },
    handleDrop(event) {
      this.isDraggingOver = false;

      let data = event.dataTransfer.getData("application/json");
      if (!data) return;
      const { boardId, cardId } = JSON.parse(data);

      this.pushCardToBoard({
        newBoardId: this.board.id,
        cardId,
        boardId,
      });
    },
  },
  components: {
    TrashIcon: () => import("vue-material-design-icons/Delete.vue"),
  },
};
</script>
<style lang=""></style>
