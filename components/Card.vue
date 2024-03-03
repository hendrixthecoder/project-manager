<template lang="">
  <div
    :class="[
      isBeingDragged
        ? 'opacity-50 border-dashed border-gray-300 text-gray-900'
        : 'border-gray-700 text-inherit',
    ]"
    class="border shadow-md rounded p-2 text-sm bg-gray-900 cursor-grab active:cursor-grabbing break-all outline-none"
    draggable="true"
    :contenteditable="true"
    @dragstart="(e) => handleDragStart(e)"
    @dragend="isBeingDragged = false"
    @keydown="handleKeydown"
    @blur="handleEditText"
    ref="cardNameInput"
  >
    {{ card.text }}
  </div>
</template>
<script>
import { mapMutations } from "vuex";

export default {
  props: {
    card: {
      type: Object | null,
      default: () => ({}),
    },
    board: {
      type: Object | null,
      default: () => ({}),
    },
  },
  data() {
    return {
      isCardEditable: true,
      isBeingDragged: false,
    };
  },
  methods: {
    ...mapMutations(["editCardText", "removeCardFromBoard"]),
    async handleDragStart(event) {
      this.isBeingDragged = true;
      this.isCardEditable = false;

      this.changeDragImage(event);

      const data = JSON.stringify({
        cardId: this.card.id,
        boardId: this.board.id,
      });

      event.dataTransfer.setData("application/json", data);
    },
    handleKeydown(event) {
      if (event.key === "Enter" && !event.shiftKey) {
        this.$refs.cardNameInput.blur();
        this.handleEditText(event);
      }
    },
    handleEditText(event) {
      const text = event.target.textContent.trim();
      if (!text) return (event.target.textContent = this.card.text);

      this.editCardText({
        cardId: this.card.id,
        boardId: this.board.id,
        text,
      });
    },
    changeDragImage(event) {},
  },
};
</script>
<style lang=""></style>
