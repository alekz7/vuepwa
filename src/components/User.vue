<template>
  <div>
    <h1>User Info</h1>
    <ul>
      <li>
        <img :src="userData.avatar_url" id="avatar" />
      </li>
      <li>username: {{ userData.login }}</li>
      <li>followers: {{ userData.followers }}</li>
      <li>plan: {{ userData.plan && userData.plan.name }}</li>
    </ul>
  </div>
</template>

<script>
import { octokitMixin } from "../mixins/octokitMixin";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "User",
  data() {
    return {
      userData: {},
    };
  },
  mixins: [octokitMixin],
  async mounted() {
    const octokit = this.createOctokitClient();
    const { data: userData } = await octokit.request("/users/alekz7");
    this.userData = userData;
  },
  methods: {
    saveToken() {},
  },
};
</script>

<style scoped>
#avatar {
  width: 50px;
  height: 50px;
}
</style>
