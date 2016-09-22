<template>
  <li class="todo"
    v-bind:class="{editing : editedTodo == todo, done: todo.done}"
    v-touch:swiperight="toggleDone"
    v-touch:swipeleft="removeTodo"
    >
    <div class="wrapper" v-bind:style="{backgroundColor: backgroundColor}">
      <div class="view" v-touch:tap="editTodo"> {{todo.text}} </div>
      <textarea
        type="text"
        rows="1"
        v-model="todo.text"
        v-on:blur="doneEdit"
        v-on:keyup.enter="doneEdit"
        v-todo-focus="editedTodo == todo"
      ></textarea>
    </div>
  </li>
</template>

<script>
import Vue from 'vue';
import autosize from 'autosize';
export default {
  props: ['todo', 'editedTodo', 'index'],
  ready() {
    autosize(this.$el.querySelector('textarea'));
  },
  computed: {
    backgroundColor() {
      return `rgb(220, ${this.index * 5}, 30)`;
    },
  },
  methods: {
    doneEdit() {
      this.$dispatch('done-edit', this.todo);
    },
    editTodo() {
      if (this.todo.done) {
        return;
      }
      this.$dispatch('edit-todo', this.todo);
    },
    toggleDone() {
      this.$dispatch('toggle-done', this.todo);
    },
    removeTodo() {
      this.$dispatch('remove-todo', this.todo);
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
  .todo {
    perspective: 50em;
    &.editing {
      position: relative;
      z-index: 10;
      .wrapper {
        transform: translateZ(1em);
      }
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
    textarea {
      display: none;
      border: 0;
    }
    &.done {
      text-decoration: line-through;
    }
  }
</style>
