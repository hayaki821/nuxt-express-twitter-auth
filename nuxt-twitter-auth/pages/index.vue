<template>
  <div>
    <p v-if="attempting">Twitterでログインしています。</p>

    <p v-else>Twitterでのログインに失敗しました。</p>
    <p>{{ error }}</p>
  </div>
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
    try {
      const callbackData = await axios(
        "http://127.0.0.1:3000/server/auth/twitter/callback",
        { params: this.$route.query }
      );
      console.log(callbackData);

      this.setUser({ user: callbackData.data.user });
      this.$cookies.set("token", callbackData.data.user, { expires: 30 });
      //redirect({ name: "home" });
      this.$router.push("home");
    } catch (error) {
      console.log(error);
      //redirect({ name: "login" });
      this.$router.push("login");
    }
    console.log(this.$route.query);
    //console.log(this.user);
  },
};
</script>