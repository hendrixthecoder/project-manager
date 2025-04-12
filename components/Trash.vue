<template lang="">
  <section
    @dragover="handleDragOver"
    @drop="handleDrop"
    @dragleave="handleDragLeave"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    class="border rounded w-16 bg-red-400 md:p-2 h-16 md:h-20 flex items-center justify-center md:w-20 duration-300 absolute cursor-grab z-50"
    :class="[
      isDraggingOver
        ? 'bg-red-800 border-red-800 '
        : 'border-red-700 bg-opacity-20',
      isBeingDragged ? 'border-dashed' : '',
    ]"
    :style="{
      top: position.y + 'px',
      left: position.x + 'px',
    }"
    draggable="true"
  >
    <TrashIcon :size="60" class="text-red-500 opacity-50" />
  </section>
</template>
<script>
import { mapMutations } from "vuex";

export default {
  components: {
    TrashIcon: () => import("vue-material-design-icons/Delete.vue"),
    TrashOpenIcon: () => import("vue-material-design-icons/DeleteEmpty.vue"),
  },
  data() {
    return {
      isDraggingOver: false,
      isBeingDragged: false,
      position: {
        x: 0,
        y: 0,
      },
      offset: {
        x: 0,
        y: 0,
      },
      bottomThreshold: 22,
    };
  },
  methods: {
    ...mapMutations(["removeCardFromBoard", "updateDraggedCardInfo"]),
    handleDragLeave(event) {
      event.preventDefault();
      this.isDraggingOver = false;
    },
    handleDragOver(event) {
      event.preventDefault();
      this.isDraggingOver = true;
      event.dataTransfer.dropEffect = "move";
    },
    handleDrop(event) {
      this.isDraggingOver = false;
      this.updateDraggedCardInfo({ cardId: null, boardId: null });

      let data = event.dataTransfer.getData("application/json");
      if (!data) return;
      data = JSON.parse(data);
      this.removeCardFromBoard(data);
    },
    handleDragStart(event) {
      this.isBeingDragged = true;
      const { clientX, clientY } = event;
      const rect = event.target.getBoundingClientRect();

      this.offset.x = clientX - rect.left;
      this.offset.y = clientY - rect.top;

      const data = JSON.stringify({
        isDraggingTrash: true,
      });

      event.dataTransfer.setData("application/json", data);
    },
    handleDragEnd() {
      this.isBeingDragged = false;
    },
    saveAndPersistPosition(x, y) {
      this.position.x = x;
      this.position.y = y;

      localStorage.setItem("trashPosition", JSON.stringify(this.position));
    },
  },
  mounted() {
    document.addEventListener("drop", (event) => {
      const { isDraggingTrash } = JSON.parse(
        event.dataTransfer.getData("application/json")
      );

      if (isDraggingTrash) {
        this.saveAndPersistPosition(
          event.clientX - this.offset.x,
          event.clientY - this.offset.y
        );
      }
    });
    this.$nextTick(() => {
      const trash = this.$el;
      const trashRect = trash.getBoundingClientRect();

      const savedPosition = localStorage.getItem("trashPosition");

      let xPos, yPos;

      if (savedPosition) {
        const { x, y } = JSON.parse(savedPosition);
        xPos = x || 0;
        yPos = y || 0;
      } else {
        xPos = window.innerWidth - trashRect.width - this.bottomThreshold;
        yPos = window.innerHeight - trashRect.height - this.bottomThreshold;
      }

      this.position.x = xPos;
      this.position.y = yPos;
    });
  },
};
</script>
<style lang=""></style>
