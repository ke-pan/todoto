<template>
  <div id="app" v-touch:panmove="pullDown" v-touch:panend="pullToAdd">
    <div class="mask" v-show="editedTodo != null"></div>
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
    </div>
    <div class="remain" v-on:click.self="tapToAdd"></div>
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
