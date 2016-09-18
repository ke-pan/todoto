<template>
  <li
    v-bind:style="{backgroundColor: backgroundColor}"
    v-bind:class="{editing : editedTodo == todo}"
  >
    <div class="view" v-on:click="editTodo"> {{todo.text}} </div>
    <input
      type="text"
      v-model="todo.text"
      v-on:blur="doneEdit"
      v-on:keyup.enter="doneEdit"
      v-todo-focus="editedTodo == todo"
    >
  </li>
</template>

<script>
import Vue from 'vue';
export default {
  props: ['todo', 'editedTodo'],
  computed: {
    backgroundColor() {
      return `rgb(220, ${this.todo.position * 5}, 30)`;
    },
  },
  methods: {
    doneEdit() {
      this.$dispatch('done-edit', this.todo);
    },
    editTodo() {
      this.$dispatch('edit-todo', this.todo);
    },
  },
  directives: {
    /* global Vue */
    'todo-focus': function (editing) {
      if (!editing) {
        return;
      }
      const el = this.el;
      Vue.nextTick(() => {
        el.focus();
      })
    },
  },
};
</script>

<style lang="scss">
  li {
    border: 1px solid red;
    padding: 0.2em 0.5em;
    font-size: 1.5em;
    line-height: 1.4;
    color: white;
    input {
      display: none;
      border: 0;
    }
    &.editing {
      position: relative;
      z-index: 10;
      .view {
        display: none;
      }
      input {
        display: block;
        width: 100%;
        background: transparent;
        font-size: 1em;
        color: white;
      }
    }
  }
</style>
