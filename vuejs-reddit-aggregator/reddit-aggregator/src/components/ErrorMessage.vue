<template>
  <div>
    <b-alert show dismissible variant="danger">{{ errorMessage }}</b-alert>
  </div>
</template>

<script>
export default {
  props: ["errorMessage"],
  computed: {},
  methods: {},
};
</script>

<style></style>
