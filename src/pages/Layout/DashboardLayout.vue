<template>
  <div class="wrapper">
    <!-- <div class="wrapper" :class="{'nav-open': $sidebar.showSidebar}"> -->

    <side-bar :background-color="backgroundColor">
      <!-- <mobile-menu slot="content"></mobile-menu> -->

      <sidebar-link to="/dashboard">
        <i class="tim-icons icon-chart-pie-36"></i>

        <template v-if="!isRTL">
          <p>Dashboard</p>
        </template>

        <template v-else>
          <p>لوحة القيادة</p>
        </template>
      </sidebar-link>

      <sidebar-link to="/user">
        <i class="tim-icons icon-single-02"></i>

        <template v-if="!isRTL">
          <p>User Profile</p>
        </template>

        <template v-else>
          <p>ملف تعريفي للمستخدم</p>
        </template>
      </sidebar-link>

      <sidebar-link to="/product">
          <i class="tim-icons icon-bag-16"></i>

          <template v-if="!isRTL">
            <p>Manager Product</p>
          </template>
        </sidebar-link>

      <sidebar-link to="/order">
        <i class="tim-icons icon-cart"></i>

        <template v-if="!isRTL">
          <p>Manager Order</p>
        </template>
      </sidebar-link>

      <sidebar-link to="/category">
        <i class="tim-icons icon-bag-16"></i>

        <template v-if="!isRTL">
          <p>Manager Category</p>
        </template>
      </sidebar-link>
      <sidebar-link to="/promotions">
        <i class="tim-icons icon-bag-16"></i>

        <template v-if="!isRTL">
          <p>Manager Promotions</p>
        </template>
      </sidebar-link>
    </side-bar>

    <sidebar-share :background-color.sync="backgroundColor"></sidebar-share>

    <div class="main-panel" :data="backgroundColor">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar"></dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>

<style lang="scss"></style>

<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./DashboardContent.vue";
import SidebarShare from "./SidebarSharePlugin.vue";
import MobileMenu from "./MobileMenu.vue";
import SideBar from "@/components/SidebarPlugin/SideBar.vue";
import SidebarLink from "@/components/SidebarPlugin/SidebarLink.vue";

export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
    // eslint-disable-next-line vue/no-unused-components
    MobileMenu,
    SideBar,
    SidebarLink,
    SidebarShare,
  },
  data() {
    return {
      backgroundColor: "green",
    };
  },
  computed: {
    isRTL() {
      return this.$rtl.isRTL;
    },
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
};
</script>
