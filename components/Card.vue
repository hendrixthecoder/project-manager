<template lang="">
  <div class="group relative">
    <!-- Edit button begins here -->
    <button
      v-if="!isEditingCard"
      @click="handleClickEdit"
      class="absolute rounded p-1 bg-gray-700 border-gray-400 right-0 invisible group-hover:visible opacity-75 text-white"
    >
      <EditIcon :size="20" />
    </button>
    <!-- Edit button begins here -->

    <!-- Top indicator begins here -->
    <div
      class="border border-gray-500 mb-1"
      :class="[isBeingDragged]"
      v-show="isHoveringAbove"
    ></div>
    <!-- Top indicator ends here -->

    <!-- Edit card box begins -->
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
    <!-- Edit card box ends -->

    <div
      v-else
      :data-card-id="card.id"
      :class="[
        isBeingDragged
          ? 'opacity-50 border-dashed border-gray-300 text-gray-900'
          : 'border-gray-700 text-inherit',
      ]"
      class="border shadow-md rounded p-2 text-sm bg-gray-900 cursor-grab active:cursor-grabbing break-all outline-none"
      contenteditable="false"
      draggable="true"
      @dragstart="(e) => handleDragStart(e)"
      @dragend="handleDragEnd"
      @dragover="handleDragOver"
      @dragleave="resetIndicators"
      @drop="handleDrop"
      ref="cardNameInput"
    >
      {{ card.text }}
    </div>

    <!-- Bottom indicator begins here -->
    <div class="border border-gray-500 mt-1" v-show="isHoveringBelow"></div>
    <!-- Bottom indicator ends here -->
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";

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
      isHoveringAbove: false,
      isHoveringBelow: false,
      threshold: 20,
    };
  },
  methods: {
    ...mapMutations([
      "editCardText",
      "removeCardFromBoard",
      "updateDraggedCardInfo",
      "changeCardPosition",
    ]),
    handleDragEnd(event) {
      this.isBeingDragged = false;
      this.updateDraggedCardInfo({ cardId: null, boardId: null });
    },
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

      this.updateDraggedCardInfo({
        cardId: this.card.id,
        boardId: this.board.id,
      });

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
    handleDragOver(event) {
      event.preventDefault();

      const targetCardId = Number(event.target.dataset.cardId);
      if (isNaN(targetCardId)) return;

      const { cardId: thisCardId } = this.draggedCardInfo;

      if (Number(thisCardId) !== targetCardId) {
        const rect = event.target.getBoundingClientRect();
        const { clientY } = event;

        if (clientY - rect.top < this.threshold) {
          this.isHoveringAbove = true;
          this.isHoveringBelow = false;
        } else if (rect.bottom - clientY < this.threshold) {
          this.isHoveringAbove = false;
          this.isHoveringBelow = true;
        } else {
          this.resetIndicators();
        }
      }
    },
    handleDrop(event) {
      this.resetIndicators();

      const replacedCardId = Number(event.target.dataset.cardId);
      const replacedCardsBoardId =
        event.target.closest("[data-board-id]").dataset.boardId;

      this.isDraggingOver = false;

      let data = event.dataTransfer.getData("application/json");
      if (!data) return;
      const { boardId, cardId } = JSON.parse(data);

      let indexToShiftBy;
      const rect = event.target.getBoundingClientRect();
      const { clientY } = event;

      if (clientY - rect.top < this.threshold) {
        indexToShiftBy = -1;
      } else if (rect.bottom - clientY < this.threshold) {
        indexToShiftBy = 1;
      }

      if (!indexToShiftBy) return;

      this.changeCardPosition({
        cardId: Number(cardId),
        boardId: Number(boardId),
        newBoardId: Number(replacedCardsBoardId),
        replacedCardId,
        indexToShiftBy,
      });
    },
    resetIndicators() {
      this.isHoveringAbove = false;
      this.isHoveringBelow = false;
    },
  },
  components: {
    EditIcon: () => import("vue-material-design-icons/PencilOutline.vue"),
  },
  computed: {
    ...mapState(["draggedCardInfo"]),
  },
};
</script>
<style lang=""></style>
