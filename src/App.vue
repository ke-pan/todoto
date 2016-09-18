<template>
  <div id="app">
    <ul class="todo-list">
      <todo v-for="todo in todos" :todo="todo" :edited-todo="editedTodo"></todo>
    </ul>
    <div class="remain" v-on:click.self="addTodo"></div>
    <div class="mask" v-show="editedTodo != null">
    </div>
  </div>
</template>

<script>
import Todo from 'components/todo.vue';
export default {
  data() {
    return {
      todos: [],
      editedTodo: null,
    };
  },
  methods: {
    addTodo() {
      const todo = {
        text: 'new todo',
        done: false,
        position: this.todos.length,
      }
      this.todos.push(todo);
      this.editedTodo = todo;
    },
    removeTodo(todo) {
      this.todos.$remove(todo);
    },
  },
  events: {
    'edit-todo': function (todo) {
      this.editedTodo = todo;
    },
    'done-edit': function (todo) {
      if (!this.editedTodo) {
        return;
      }
      this.editedTodo = null;
      todo.text = todo.text.trim();
      if (!todo.text) {
        this.removeTodo(todo);
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
    margin: 0;
    padding: 0;
    height: 100%;
    .remain {
      height: 100%;
    }
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
    background-color: black;
    opacity: 0.7;
  }

</style>
