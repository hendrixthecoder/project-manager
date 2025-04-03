<template lang="">
  <section>
    <div class="flex flex-col gap-3" v-if="showNewCardForm">
      <textarea
        autoFocus
        placeholder="Enter card text.."
        name=""
        v-model="card"
        class="outline-none border rounded border-gray-700 p-2 bg-gray-800"
        id=""
        cols="30"
        rows="1"
        ref="newCardForm"
      >
      </textarea>
      <div class="flex justify-end gap-2 items-center text-sm">
        <button class="text-gray-300" @click="showNewCardForm = false">
          <CloseIcon :size="20" />
        </button>
        <button
          :class="[!card ? 'cursor-not-allowed' : '']"
          class="bg-gray-800 px-2 p-1 rounded border border-gray-600 shadow"
          :disabled="!card"
          @click="handleAddCardToBoard"
        >
          Add
        </button>
      </div>
    </div>
    <button
      v-else
      class="flex items-center gap-1 text-gray-500 self-start text-sm"
      @click="handleOpenNewCardForm"
    >
      <PlusIcon :size="20" />
      <span>Add card</span>
    </button>
  </section>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  components: {
    PlusIcon: () =>
      import("vue-material-design-icons/PlusBoxMultipleOutline.vue"),
    CloseIcon: () => import("vue-material-design-icons/Close.vue"),
  },
  props: {
    board: {
      default: () => ({}),
      type: Object | null,
    },
  },
  methods: {
    ...mapMutations(["addCardToBoard"]),
    handleAddCardToBoard() {
      this.addCardToBoard({
        boardId: this.board.id,
        card: this.card,
      });

      this.card = "";
      this.showNewCardForm = false;
    },
    handleOpenNewCardForm() {
      this.showNewCardForm = true;
      this.$nextTick(() => {
        this.$refs.newCardForm?.focus();
      });
    },
  },
  data() {
    return {
      showNewCardForm: false,
      card: "",
    };
  },
  computed: {
    ...mapGetters(["getBoards"]),
  },
};
</script>
<style lang=""></style>
