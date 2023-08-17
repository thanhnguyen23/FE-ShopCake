<template>
  <card>
    <template slot="header">
      <h5 class="title">Edit Profile</h5>
    </template>
    <div class="row">
      <div class="col-md-3 pr-md-1 text-left">
        <base-input
          label="Username"
          placeholder="mike"
          v-model="model.username"
          disabled
        >
        </base-input>
      </div>
      <div class="col-md-4 pl-md-1 text-left">
        <base-input
          label="Email address"
          type="email"
          placeholder="mike@email.com"
          v-model="model.email"
        >
        </base-input>
      </div>

      <div class="col-md-5 pr-md-1 text-left">
          <base-input
            label="Full Name"
            v-model="model.fullName"
            placeholder="mike andew"
          >
          </base-input>
        </div>
    </div>

    <div class="row">
      <div class="col-md-3 pr-md-1 text-left">
          <base-input
            label="Telephone"
            placeholder="0123456789"
            v-model="model.telephone"
          >
          </base-input>
        </div>
        <div class="col-md-4 pl-md-1 text-left">
          <base-input
            label="Birthday"
            type="date"
            placeholder="23-08-2005"
            v-model="model.birthday"
          >
          </base-input>
        </div>

      <div class="col-md-5 pr-md-1 text-left">
        <base-input
          label="Address"
          v-model="model.address"
          placeholder="Home Address"
        >
        </base-input>
      </div>
    </div>

    <template slot="footer">
      <base-button type="success" fill @click="editProfileUser()">Save</base-button>
    </template>
  </card>
</template>
<script>
import { Card, BaseInput } from "@/components/index";

import BaseButton from "@/components/BaseButton";
import NotificationTemplate from "../Notifications/NotificationTemplate";
import store from '../../store/index.js';
import moment from 'moment';

export default {
  components: {
    Card,
    BaseInput,
    BaseButton,
  },
  props: {
    model: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      config: {
        headers: {
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
        },
      },
    }
  },
  methods: {
    editProfileUser() {
      this.model.birthday = moment(this.model.birthday).format('DD-MM-YYYY');
      this.axios.post('/api/auth/update', this.model, this.config)
        .then(response => {
          this.notifyVue('success', 'Update user success');
          location.reload();
        })
        .catch(function (error) {
          store.dispatch('auth/logout');
          location.reload();
        });
    },
    notifyVue(color, message) {
      this.$notify({
        component: NotificationTemplate,
        icon: "tim-icons icon-bell-55",
        horizontalAlign: 'top',
        verticalAlign: 'right',
        type: color,
        timeout: 3000,
        message: message,
      });
    },
  },
};
</script>
<style></style>
