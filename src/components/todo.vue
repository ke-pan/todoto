<template>
  <li class="todo"
    v-bind:class="{editing : editing, done: todo.done, dragging: dragging, 'not-dragging': !dragging}"
    v-touch:swiperight="toggleDone"
    v-touch:swipeleft="removeTodo"
    v-touch:panstart="dragStart"
    v-touch:panend="dragEnd"
    v-touch:pandown.stop="drag($event, 'down')"
    v-touch:panup.stop="drag($event, 'up')"
    v-bind:style="{top: top}"
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
      originTop: 0,
      originBottom: 0,
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
      this.$dispatch('toggle-done', this.todo);
    },
    removeTodo() {
      this.$dispatch('remove-todo', this.todo);
    },
    dragStart() {
      this.originTop = this.$el.offsetTop;
      this.originBottom = this.originTop + this.$el.offsetHeight;
      this.dragging = true;
      this.$dispatch('drag-todo', this.index);
    },
    dragEnd() {
      this.dragging = false;
      this.top = '0px';
      this.$dispatch('drag-todo-end', this.todo);
    },
    drag(e, dir) {
      // console.log(e);
      let top;
      let bottom;
      Vue.nextTick(() => {
        top = this.originTop + e.deltaY;
        this.top = `${top}px`;
        if (dir === 'down') {
          bottom = this.originBottom + e.deltaY;
          this.$dispatch('drag', bottom);
        } else {
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
