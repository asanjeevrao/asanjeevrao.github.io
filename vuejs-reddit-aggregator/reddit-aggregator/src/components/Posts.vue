<template>
  <div class="posts-component">
    <div class="posts-menu">
      <div id="posts-heading">
        <h5 id="posts-heading-name">Posts</h5>
        <b-icon
          id="info-icon"
          icon="info-circle"
          font-scale="1"
          v-b-popover.hover.top="
            'Sorted by relative engagement based on subscriber count'
          "
        />
      </div>
      <div class="dropdown">
        <b-dropdown
          size="sm"
          v-bind:text="timeRange"
          id="dropdown-timerange"
          variant="light"
        >
          <b-dropdown-item
            @click="
              timeRange = 'Today';
              sortPosts();
            "
            >Today</b-dropdown-item
          >
          <b-dropdown-item
            @click="
              timeRange = 'This Week';
              sortPosts();
            "
            >This Week</b-dropdown-item
          >
          <b-dropdown-item
            @click="
              timeRange = 'This Month';
              sortPosts();
            "
            >This Month</b-dropdown-item
          >
        </b-dropdown>
      </div>
    </div>

    <ul class="posts-list">
      <b-card
        v-for="post in sortedPosts"
        v-bind:key="post.id"
        class="post"
        bg-variant="light"
        @click="openLink(post)"
      >
        <b-card-title id="post-title"
          >{{ post.data.title
          }}<b-badge variant="warning" class="subreddit-badge">
            {{ post.data.subreddit }}
          </b-badge>
        </b-card-title>
        <b-card-text class="upvotes-comments">
          <b-icon-arrow-up class="" font-scale="1.2"> </b-icon-arrow-up>
          {{ post.data.ups }} Upvotes
          <span style="padding-left: 0.8em">
            <b-icon-chat class="" font-scale="1.1"> </b-icon-chat>

            {{ post.data.num_comments }} Comments</span
          >
        </b-card-text>
        <!--<h5>{{ post.data.subreddit }}</h5>-->
        <!--<a href = "" class = "stretched-link" onclick = "return false;"></a>-->
      </b-card>
    </ul>
    <div id="no-posts-message" v-cloak v-if="posts.length === 0">
      Add subreddits to start seeing top posts
    </div>
  </div>
</template>

<script>
//import { subredditCollection } from "../firebaseConfig";

export default {
  name: "HelloWorld",
  props: ["subreddits", "formatNumberToThousands"],
  data() {
    return {
      posts: [],
      timeRange: "Today",
      postSearch: "",
      sortedPosts: [],
    };
  },
  watch: {
    subreddits: function() {
      //console.log("subreddits changed");
      this.fetchPosts();
    },
    posts: function() {
      this.sortedPosts = [...this.posts];
      this.sortedPosts.sort(
        (postA, postB) =>
          postB.data.ups / postB.data.subreddit_subscribers -
          postA.data.ups / postA.data.subreddit_subscribers
      );
      this.formatNumber();
    },
  },
  mounted() {
    //if (localStorage.subreddits)
    //this.subreddits = JSON.parse(localStorage.getItem("subreddits"));
    this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      this.posts = [];
      let time;
      if (this.timeRange === "Today") time = "day";
      else if (this.timeRange === "Today") time = "week";
      else time = "month";
      const axios = require("axios");
      this.subreddits.forEach((subreddit) => {
        axios
          .get(`https://www.reddit.com/r/${subreddit.text}/top.json?t=${time}`)
          .then((response) => {
            response.data.data.children.forEach((post) => {
              this.posts.push(post);
            });
          })
          .catch(function(error) {
            console.error(
              "Error reading subreddit: ",
              `${subreddit.text} `,
              error
            );
          });
      });
      this.posts.forEach((post) => {
        console.log(post.data.ups / post.data.subreddit_subscribers);
      });
      console.log("check");
    },
    sortPosts() {
      console.log("time changed");
      this.fetchPosts();
    },

    openLink(post) {
      window.open(
        `https://www.reddit.com/r/${post.data.subreddit}/comments/${post.data.id}`
      );
    },
    formatNumber() {
      this.sortedPosts.forEach((post) => {
        post.data.ups = this.formatNumber2(post.data.ups);
        post.data.num_comments = this.formatNumber2(post.data.num_comments);
      });
    },
    formatNumber2(x) {
      if (x > 999999) {
        return (x / 100000).toFixed(1) + "m";
      } else if (x > 999) {
        return (x / 1000).toFixed(0) + "k";
      } else return x;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}*/
.subreddit-badge {
  margin-left: 10px;
  background-color: #f4a261;
}

.post {
  padding-bottom: 0px;
  cursor: pointer;
  background-color: #f5f8fa !important;
}

#app .card-title {
  font-size: 1em;
}

#app .card {
  margin-bottom: 10px;
}

.posts-list {
  padding-inline-start: 0px;
}

.posts-menu {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.dropdown {
}

#dropdown-timerange button {
  background-color: #3a6b7e !important;
}

#dropdown-timerange::after {
  display: none;
}

.dropdown-item {
}

.posts-component {
  margin-top: 20px;
}

.upvotes-comments {
  font-size: 0.8em;
  color: #335f70;
}

[v-cloak] {
  display: none !important;
}

#no-posts-message {
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
  color: black;
  background-color: #fbdec6;
  text-align: center;
}

#posts-heading {
  display: flex;
  justify-content: left;
  align-items: center;
}

#info-icon {
  color: #3a6b7e !important;
  font-size: 0.8em;
  margin-left: 5px;
}

#post-title {
  font-weight: 400;
}

#posts-heading-name {
  margin-bottom: 0;
}
</style>
