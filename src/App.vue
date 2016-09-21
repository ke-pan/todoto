<template>
  <div id="app" v-touch:panmove="pullDown" v-touch:panend="pullToAdd">
    <div class="container" v-bind:style="{top: pullHeight}">
      <div class="pull-down" style="background-color: rgb(220, 0, 30);" v-bind:style="{transform: pullRotate}">
        <div class="wrapper">
          pull to create a todo item
        </div>
      </div>
      <ul class="todo-list">
        <todo v-for="todo in unDoneTodos" :todo="todo" :edited-todo="editedTodo"></todo>
        <todo v-for="todo in doneTodos" :todo="todo" :edited-todo="editedTodo"></todo>
      </ul>
      <div class="remain" v-on:click.self="addTodo"></div>
      <div class="mask" v-show="editedTodo != null">
    </div>
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
      pullDownY: 0,
    };
  },
  methods: {
    pullDown(e) {
      let pullDownY = e.deltaY;
      pullDownY = Math.min(45, pullDownY);
      pullDownY = Math.max(0, pullDownY);
      this.pullDownY = pullDownY;
    },
    pullToAdd() {
      if (this.pullDownY > 40) {
        this.addTodo();
      }
      this.pullDownY = 0;
    },
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
  computed: {
    doneTodos() {
      return this.todos.filter(todo => todo.done);
    },
    unDoneTodos() {
      return this.todos.filter(todo => !todo.done);
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
    'remove-todo': function (todo) {
      this.removeTodo(todo);
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
    .remain {
      height: 100%;
    }
  }

  .container {
    position: absolute;
    width: 100%;
    perspective: 400px;
  }

  .pull-down {
    transform-origin: bottom;
    // transform: rotateX(45deg);
    // transition-duration: 1s;
    // transition-property: all;
  }

  .wrapper {
    border: 1px solid red;
    padding: 0.2em 0.5em;
    font-size: 1.5em;
    line-height: 1.4;
    color: white;
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
