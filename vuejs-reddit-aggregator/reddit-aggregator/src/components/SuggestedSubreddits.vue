<template>
  <div class="suggested-subreddits">
    <div
      v-b-toggle.collapse-1
      @click="toggleDisplay = !toggleDisplay"
      class="suggested-subreddit-header"
    >
      <h6>Suggested Subreddits</h6>
      <div id="chevron-icons">
        <b-icon
          v-show="!toggleDisplay"
          icon="chevron-compact-down"
          font-scale="1.5"
        >
        </b-icon>
        <b-icon
          v-show="toggleDisplay"
          icon="chevron-compact-up"
          font-scale="1.5"
        >
        </b-icon>
      </div>
    </div>

    <b-collapse :visible="toggleDisplay" id="collapse-1">
      <table class="suggested-subreddit-table">
        <tbody
          v-for="(subreddit, index) in suggestedSubredditList"
          v-bind:key="subreddit.id"
        >
          <tr
            class="table-row"
            v-if="
              index < subredditsToDisplay &&
                subreddit.data.subreddit_type === 'public'
            "
          >
            <td class="subreddit-names" @click="openSubreddit(subreddit)">
              <b-badge pill class="suggested-subreddit-tags"
                >{{ subreddit.data.display_name }}
              </b-badge>
              <div class="subscribers">
                {{ subreddit.data.subscribers }} Members
              </div>
            </td>

            <td class="subreddit-description-desktop">
              {{ subreddit.data.public_description }}
            </td>
            <td class="subreddit-description-mobile">
              {{ subreddit.data.public_description_mobile }}
            </td>
            <td>
              <p
                class="add-button"
                @click="addSuggestedSubreddit(subreddit, index)"
              >
                Add
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="see-more-div">
        <p primary id="see-more" @click="subredditsToDisplay += 5">
          SEE MORE
        </p>
      </div>
    </b-collapse>
  </div>
</template>

<script>
//import { subredditCollection } from "../firebaseConfig";

export default {
  name: "HelloWorld",
  components: {},
  props: ["topicsList", "selectedTopicPosition", "subreddits"],
  data() {
    return {
      suggestedSubredditList: [],
      newTopic: "",
      addTopicSelected: false,
      subredditsToDisplay: 5,
      toggleDisplay: true,
    };
  },
  mounted: async function() {
    this.fetchSuggestSubreddits();
  },
  watch: {
    selectedTopicPosition: function() {
      //console.log("subreddits changed");
      this.fetchSuggestSubreddits();
    },
    subreddits: function() {
      this.toggleDisplay = this.subreddits.length >= 3 ? false : true;
    },
  },

  //
  //add watcher for user state change - when changes to logged in or logged out, then sync LS & DB
  methods: {
    async fetchSuggestSubreddits() {
      this.suggestedSubredditList = [];
      this.subredditsToDisplay = 5;
      this.toggleDisplay = this.subreddits.length >= 3 ? false : true;
      const axios = require("axios");
      let tempArray = [];
      console.log(this.topicsList[this.selectedTopicPosition]);
      const searchTerm =
        this.topicsList[this.selectedTopicPosition] === "General" ||
        !this.topicsList[this.selectedTopicPosition]
          ? "subreddits"
          : this.topicsList[this.selectedTopicPosition];
      console.log(searchTerm);
      await axios
        .get(
          `https://www.reddit.com/search.json?q=${searchTerm}&type=sr%2Cuser`
        )
        .then((response) => {
          console.log(response.data.data.children);
          tempArray = response.data.data.children;
        })

        .catch(function(error) {
          console.error(
            "Error searching for suggested subreddits ",

            error
          );
        });
      // remove existing subreddits from suggested subreddits list

      //array with existing subreddits
      const subredditsNameArray = this.subreddits.map(
        (subreddit) => subreddit.text
      );
      //console.log(subredditsNameArray);
      this.suggestedSubredditList = tempArray.filter(
        (suggestedSub) =>
          subredditsNameArray.indexOf(suggestedSub.data.display_name) < 0
      );

      this.suggestedSubredditList.forEach(
        (suggestedSub) =>
          (suggestedSub.data.public_description_mobile =
            suggestedSub.data.public_description.length > 50
              ? suggestedSub.data.public_description.substring(0, 50) + "..."
              : suggestedSub.data.public_description)
      );

      this.formatNumberToThousands();
    },
    addSuggestedSubreddit(suggestedSub, index) {
      this.$emit("add-subreddit", suggestedSub.data.display_name);
      this.suggestedSubredditList.splice(index, 1);
    },
    formatNumberToThousands() {
      this.suggestedSubredditList.forEach((subreddit) => {
        if (subreddit.data.subscribers > 999999)
          subreddit.data.subscribers =
            (subreddit.data.subscribers / 100000).toFixed(1) + "m";
        else if (subreddit.data.subscribers > 999)
          subreddit.data.subscribers =
            (subreddit.data.subscribers / 1000).toFixed(0) + "k";
      });
    },
    openSubreddit(subreddit) {
      window.open(`https://www.reddit.com${subreddit.data.url}`);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.suggested-subreddits {
  margin-top: 20px;
  background-color: #f1f6f9;
  padding: 15px;
  /*border: 0.1px solid transparent;
  border-color: #3a6b7e;*/
}

.suggested-subreddit-header {
  display: flex;
  align-items: center;
}

.suggested-subreddit-header:focus {
  outline: none;
}

.subreddit-search {
  margin-top: 0px;
  max-width: 200px;
  margin-top: 10px;
}

.add-button {
  font-weight: 500;
  font-size: 1em;
  color: #3a6b7e;
  cursor: pointer;
}

.plus-icon {
  margin-left: 0px;
  margin-top: 7px;
  cursor: pointer;
}

.suggested-subreddit-table {
  table-layout: fixed;
  border-spacing: 10px 10px;
  border-collapse: separate;
  margin-left: -15px;
}

.subscribers {
  font-size: 0.8em;
  color: #7d7676;
  padding-top: 5px;
  padding-left: 6px;
}
.subreddit-description-desktop {
  font-size: 0.85em;
  color: #7d7676;
  display: none;
}

.subreddit-description-mobile {
  font-size: 0.85em;
  color: #7d7676;
}

.subreddit-names {
  text-align: left;
  cursor: pointer;
}

#see-more {
  font-weight: 500;
  color: #3a6b7e;
  cursor: pointer;
}

.see-more-div {
  display: flex;
  justify-content: center;
}

.suggested-subreddit-tags {
  font-size: 0.9em;
  background-color: #fbdec6;
  color: black;
  padding: 6px;
}

#chevron-icons {
  margin-left: 10px;
  color: #3a6b7e;
}

h6 {
  margin-bottom: 0;
}

.table-row {
  padding-top: 50px;
}

@media only screen and (min-width: 600px) {
  .subreddit-description-mobile {
    display: none;
  }

  .subreddit-description-desktop {
    display: inline;
  }

  .suggested-subreddit-table {
    margin-left: 0px;
  }
}
</style>
