<template lang="">
  <section
    :class="[isDraggingOver ? 'border border-gray-500' : '']"
    class="p-2 flex flex-col gap-3 min-w-64 max-w-64 rounded"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @dragover="handleDragOver"
    @drop="handleDrop"
    @dragend="handleDragEnd"
    ref="board"
  >
    <div class="flex group gap-1.5">
      <div
        ref="boardNameInput"
        @click="isEditingName = true"
        @blur="handleBlur"
        @keydown="handleKeyDown"
        :class="[isEditingName ? ' ring-2' : '']"
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
    ...mapMutations([
      "removeBoard",
      "moveCardToAnotherBoard",
      "changeCardName",
    ]),
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
    handleDragEnter(e) {
      this.isDraggingOver = true;
    },
    highlightIndicators(e) {
      const indicators = this.getIndicators();
      this.clearHighlights(indicators);
      const el = this.getNearestIndicator(e, indicators);
      el.element?.classList.remove("hidden");
    },
    getIndicators() {
      return Array.from(
        document.querySelectorAll(`[data-column-id="${this.board.id}"]`)
      );
    },
    clearHighlights(els) {
      const indicators = els || this.getIndicators();
      indicators.forEach((i) => {
        i.classList.add("hidden");
      });
    },
    getNearestIndicator(e, indicators) {
      const DISTANCE_OFFSET = 100;
      const el = indicators.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = e.clientY - (box.top + DISTANCE_OFFSET);

          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else return closest;
        },
        {
          offset: Number.NEGATIVE_INFINITY,
          element: indicators[indicators.length - 1],
        }
      );

      return el;
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
      this.isDraggingOver = false;
      // this.clearHighlights();
    },
    handleDragEnd() {
      // this.clearHighlights();
    },
    handleDrop(event) {
      this.isDraggingOver = false;
      let data = event.dataTransfer.getData("application/json");
      if (!data) return;
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
      // this.highlightIndicators(event);
    },
  },
  components: {
    TrashIcon: () => import("vue-material-design-icons/Delete.vue"),
  },
};
</script>
<style lang=""></style>
