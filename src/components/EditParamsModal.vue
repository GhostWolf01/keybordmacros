<script setup lang="ts">
import Button from "./Button.vue";
import Input from "./Input.vue";
import type { IKeyboardAction, TActionFunctionParameter } from "@/keyboardActions/keyboardActions";

export type OpenKeybdAction = IKeyboardAction | null;

interface IProps {
  show: boolean;
  keybdAction: OpenKeybdAction;
}

interface IEmits {
  (e: "cancel"): void;
}

const props = defineProps<IProps>();

const emit = defineEmits<IEmits>();

function save() {
  emit("cancel");
}

function cancel() {
  emit("cancel");
}

function changeParams(value: string | number | boolean, param: TActionFunctionParameter) {
  const InputTypes = {
    number: () => {
      param.value = Number(value);
    },
    text: () => {
      param.value = String(value);
    },
    keyDown: () => {
      param.value = String(value);
    },
    keysArray: () => {},
  };
  InputTypes[param.type]?.();
}

function changeKeysArray(
  value: string | number | boolean,
  param: TActionFunctionParameter,
  index: number
) {
  if (Array.isArray(param.value)) param.value[index] = String(value);
}

function addKey(param: TActionFunctionParameter) {
  if (Array.isArray(param.value)) param.value.push("");
}

function deleteKey(param: TActionFunctionParameter, index: number) {
  if (Array.isArray(param.value)) param.value.splice(index, 1);
}
</script>

<template>
  <Teleport to="#modals">
    <div v-show="props.show" class="edit-params-modal">
      <div class="edit-params-modal__body">
        <template v-if="props.keybdAction">
          <template v-for="param in props.keybdAction.action.params" :key="param.name">
            <div class="edit-params-modal__keys-array" v-if="param.type === 'keysArray'">
              <div
                class="edit-params-modal__keys-array-item"
                v-for="(key, index) in param.value"
                :key="index"
              >
                <Input
                  class="edit-params-modal__keys-array-item-input input--table"
                  :label="`Key${index + 1}: `"
                  type="keyDown"
                  :name="`Key${index + 1}`"
                  :value="key"
                  @change="(value) => changeKeysArray(value, param, index)"
                />
                <Button type="button" @click="deleteKey(param, index)">Delete Key</Button>
              </div>
              <Button type="button" @click="addKey(param)">Add Key</Button>
            </div>
            <Input
              v-else-if="!Array.isArray(param.value)"
              class="input--table"
              :label="`${param.name}: `"
              :type="param.type"
              :name="param.name"
              :min="1"
              :max="Number.MAX_VALUE"
              :value="param.value"
              @change="(value) => changeParams(value, param)"
            />
          </template>
        </template>
      </div>
      <div class="edit-params-modal__footer">
        <Button type="button" @click="save">Save</Button>
        <Button type="button" @click="cancel">Cancel</Button>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss">
.edit-params-modal {
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px 20px 10px;
  border-radius: 10px;
  border: 1px solid #f6f6f6;
  background-color: #2f2f2f;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  &__keys-array {
    &-item {
      display: flex;
      margin-bottom: 4px;
      &-input {
        margin-right: 4px;
      }
    }
  }
  &__body {
    & > :nth-child(n) {
      margin-bottom: 4px;
    }
    & > :last-child {
      margin-bottom: 0;
    }
  }
  &__footer {
    width: 100%;
    margin-top: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    & > :last-child {
      margin-left: 6px;
    }
  }
}
</style>
