<template>
  <div id="app">
    <b-container fluid="md">
      <Navigation :user="user" @toggle-email-setting="toggleEmailSetting">
      </Navigation>
      <ErrorMessage
        v-if="!validSubreddit"
        :errorMessage="errorMessage"
      ></ErrorMessage>
      <Subreddits
        :subreddits="subredditsNew"
        :topicsList="topicsListNew"
        :user="user"
        :selectedTopicPosition="selectedTopicPosition"
        @add-subreddit="updateSubreddits"
        @remove-subreddit="deleteSubreddits"
        @focus-topic="focusTopic"
        @change-topic-name="changeTopicName"
        @add-new-topic="addNewTopicToTopicsList"
        @delete-topic="removeTopicFromTopicsList"
      ></Subreddits>
      <SuggestedSubreddits
        :topicsList="topicsListNew"
        :selectedTopicPosition="selectedTopicPosition"
        @add-subreddit="updateSubreddits"
        :subreddits="subredditsNew"
      >
      </SuggestedSubreddits>

      <Posts :subreddits="subredditsNew"></Posts>
    </b-container>
  </div>
</template>

<script>
import Navigation from "./components/Navigation.vue";
import ErrorMessage from "./components/ErrorMessage.vue";
import Subreddits from "./components/Subreddits.vue";
import SuggestedSubreddits from "./components/SuggestedSubreddits.vue";
import Posts from "./components/Posts.vue";
import { subredditCollection } from "./firebaseConfig";
import { userSettingsCollection } from "./firebaseConfig";
import { firebaseLogin } from "./firebaseConfig.js";
import Vue from "vue";

