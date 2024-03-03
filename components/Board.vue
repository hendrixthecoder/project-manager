<template lang="">
  <section
    :class="[isDraggingOver ? 'border border-gray-500' : '']"
    class="p-2 flex flex-col gap-3 min-w-64 max-w-64 rounded"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <div class="flex group gap-1.5">
      <div
        @click="isEditingName = true"
        @blur="handleBlur"
        :class="[isEditingName ? ' ring-2' : '']"
        class="text-gray-400 font-medium text-lg flex-grow rounded outline-none"
        :contenteditable="true"
      >
        {{ board.name }}
      </div>
      <button
        @click="handleDeleteBoard"
        class="text-red-500 invisible group-hover:visible"
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
    ...mapMutations([
      "removeBoard",
      "moveCardToAnotherBoard",
      "changeCardName",
    ]),
    handleDeleteBoard() {
      this.removeBoard({
        boardId: this.board.id,
      });
    },
    handleDragEnter() {
      this.isDraggingOver = true;
    },
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
      setTimeout(() => {
        this.isDraggingOver = false;
      }, 200);
    },
    handleDrop(event) {
      this.isDraggingOver = false;
      let data = event.dataTransfer.getData("application/json");
      data = JSON.parse(data);

      this.moveCardToAnotherBoard({
        cardId: data.cardId,
        boardId: data.boardId,
        newBoardId: this.board.id,
      });
    },
    handleDragOver(event) {
      event.preventDefault();
      this.isDraggingOver = true;
      event.dataTransfer.dropEffect = "move";
    },
  },
  components: {
    TrashIcon: () => import("vue-material-design-icons/Delete.vue"),
  },
};
</script>
<style lang=""></style>
