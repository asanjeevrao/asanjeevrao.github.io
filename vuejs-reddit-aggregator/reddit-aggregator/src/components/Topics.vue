<template>
  <div class="topic">
    <div v-if="isInFocus">
      <button
        active
        href="#"
        @click="focusTopic"
        class="selected-topic topic-button"
      >
        {{ topic }}
      </button>
      <div class="edit-and-delete">
        <p href="#" class="edit" @click="editName">
          Edit |
        </p>
        <div class="delete">
          <p href="#" v-b-modal.my-modal>
            Delete
          </p>
          <b-modal id="my-modal" @ok="deleteTopic">
            Are you sure you want to delete?
          </b-modal>
        </div>
      </div>
    </div>
    <div v-else>
      <button
        href="#"
        @click="focusTopic"
        class="not-selected-topic topic-button"
      >
        {{ topic }}
      </button>
    </div>
    <!--
    <div v-if="isInFocus">
      <b-nav-item active href="#" @click="focusTopic">
        {{ topic }}
      </b-nav-item>
      <div class="edit-and-delete">
        <b-nav-text href="#" class="edit" @click="editName">
          Edit |
        </b-nav-text>
        <div class="delete">
          <b-nav-text href="#" class="edit" v-b-modal.my-modal>
            Delete
          </b-nav-text>
          <b-modal id="my-modal" @ok="deleteTopic">
            Are you sure you want to delete?
          </b-modal>
        </div>
      </div>
    </div>
    <div v-else>
      <b-nav-item href="#" @click="focusTopic">
        {{ topic }}
      </b-nav-item>
    </div>
    -->
  </div>
</template>

<script>
//import { subredditCollection } from "../firebaseConfig";

export default {
  name: "HelloWorld",
  props: ["topic", "index", "isInFocus"],
  data() {
    return {};
  },
  watch: {},
  mounted() {
    console.log(this.topic);
    //on mount fetch Topic from DB/LS
  },
  computed: {},
  methods: {
    focusTopic() {
      this.$parent.$emit("focus-topic", this.index);
    },
    editName() {
      const newName = window.prompt("Edit Name", this.topic);
      this.$parent.$emit("change-topic-name", newName, this.index);

      //when this happens, all DB entries will need to be updated with new topic name
    },
    deleteTopic() {
      //const newName = window.prompt("Edit Name", this.topic);
      this.$parent.$emit("delete-topic", this.index);
      console.log(this.topic);
      //when this happens, all DB entries will need to be updated with new topic name
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.edit {
  font-size: 0.7em;
}

/*.topic {
}
*/

.edit-and-delete {
  width: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.delete {
  font-size: 0.7em;
  margin-left: 2px;
}

.topic {
}

.selected-topic {
  background-color: #3a6b7e;
  color: white;
  text-transform: capitalize;
  outline: none;
}

.selected-topic:focus {
  outline: none;
}
.topic-button {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.not-selected-topic:hover {
  color: #fff;
  background-color: #65a1b8;
  border-color: #65a1b8;
  text-transform: capitalize;
}

.not-selected-topic {
  background-color: #f1f6f9;
  border-color: #3a6b7e;
  color: black;
  text-transform: capitalize;
}
</style>