export default {
  name: "App",
  components: {
    Posts,
    Subreddits,
    Navigation,
    ErrorMessage,
    SuggestedSubreddits,
  },
  mounted: async function() {
    //console.log("component mounted");

    this.user.id =
      JSON.parse(localStorage.getItem("userID")) || this.generateUserID();
    localStorage.setItem("userID", JSON.stringify(this.user.id));
    //console.log(this.user.id);

    await subredditCollection
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          this.subredditsDBCopy.push(doc.data());
          // console.log(doc.id, " => ", doc.data());
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });

    //console.log(this.subreddits);

    if (this.subredditsNew.length === 0) {
      this.topicsListNew.push("General");
      this.selectedTopicPosition = 0; //when new topic is added, it becomes the topic in focus
      this.updateSubreddits("askreddit");
    }

    //console.log(this.subreddits);
    //console.log(this.subredditsDBCopy);

    firebaseLogin.auth.onAuthStateChanged((user) => {
      // how is this getting set such that this callback function is called for each state change?
      //console.log("user state change");
      if (user) {
        this.user.loggedIn = true;
        this.user.data = user;

        //console.log(this.user.data);

        const filteredArray = this.subredditsDBCopy.filter(
          (entry) => entry.googleID === this.user.data.uid
        );
        console.log(filteredArray);
        //check if a record exists with that Google ID
        if (filteredArray.length === 0) {
          console.log(this.subredditsFiltered);
          this.subredditsDBCopy
            .filter((entry) => entry.userID === this.user.id)
            .forEach((entry) =>
              subredditCollection
                .doc(entry.id)
                .update({ googleID: this.user.data.uid })
            );
          console.log("no existing entry exists with this Google ID");
        }
      } else {
        this.user.loggedIn = false;
        this.user.data = {};
        //console.log("logged out");
      }
      console.log(this.subreddits);
    });
  },
  data() {
    return {
      subreddits: [{ text: "askreddit" }],
      subredditsDBCopy: [],
      user: {
        loggedIn: false,
        data: {},
        id: "",
        emailSub: false,
      },
      selectedTopicPosition: 0,
      topicsList: ["General"],
      validSubreddit: true,
      errorMessage: "",
    };
  },
  computed: {
    subredditsFiltered() {
      if (this.user.loggedIn) {
        return this.subredditsDBCopy.filter(
          (entry) => entry.googleID === this.user.data.uid
        );
      } else {
        return this.subredditsDBCopy.filter(
          (entry) => entry.userID === this.user.id
        );
      }
    },
    topicsListNew() {
      const x = [];
      this.subredditsFiltered.forEach((entry) => {
        x[entry.topicPosition] = entry.topic;
      });
      return x;
    },
    subredditsNew() {
      return this.subredditsFiltered.filter(
        (entry) => entry.topicPosition === this.selectedTopicPosition
      );
    },
  },
  watch: {},
  firestore() {
    //console.log("firestore triggered");
    return {
      subredditsDBCopy: subredditCollection.orderBy("createdAt", "desc"),
      //
      // to be added - get rid of this and make appropriate calls to the DB when necessary
    };
  },
  methods: {
    async updateSubreddits(newSub) {
      await this.checkIfValidSubreddit(newSub); //not sure why this await is needed here, is the await within checkIfValidSubreddit unncessary?
      const duplicateCheck = this.subredditsNew.findIndex(
        (entry) => entry.text === newSub
      );
      if (duplicateCheck >= 0) {
        this.errorMessage = `'${newSub}' subreddit already exists`;
        this.validSubreddit = false;
      } else if (this.validSubreddit) {
        const entry = {
          text: newSub,
          createdAt: new Date(),
          userID: this.user.id,
          topic: this.topicsListNew[this.selectedTopicPosition],
          topicPosition: this.selectedTopicPosition,
        };
        if (this.user.loggedIn) {
          entry.googleID = this.user.data.uid;
        }

        await subredditCollection
          .add(entry)
          .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
          });
        //console.log(this.subredditsDBCopy);

        const nullIndex = this.subredditsNew.findIndex(
          (entry) => entry.text === null
        );
        console.log(nullIndex);
        console.log(this.subredditsNew);
        if (newSub != null && nullIndex >= 0) {
          console.log("true");
          await subredditCollection
            .doc(this.subredditsNew[nullIndex].id)
            .delete();
        }
      }
    },
    async checkIfValidSubreddit(subbreditName) {
      this.errorMessage = "";
      this.validSubreddit = true;

      const axios = require("axios");
      await axios
        .get(`https://www.reddit.com/r/${subbreditName}/top.json`)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          this.errorMessage = "Error saving subreddit, please try again";
          this.validSubreddit = false;
          //console.log(error);

          console.log(error.response.status);
          if (error.response.status === 403)
            this.errorMessage = `'${subbreditName}' is a private subreddit, could not add it`;
          if (error.response.status === 404)
            this.errorMessage = `'${subbreditName}' subreddit does not exist`;
        });
    },
    async deleteSubreddits(sub) {
      if (this.subredditsNew.length === 1) {
        const newSelectedTopicPosition = 0;
        this.focusTopic(newSelectedTopicPosition);
      }

      await subredditCollection.doc(sub.id).delete();
      console.log("deleteting subreddit");
    },
    generateUserID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    focusTopic(newPosition) {
      this.selectedTopicPosition = newPosition;
    },
    changeTopicName(newName, position) {
      //this.topicsList[position] = newName;
      Vue.set(this.topicsListNew, position, newName);
      //important point to note - value changes to array are not detected automatically, only methods like pop, push, splice, etc. are. Vue.set circumvents that
      // to be added - name change needs to be reflected in the DB
      this.focusTopic(position);
      this.subredditsNew.forEach((entry) =>
        subredditCollection.doc(entry.id).update({ topic: newName })
      );
      ///////// change this to subredditsFiltered you're not dependent on this.subreddits
    },
    addNewTopicToTopicsList(newTopic) {
      console.log("new topic getting added in App" + newTopic);
      this.topicsListNew.push(newTopic);
      this.selectedTopicPosition = this.topicsListNew.length - 1; //when new topic is added, it becomes the topic in focus
      this.updateSubreddits(null);
      console.log(this.topicsListNew);
    },
    /*
    filterRelevantSubreddits(position) {
      //this can go completely
      if (this.user.loggedIn) {
        this.subreddits = this.subredditsDBCopy.filter(
          (entry) =>
            entry.googleID === this.user.data.uid &&
            entry.topicPosition === position
        );
      } else {
        this.subreddits = this.subredditsDBCopy.filter(
          (entry) =>
            entry.userID === this.user.id && entry.topicPosition === position
        );
      }
    },
    */
    //to be addeed - should there be two different functions? one that filters for user id & one that filters for topics. Topic one can be used during topic focus and topic addition
    removeTopicFromTopicsList() {
      this.subredditsNew.forEach((entry) =>
        subredditCollection.doc(entry.id).delete()
      );
      //this.topicsListNew.splice(position, 1);
      const newSelectedTopicPosition = 0; //can add some logic here later to roll to next topic
      //this.filterRelevantSubreddits(newSelectedTopicPosition);
      this.focusTopic(newSelectedTopicPosition);
    },
    async toggleEmailSetting() {
      this.user.emailSub = !this.user.emailSub;
      console.log(this.user.data);
      await userSettingsCollection
        .doc(this.user.data.uid)
        .set({
          emailSetting: this.user.emailSub,
          userID: this.user.id,
          googleID: this.user.data.uid,
          email: this.user.data.email,
        })
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch(function(error) {
          console.error("Error: ", error);
        });
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
#app {
  font-family: "Roboto", sans-serif;
  /*max-width: 700px;
  margin: auto;
  */
}
/*  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;*/
</style>
