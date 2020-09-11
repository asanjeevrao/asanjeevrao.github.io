<template>
  <div class="hello">
    <!--
    <b-nav tabs fill variant="warning" class="topics-list-nav">
      <Topics
        class="topic-with-edit"
        v-for="(topic, index) in topicsList"
        v-bind:key="topic.id"
        :topic="topic"
        :index="index"
        :isInFocus="selectedTopicPosition === index"
      ></Topics>

      <b-nav-form>
        <b-form-input
          size="sm"
          class="mr-sm-2"
          placeholder="New Topic"
          v-model="newTopic"
        ></b-form-input>
        <b-button
          size="sm"
          class="my-2 my-sm-0"
          type="submit"
          @click.prevent="addNewTopic"
          >Add</b-button
        >
      </b-nav-form>
    </b-nav>
    -->

    <div class="topics-list-buttons">
      <div class="topics">
        <Topics
          class="topic-with-edit"
          v-for="(topic, index) in topicsList"
          v-bind:key="topic.id"
          :topic="topic"
          :index="index"
          :isInFocus="selectedTopicPosition === index"
        ></Topics>
      </div>
      <b-icon
        v-show="!addTopicSelected"
        class="plus-icon"
        icon="plus-circle"
        font-scale="1.5"
        @click="clickAddTopicIcon"
      >
      </b-icon>
      <div class="topic-form" v-show="addTopicSelected">
        <b-form-input
          ref="topicInput"
          class="form-control topic-form-input"
          placeholder="Add new topic..."
          v-model="newTopic"
          v-on:keyup.enter="addNewTopic"
          v-on:blur="handleBlur"
        />
        <!--
          <b-button
            size="sm"
            class="my-2 my-sm-0"
            type="submit"
            @click.prevent="addNewTopic"
            >Add</b-button
          >
          -->
      </div>
    </div>
    <div class="subreddit-section">
      <div class="subreddit-list">
        <b-badge
          pill
          v-for="subreddit in subreddits"
          v-bind:key="subreddit.id"
          variant="warning"
          id="subreddit-tags"
          ><span class="subreddit-text" v-if="subreddit.text">
            {{ subreddit.text }}
            <button class="close" v-on:click="removeSubreddit(subreddit)">
              x
            </button></span
          >
        </b-badge>
      </div>
      <b-form-input
        ref="subredditInput"
        type="text"
        placeholder="Add subreddits..."
        v-model="search"
        v-on:keyup.enter="addSubreddit"
        class="subreddit-search"
      />
    </div>
    <!--
    <input
      type="text"
      placeholder="Search for post title"
      v-model="postSearch"
      v-on:keyup="filterPosts"
    />
    -->
  </div>
</template>

<script>
//import { subredditCollection } from "../firebaseConfig";
import Topics from "./Topics.vue";

export default {
  name: "HelloWorld",
  components: {
    Topics,
  },
  props: ["subreddits", "topicsList", "selectedTopicPosition"],
  data() {
    return {
      search: "",
      newTopic: "",
      addTopicSelected: false,
    };
  },
  //
  //add watcher for user state change - when changes to logged in or logged out, then sync LS & DB
  methods: {
    async addSubreddit() {
      //console.log(this.subreddits);
      this.$emit("add-subreddit", this.search);
      this.search = "";
    },
    removeSubreddit(subreddit) {
      //this.subreddits.splice(this.subreddits.indexOf(subredditName), 1);
      //localStorage.setItem("subreddits", JSON.stringify(this.subreddits));
      //console.log(subreddit);
      console.log("delete started");
      this.$emit("remove-subreddit", subreddit);
      console.log(this.subreddits);

      //subredditCollection.doc(subreddit.id).delete();

      //this.fetchPosts();
    },
    addNewTopic() {
      console.log("add new topic method start");
      if (this.newTopic === "") return;
      console.log("add new topic - " + this.newTopic);
      this.$emit("add-new-topic", this.newTopic);

      this.newTopic = "";
      this.addTopicSelected = false;
      this.$refs.subredditInput.focus();
      console.log("end of method");
    },
    clickAddTopicIcon() {
      this.addTopicSelected = true;
      //console.log(this.$refs.topicInput);
      this.$nextTick(() => {
        this.$refs["topicInput"].focus();
      });
    },
    handleBlur() {
      this.addTopicSelected = false;
      console.log("out of focus");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.subreddit-search {
  margin-top: 0px;
  max-width: 200px;
  margin-top: 10px;
}

.subreddit-list {
  display: inline-block;
}

#subreddit-tags {
  font-size: 0.85em;
  padding-top: 6px;
  padding-bottom: 6px;
  padding-right: 0;
  text-transform: capitalize;
  margin-right: 6px;
  display: inline-block;
  background-color: #f4a261;
  margin-top: 10px;
}

#subreddit-tags:empty {
  display: none;
}

.subreddit-text {
  font-weight: 700;
}

.topic-with-edit {
  margin-right: 15px;
}

.topics-list-nav {
  display: flex;
  justify-content: space-between;
  border-style: solid;
  border-color: black;
  border-width: 1px;
}

.topics-list-buttons {
  display: flex;
}

.topics {
  display: flex;
}

.topic-form {
  margin-left: 10px;
  width: 250px;
  height: 36px;
}

.topic-form-input {
}

.hello {
  margin-top: 15px;
}

.subreddit-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: -10px;
}

.plus-icon {
  margin-left: 0px;
  margin-top: 7px;
  cursor: pointer;
  color: #3a6b7e !important;
}
</style>

<style scoped>
.close {
  margin-left: 5px;
  margin-right: 5px;
  font-size: inherit;
  color: inherit;
  text-shadow: none;
  display: inline-block;
}
</style>
