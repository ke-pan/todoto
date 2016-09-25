<template>
  <div id="app">
    <div class="container" v-bind:style="{top: pullHeight}">
      <div class="pull-down" style="background-color: rgb(220, 0, 30);" v-bind:style="{transform: pullRotate}">
        <div class="wrapper">
          pull to create a todo item
        </div>
      </div>
      <ul class="todo-list">
        <todo
          v-for="todo in todos"
          :todo="todo"
          :edited-todo="editedTodo"
          :index="$index">
        </todo>
        <todo v-for="todo in doneTodos" :todo="todo" :edited-todo="editedTodo" :index="$index"></todo>
        <div id="placeholder" v-show="dragging" v-bind:style="{height: placeholderHeight}"></div>
      </ul>
      <div class="mask" v-show="editedTodo != null"></div>
    </div>
    <div class="notice" v-show="emptyTodos"> Pull down to create a todo </div>
    <div v-show="!editing" class="remain" v-on:click.self="tapToAdd" v-touch:panmove="pullDown" v-touch:panend="pullToAdd"></div>
  </div>
</template>

<script>
import Todo from 'components/todo.vue';
export default {
  data() {
    return {
      todos: [],
      doneTodos: [],
      editedTodo: null,
      pullDownY: 0,
      dragging: false,
      placeholderPosition: -1,
      placeholderHeight: '0px',
    };
  },
  methods: {
    pullDown(e) {
      if (this.editing || this.dragging) {
        return;
      }
      let pullDownY = e.deltaY;
      pullDownY = Math.min(45, pullDownY); // TODO
      pullDownY = Math.max(0, pullDownY);
      this.pullDownY = pullDownY;
    },
    newTodo() {
      return {
        text: '',
        done: false,
      };
    },
    editTodo(todo) {
      this.editedTodo = todo;
    },
    pullToAdd() {
      if (this.pullDownY > 40) {
        const newTodo = this.newTodo();
        this.todos.unshift(newTodo);
        this.editTodo(newTodo);
      }
      this.pullDownY = 0;
    },
    tapToAdd() {
      const newTodo = this.newTodo();
      this.todos.push(newTodo);
      this.editTodo(newTodo);
    },
    reorderTodo(todo) {
      this.todos.$remove(todo);
      this.todos.splice(this.placeholderPosition, 0, todo);
    },
    removeTodo(todo) {
      if (todo.done) {
        this.doneTodos.$remove(todo);
      } else {
        this.todos.$remove(todo);
      }
    },
    toggleDone(todo) {
      if (todo.done) {
        this.doneTodos.$remove(todo);
        this.todos.push(todo);
      } else {
        this.todos.$remove(todo);
        this.doneTodos.unshift(todo);
      }
      todo.done = !todo.done;
    },
    listCenters() {
      return Array.prototype.map.call(this.$el.querySelectorAll('.todo.not-dragging'), el =>
        el.offsetTop + el.offsetHeight / 2
      );
    },
    getPosition(side) {
      const listCenters = this.listCenters()
      for (let i = 0; i < listCenters.length; i += 1) {
        if (side < listCenters[i]) {
          return i;
        }
      }
      return listCenters.length;
    },
  },
  computed: {
    emptyTodos() {
      return this.todos.length + this.doneTodos.length === 0;
    },
    editing() {
      return this.editedTodo !== null;
    },
    pullRotate() {
      return `rotateX(${((45 - this.pullDownY) * 90 / 45)}deg)`;
    },
    pullHeight() {
      return `${this.pullDownY - 45}px`;
    },
  },
  events: {
    'edit-todo': function (todo) {
      this.editTodo(todo);
    },
    'done-edit': function (todo) {
      if (!this.editing) {
        return;
      }
      this.editedTodo = null;
      todo.text = todo.text.trim();
      if (!todo.text) {
        this.removeTodo(todo);
      }
    },
    'remove-todo': function (todo) {
      this.removeTodo(todo);
    },
    'toggle-done': function (todo) {
      this.toggleDone(todo);
    },
    'drag-todo': function (index, height) {
      this.dragging = true;
      this.placeholderHeight = `${height}px`;
      const placeholder = this.$el.querySelector('#placeholder');
      this.$el.querySelector('ul').insertBefore(
        placeholder,
        this.$el.querySelectorAll('.todo')[index]
      );
    },
    'drag-todo-end': function (todo) {
      this.dragging = false;
      this.reorderTodo(todo);
    },
    drag(side) {
      const el = this.$el;
      const position = this.getPosition(side);
      if (position !== this.placeholderPosition) {
        this.placeholderPosition = position;
        const placeholder = el.querySelector('#placeholder');
        el.querySelector('ul')
          .insertBefore(placeholder, el.querySelectorAll('.todo.not-dragging')[position]);
      }
    },
  },
  components: {
    todo: Todo,
  },
};
</script>

<style lang="scss">
  html {
    height: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  #app {
    position: relative;
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: rgb(39, 41, 47);
    .remain {
      height: 100%;
    }
  }

  #placeholder {
    background: rgb(39, 41, 47);
    height: 2em;
  }

  .notice {
    position: absolute;
    top: 40%;
    width: 100%;
    text-align: center;
    font-size: 2em;
    color: white;
  }

  .container {
    position: absolute;
    width: 100%;
    perspective: 400px;
  }

  .pull-down {
    transform-origin: bottom;
  }

  .wrapper {
    padding: 0.2em 0.5em;
    font-size: 1.5em;
    line-height: 1.4;
    color: white;
  }

  ul {
    position: relative;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(39, 41, 47, 0.9);
  }

</style>
