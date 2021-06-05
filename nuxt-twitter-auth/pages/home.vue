<template>
  <section>
    <div>twitter user id: {{ User }}</div>
    <div>error: {{ error }}</div>
    <a href="http://127.0.0.1:3000/server/logout">logout</a>
  </section>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueCookies from "vue-cookies";
Vue.use(VueCookies);
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      error: null,
    };
  },

  computed: {
    attempting() {
      return !this.error;
    },
    User() {
      return this.$store.state.user; //ここでmapGettersを使う
    },
  },
  methods: mapMutations(["setToken", "setUser"]),

  async mounted() {
    if (!!this.User) return;

    // const token = this.$cookies.cookies.token || "token";
    // console.log(token);
    const user = axios.get("http://127.0.0.1:3000/server/user").then((res) => {
      console.log(res.data);
    });
  },
};
</script>