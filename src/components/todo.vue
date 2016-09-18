<template>
  <li
    v-bind:style="{backgroundColor: backgroundColor}"
    v-bind:class="{editing : editedTodo == todo}"
  >
    <div class="view" v-on:click="editTodo"> {{todo.text}} </div>
    <textarea
      type="text"
      rows="1"
      v-model="todo.text"
      v-on:blur="doneEdit"
      v-on:keyup.enter="doneEdit"
      v-todo-focus="editedTodo == todo"
    ></textarea>
  </li>
</template>

<script>
import Vue from 'vue';
import autosize from 'autosize';
export default {
  props: ['todo', 'editedTodo'],
  ready() {
    autosize(this.$el.querySelector('textarea'));
  },
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
    textarea {
      display: none;
      border: 0;
    }
    &.editing {
      position: relative;
      z-index: 10;
      .view {
        display: none;
      }
      textarea {
        display: block;
        width: 100%;
        background: transparent;
        font-size: 1em;
        color: white;
      }
    }
  }
</style>
