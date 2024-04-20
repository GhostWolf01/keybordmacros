<script setup lang="ts">
interface IProps {
  type: "submit" | "reset" | "button";
}

interface IEmits {
  (e: "click", el: MouseEvent): void;
}

const props = defineProps<IProps>();

const emit = defineEmits<IEmits>();
</script>

<template>
  <button class="button" :type="props.type" @click="emit('click', $event)">
    <slot></slot>
  </button>
</template>

<style lang="scss">
.button {
  padding: 0 10px;
  height: 42px;
}
</style>
