<script setup lang="ts">
import { ref } from "vue";
import Input from "./Input.vue";
import type { ISelectItem } from "./Select.vue";
import Select from "./Select.vue";
import type { InputTypeKeybdActions } from "@/types/app";
import type { IKeyboardAction } from "@/keyboardActions/keyboardActions";
import {
  SelectActionFunctions,
  getDefaultActionFunction,
  getDefaultKeyboardAction,
  cloneActionFunction,
  saveKeybdActions,
} from "@/keyboardActions/keyboardActions";
import Button from "./Button.vue";
import EditParamsModal from "./EditParamsModal.vue";
import type { OpenKeybdAction } from "./EditParamsModal.vue";

interface IProps {
  keybdActions: IKeyboardAction[];
}

interface IEmits {
  (e: "change", value: string | number | boolean): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

function changeInput(
  value: string | number | boolean,
  type: InputTypeKeybdActions,
  keybdAction: IKeyboardAction
) {
  const InputTypes = {
    name: () => {
      keybdAction.name = String(value);
    },
    keyActive: () => {
      keybdAction.keyActive = String(value);
    },
  };
  InputTypes[type]?.();
}

function changeSelect(value: ISelectItem, keybdAction: IKeyboardAction) {
  if (value.id !== null) {
    const selectActionF = SelectActionFunctions.find((v) => v.id === value.id);
    if (selectActionF) {
      keybdAction.action = cloneActionFunction(selectActionF);
    } else keybdAction.action = getDefaultActionFunction();
  } else keybdAction.action = getDefaultActionFunction();
}

function addAction() {
  props.keybdActions.push(getDefaultKeyboardAction());
}
function save() {
  saveKeybdActions();
}
function deleteAction(index: number) {
  props.keybdActions.splice(index, 1);
}

const showEditParamsModal = ref(false);
let openKeybdAction: OpenKeybdAction = null;

function editParams(keybdAction: IKeyboardAction) {
  showEditParamsModal.value = true;
  openKeybdAction = keybdAction;
}

function hiddenEditParamsModal() {
  showEditParamsModal.value = false;
  openKeybdAction = null;
}
</script>

<template>
  <div class="table-actions">
    <div class="table-actions__btns">
      <Button type="button" @click="addAction">Add Action</Button>
      <Button type="button" @click="save">Save</Button>
    </div>
    <table class="table-actions__table">
      <thead>
        <tr>
          <th scope="col">Name Action</th>
          <th scope="col">Action</th>
          <th scope="col">Key Active</th>
          <th scope="col">Parameters</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(keybdAction, index) in props.keybdActions">
          <th>
            <Input
              label=""
              type="text"
              name="name"
              :minlength="1"
              :maxlength="500"
              :value="keybdAction.name"
              @change="(value) => changeInput(value, 'name', keybdAction)"
            />
          </th>
          <td>
            <Select
              name="action"
              label=""
              :value="keybdAction.action"
              :items="SelectActionFunctions"
              @change="(value) => changeSelect(value, keybdAction)"
            />
          </td>
          <td>
            <Input
              label=""
              type="keyDown"
              name="keyActive"
              :value="keybdAction.keyActive"
              @change="(value) => changeInput(value, 'keyActive', keybdAction)"
            />
          </td>
          <td>
            <Button type="button" @click="editParams(keybdAction)">Edit Params</Button>
          </td>
          <td>
            <Button type="button" @click="deleteAction(index)">Delete Action</Button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th scope="row"></th>
        </tr>
      </tfoot>
    </table>
  </div>
  <EditParamsModal
    :show="showEditParamsModal"
    :keybdAction="openKeybdAction"
    @cancel="hiddenEditParamsModal"
  />
</template>

<style lang="scss">
.table-actions {
  &__btns {
    & > :nth-child(n) {
      margin-right: 4px;
    }
    & > :last-child {
      margin-right: 0;
    }
  }
}
</style>
