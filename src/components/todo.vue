<template>
  <li class="todo"
    v-bind:class="{editing : editing, done: todo.done, dragging: dragging, 'not-dragging': !dragging}"
    v-touch:swiperight="toggleDone"
    v-touch:swipeleft="removeTodo"
    v-touch:press="press"
    v-touch:panstart="dragStart"
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
      draggable: false,
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
      if (this.draggable) return;
      this.$dispatch('toggle-done', this.todo);
    },
    removeTodo() {
      if (this.draggable) return;
      this.$dispatch('remove-todo', this.todo);
    },
    press() {
      if (this.todo.done) return;
      this.draggable = true;
    },
    dragStart() {
      if (!this.draggable) return;
      // console.log('drag start');
      this.originTop = this.$el.offsetTop;
      this.originLeft = this.$el.offsetLeft;
      this.originBottom = this.originTop + this.$el.offsetHeight;
      this.dragging = true;
      this.$dispatch('drag-todo', this.index);
    },
    dragEnd() {
      if (!this.draggable) return;
      // console.log('drag end');
      this.dragging = false;
      this.draggable = false;
      this.top = '0px';
      this.$dispatch('drag-todo-end', this.todo);
    },
    drag(e) {
      if (!this.dragging) return;
      console.log(e);
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
    }
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
