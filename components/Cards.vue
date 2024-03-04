<template lang="">
  <section class="flex flex-col gap-2">
    <Card
      v-for="(card, idx) of cards"
      :card="card"
      :key="card.id"
      :board="board"
      :idx="idx"
    />

    <div class="text-sm" v-if="!cards.length">No cards add some.</div>
  </section>
</template>
<script>
export default {
  props: {
    cards: {
      type: Array,
      default: () => ({}),
    },
    board: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
<style lang=""></style>
