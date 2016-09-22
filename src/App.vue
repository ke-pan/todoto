<template>
  <div id="app" v-touch:panmove="pullDown" v-touch:panend="pullToAdd">
    <div class="container" v-bind:style="{top: pullHeight}">
      <div class="pull-down" style="background-color: rgb(220, 0, 30);" v-bind:style="{transform: pullRotate}">
        <div class="wrapper">
          pull to create a todo item
        </div>
      </div>
      <ul class="todo-list">
        <todo v-for="todo in todos" :todo="todo" :edited-todo="editedTodo" :index="$index"></todo>
        <todo v-for="todo in doneTodos" :todo="todo" :edited-todo="editedTodo" :index="$index"></todo>
      </ul>
      <div class="mask" v-show="editedTodo != null"></div>
    </div>
    <div class="notice" v-show="emptyTodos"> Pull down to create a todo </div>
    <div v-show="!editing" class="remain" v-on:click.self="tapToAdd"></div>
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
    };
  },
  methods: {
    pullDown(e) {
      if (this.editing) {
        return;
      }
      let pullDownY = e.deltaY;
      pullDownY = Math.min(45, pullDownY);
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
    background-color: rgba(0, 0, 0, 0.7);
    .remain {
      height: 100%;
    }
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
    // min-height: 50px;
  }

  ul {
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
    background-color: rgba(0, 0, 0, 0.7);
  }

</style>
