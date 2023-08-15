<template>
  <div class="content">
    <div class="row">
      <div class="col-md-8">
        <edit-profile-form :model="model"> </edit-profile-form>
      </div>
      <div class="col-md-4">
        <user-card :user="user"></user-card>
      </div>
    </div>
  </div>
</template>
<script>
import EditProfileForm from "./Profile/EditProfileForm.vue";
import UserCard from "./Profile/UserCard.vue";

export default {
  watch: {
  },
  components: {
    EditProfileForm,
    UserCard,
  },
  data() {
    return {
      model: {
        id: 0,
        email: "mike@email.com",
        username: "michael23",
        fullName: "Mike Andrew",
        address: "Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09",
        telephone: "0139234324",
        birthday: "23-08-2005"
      },
      user: {
        fullName: "Mike Andrew",
        email: "Ceo/Co-Founder",
      },
      config: {
        headers: {
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
        },
      },
    };
  },
  created() {
    this.getUserDetail();
  },
  methods: {
    getUserDetail() {
      this.axios.get('/api/auth/detail', this.config)
        .then(response => {
          this.model.id = response.data.id;
          this.model.email = response.data.email;
          this.model.username = response.data.username;
          this.model.fullName = response.data.fullName;
          this.model.address = response.data.address;
          this.model.telephone = response.data.telephone;
          this.model.birthday = response.data.birthday;

          this.user.fullName = response.data.fullName;
          this.user.email = response.data.email;
        })
        .catch(function (error) {
          store.dispatch('auth/logout');
          location.reload();
        });
    }
  },
};
</script>
<style></style>
