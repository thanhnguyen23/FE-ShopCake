import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import Icons from "@/pages/Icons.vue";
import Maps from "@/pages/Maps.vue";
import Notifications from "@/pages/Notifications.vue";
import UserProfile from "@/pages/UserProfile.vue";
import TableList from "@/pages/TableList.vue";
import Typography from "@/pages/Typography.vue";
import UpgradeToPRO from "@/pages/UpgradeToPRO.vue";
import Product from "@/pages/TableListData/product.vue";
import Order from "@/pages/TableListData/order.vue";
import Category from "@/pages/TableListData/category.vue";
import Promotions from "@/pages/TableListData/promotions.vue";
import Login from "@/pages/login.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    component: DashboardLayout,
    redirect: "dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "icons",
        name: "Icons",
        component: Icons,
      },
      {
        path: "maps",
        name: "Maps",
        component: Maps,
      },
      {
        path: "notifications",
        name: "Notifications",
        component: Notifications,
      },
      {
        path: "user",
        name: "User Profile",
        component: UserProfile,
      },
      {
        path: "table",
        name: "Table List",
        component: TableList,
      },
      {
        path: "typography",
        name: "Typography",
        component: Typography,
      },
      {
        path: "upgradeToPro",
        name: "Upgrade to PRO",
        component: UpgradeToPRO,
      },
      {
        path: "product",
        name: "Manager Product",
        component: Product,
      },
      {
        path: "order",
        name: "Manager Order",
        component: Order,
      },
      {
        path: "category",
        name: "Manager Category",
        component: Category,
      },
      {
        path: "promotions",
        name: "Manager Promotions",
        component: Promotions,
      },
    ],
  },
];

export default routes;
