<template lang="">
  <div
    class="border border-gray-700 flex-grow rounded bg-gray-800 p-5 flex justify-between gap-2"
  >
    <div class="flex gap-3 flex-grow overflow-y-hidden">
      <Board :board="board" v-for="(board, idx) of boards" :key="board.id" />
      <AddBoard />
    </div>
    <Trash />
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      boards: [],
    };
  },
  computed: {
    ...mapGetters(["getBoards"]),
  },
  methods: {
    ...mapActions(["initializeBoards"]),
  },
  mounted() {
    this.initializeBoards();
    this.boards = this.getBoards;
  },
};
</script>
<style lang=""></style>
