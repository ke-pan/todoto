<template>
  <li class="todo"
    v-bind:class="{editing : editing, done: todo.done, dragging: dragging, 'not-dragging': !dragging}"
    v-touch:swiperight="toggleDone"
    v-touch:swipeleft="removeTodo"
    v-touch:press="press"
    v-touch:pressup="dragEnd"
    v-touch:panend="dragEnd"
    v-touch:pan.stop="drag"
    v-bind:style="{top: top, left: left}"
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
  data() {
    return {
      dragging: false,
      top: '0px',
      left: '0px',
      originTop: 0,
      originBottom: 0,
      originLeft: 0,
    }
  },
  ready() {
    autosize(this.$el.querySelector('textarea'));
  },
  computed: {
    backgroundColor() {
      return `rgb(220, ${this.index * 20}, 30)`;
    },
    editing() {
      return this.editedTodo === this.todo;
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
      if (this.dragging) return;
      this.$dispatch('toggle-done', this.todo);
    },
    removeTodo() {
      if (this.dragging) return;
      this.$dispatch('remove-todo', this.todo);
    },
    press() {
      if (this.todo.done) return;
      this.dragging = true;
      this.originTop = this.$el.offsetTop;
      this.originLeft = this.$el.offsetLeft;
      this.top = `${this.originTop}px`
      this.left = `${this.originLeft}px`
      this.originBottom = this.originTop + this.$el.offsetHeight;
      this.$dispatch('drag-todo', this.index, this.$el.offsetHeight);
    },
    dragEnd() {
      if (!this.dragging) return;
      console.log('drag end');
      Vue.nextTick(() => {
        this.top = '0px';
        this.left = '0px';
        this.dragging = false;
        this.$dispatch('drag-todo-end', this.todo);
      });
    },
    drag(e) {
      if (!this.dragging) return;
      console.log('drag');
      let top;
      let left;
      let bottom;
      Vue.nextTick(() => {
        top = this.originTop + e.deltaY;
        left = this.originLeft + e.deltaX;
        this.top = `${top}px`;
        this.left = `${left}px`;
        if (e.additionalEvent === 'pandown') {
          bottom = this.originBottom + e.deltaY;
          this.$dispatch('drag', bottom);
        } else if (e.additionalEvent === 'panup') {
          this.$dispatch('drag', top);
        }
      });
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
    &.dragging {
      position: absolute;
      z-index: 1000;
      width: 100%;
      transform: scaleY(1.1);
      border-right: 1px solid rgba(0, 0, 0, 0.7);
      border-bottom: 1px solid rgba(0, 0, 0, 0.7);
      box-shadow: 1px 1px 2px black;
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
    textarea {
      display: none;
      border: 0;
    }
    &.done {
      text-decoration: line-through;
    }
  }
</style>
