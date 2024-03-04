<template lang="">
  <section
    @dragover="handleDragOver"
    @drop="handleDrop"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    class="border rounded bg-red-300 p-2 h-1/4 flex items-center justify-center flex-grow min-w-44 transition-colors duration-300"
    :class="[isDraggingOver ? 'bg-red-700 border-red-700' : 'border-red-500']"
  >
    <TrashIcon :size="60" class="text-red-500" v-if="!isDraggingOver" />
    <TrashOpenIcon
      :size="60"
      class="text-red-800 delay-200 animate-bounce"
      v-else
    />
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
    };
  },
  methods: {
    ...mapMutations(["removeCardFromBoard"]),
    handleDragEnter() {
      this.isDraggingOver = true;
    },
    handleDragLeave() {
      this.isDraggingOver = false;
    },
    handleDragOver(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    handleDrop(event) {
      let data = event.dataTransfer.getData("application/json");
      if (!data) return;
      data = JSON.parse(data);
      this.removeCardFromBoard(data);

      this.isDraggingOver = false;
    },
  },
};
</script>
<style lang=""></style>
