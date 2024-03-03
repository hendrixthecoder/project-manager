<template lang="">
  <div
    class="border border-gray-700 flex-grow rounded bg-gray-800 p-5 flex justify-between"
  >
    <div class="flex gap-3 max-w-6xl overflow-y-scroll">
      <Board :board="board" v-for="(board, idx) of boards" :key="board.id" />
      <AddBoard />
    </div>
    <div class="flex gap-3">
      <Trash />
    </div>
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
  components: {},
};
</script>
<style lang=""></style>
