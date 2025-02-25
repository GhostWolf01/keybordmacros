<script setup lang="ts">
import IconArrowUp from "./IconArrowUp.vue";
import { getCodeKey } from "@/bindKeys";

interface IProps {
  type: string;
  name: string;
  label: string;
  value: string | number | boolean;
  right?: boolean;
  min?: number;
  max?: number;
  maxlength?: number;
  minlength?: number;
}

interface IEmits {
  (e: "change", value: string | number | boolean): void;
}

const props = defineProps<IProps>();

const emit = defineEmits<IEmits>();

function changeInput(e: Event) {
  const el = e.target as HTMLInputElement;
  if (props.type === "checkbox") {
    emit("change", el.checked);
  } else emit("change", el.value);
}

function keyDown(e: KeyboardEvent | MouseEvent) {
  const activeElement = document.activeElement as HTMLElement;
  const el = e.target as HTMLInputElement;
  if (activeElement === el) emit("change", getCodeKey(e));
}

function add() {
  const newValue = Number(props.value) + 1;
  if (props.max) {
    if (newValue <= props.max) emit("change", newValue);
  } else emit("change", newValue);
}

function minus() {
  const newValue = Number(props.value) - 1;
  if (props.min) {
    if (newValue >= props.min) emit("change", newValue);
  } else emit("change", newValue);
}
</script>
<template>
  <label
    class="input__label"
    :class="[
      {
        'input--text': props.type === 'keyDown',
      },
      `input--${props.type}`,
    ]"
    :for="props.name"
  >
    <span v-if="props.label && !props.right" class="input__label-text">{{ props.label }}</span>
    <input
      v-if="props.type === 'checkbox'"
      class="input"
      :type="props.type"
      :name="props.name"
      :checked="Boolean(props.value)"
      @change="changeInput"
    />
    <input
      v-else-if="props.type === 'keyDown'"
      class="input"
      type="text"
      readonly
      :name="props.name"
      :value="props.value"
      @keydown="keyDown"
      @mousedown="keyDown"
    />
    <input
      v-else
      class="input"
      :min="props.min"
      :max="props.max"
      :maxlength="props.maxlength"
      :minlength="props.minlength"
      :type="props.type"
      :name="props.name"
      :value="props.value"
      @change="changeInput"
    />
    <div v-if="props.type === 'number'" class="input__number-arrows">
      <div class="input__number-arrow" @click="add">
        <IconArrowUp></IconArrowUp>
      </div>
      <div class="input__number-arrow input__number-arrow--down" @click="minus">
        <IconArrowUp class="icon-arrow--down"></IconArrowUp>
      </div>
    </div>
    <span
      v-if="props.label && props.right"
      class="input__label-text"
      :class="{ 'input__label-text--right': props.right }"
    >
      {{ props.label }}
    </span>
  </label>
</template>
<style lang="scss">
.input__label {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 220px;
  width: max-content;
  height: 42px;
}

.input__label-text {
  margin-right: 10px;
  width: max-content;
}

.input__label-text--right {
  margin-right: 0;
  margin-left: 10px;
}

.input {
  margin: 0;
  width: 100%;
  height: 100%;
  max-width: 70px;
  padding: 2px 22px 2px 2px;
  &--text {
    .input {
      max-width: inherit;
      padding: 2px 6px;
      flex-grow: 1;
    }
  }
  &--table {
    .input__label-text {
      margin-right: 4px;
    }
  }
}

.input[type="checkbox"] {
  position: relative;
  max-width: 42px;
  height: 42px;
  background-color: #1e80ef;
}

.input__number-arrows {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  height: 42px;
}

.input__number-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
  width: 21px;
  height: 21px;
  cursor: pointer;
  border-radius: 2px 8px 0 0;
}
.input__number-arrow--down {
  border-radius: 0 0 8px 2px;
}

.input__number-arrow:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
/* .input[type="number"] {
} */

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  display: none;
}
</style>
