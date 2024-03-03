<template lang="">
  <div
    class="border shadow-md rounded border-gray-700 p-2 text-sm bg-gray-900 cursor-grab active:cursor-grabbing break-all"
    draggable="true"
    @dragstart="(e) => handleDragStart(e)"
  >
    {{ card.text }}
  </div>
</template>
<script>
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
  methods: {
    handleDragStart(event) {
      const data = JSON.stringify({
        cardId: this.card.id,
        boardId: this.board.id,
      });

      event.dataTransfer.setData("application/json", data);
    },
  },
};
</script>
<style lang=""></style>
