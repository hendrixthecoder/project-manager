<template lang="">
  <div class="group relative" :data-card-id="card.id">
    <!-- Edit button begins here -->
    <button
      v-if="!isEditingCard"
      @click="handleClickEdit"
      class="absolute rounded p-1 bg-gray-700 border-gray-400 right-0 invisible group-hover:visible opacity-75 text-white"
    >
      <EditIcon :size="20" />
    </button>
    <!-- Edit button begins here -->

    <!-- Edit card box -->
    <div
      @blur="handleEditText"
      @keydown="handleKeydown"
      contenteditable="true"
      draggable="false"
      class="border shadow-md border-gray-200 border-dashed rounded p-2 text-sm bg-gray-900 break-all outline-none"
      v-if="isEditingCard"
      ref="editBox"
    >
      {{ card.text }}
    </div>
    <!-- Edit card box -->

    <div
      v-else
      :class="[
        isBeingDragged
          ? 'opacity-50 border-dashed border-gray-300 text-gray-900'
          : 'border-gray-700 text-inherit',
      ]"
      class="border shadow-md rounded p-2 text-sm bg-gray-900 cursor-grab active:cursor-grabbing break-all outline-none"
      contenteditable="false"
      draggable="true"
      @dragstart="(e) => handleDragStart(e)"
      @dragend="isBeingDragged = false"
      ref="cardNameInput"
    >
      {{ card.text }}
    </div>
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
      isBeingDragged: false,
      isEditingCard: false,
    };
  },
  methods: {
    ...mapMutations(["editCardText", "removeCardFromBoard"]),
    handleDragStart(event) {
      this.isBeingDragged = true;

      const data = JSON.stringify({
        cardId: this.card.id,
        boardId: this.board.id,
      });

      const dragPreview = document.createElement("div");
      dragPreview.textContent = this.card.text;
      dragPreview.style.position = "absolute";
      dragPreview.style.top = "-9999px";
      dragPreview.style.padding = "8px 12px";
      dragPreview.style.background = "#111827";
      dragPreview.style.color = "white";
      dragPreview.style.borderRadius = "8px";
      dragPreview.style.fontSize = "14px";
      dragPreview.style.borderColor = "white";
      dragPreview.style.border = "0.5px solid #4b5563";
      document.body.appendChild(dragPreview);

      event.dataTransfer.setDragImage(dragPreview, 10, 10);

      event.dataTransfer.setData("application/json", data);

      event.target.addEventListener(
        "dragend",
        () => {
          document.body.removeChild(dragPreview);
        },
        { once: true }
      );
    },
    handleKeydown(event) {
      if (event.key === "Enter" && !event.shiftKey) {
        if (this.isEditingCard) {
          this.$nextTick(() => {
            this.$refs.editBox.focus();
          });
        }
        this.handleEditText(event);
      }
    },
    handleEditText(event) {
      this.isEditingCard = false;
      const text = event.target.textContent.trim();
      if (!text) return (event.target.textContent = this.card.text);

      this.editCardText({
        cardId: this.card.id,
        boardId: this.board.id,
        text,
      });
    },
    handleClickEdit() {
      this.isEditingCard = true;
      if (this.isEditingCard) {
        this.$nextTick(() => {
          this.$refs.editBox.focus();
        });
      }
    },
  },
  components: {
    EditIcon: () => import("vue-material-design-icons/PencilOutline.vue"),
  },
};
</script>
<style lang=""></style>
