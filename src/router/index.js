import Vue from 'vue';
import VueRouter from 'vue-router';
import {
  PRODUCT_MANAGE, ORDER_MANAGE, EMPLOYEE_MANAGE, CUSTOMER_MANAGE,
  TRANSPORT_MANAGE, ADMIN_OVERVIEW, CHAT_MANAGE, EMPLOYEE_MANAGE_DETAIL,
  CUSTOMER_MANAGE_DETAIL, ORDER_MANAGE_DETAIL,
  PRODUCT_MANAGE_DETAIL, HOMEPAGE, ALL_PRODUCT, PRODUCT,
  SHOPCART, PAY, MY_ORDER, ORDER_DETAIL, ORDER_EVALUATION, MY_FAVORITE,
  USER_SETTING, PRODUCT_DETAIL,
} from './MUrl';

Vue.use(VueRouter);

const routes = [
  {
    path: HOMEPAGE,
    name: 'Homepage',
    component: () => import('../user/Homepage'),
  },
  {
    path: ALL_PRODUCT,
    name: 'AllProduct',
    component: () => import('../user/AllProduct'),
  },
  {
    path: SHOPCART,
    name: 'Shopcart',
    component: () => import('../user/Shopcart'),
  },
  {
    path: `${PRODUCT}/:proId`,
    name: 'Product',
    component: () => import('../user/Product'),
  },
  {
    path: `${PRODUCT_DETAIL}/:proId`,
    name: 'ProductDetail',
    component: () => import('../user/ProductDetail'),
  },
  {
    path: `${PAY}/:orderId`,
    name: 'Pay',
    component: () => import('../user/Pay'),
  },
  {
    path: MY_ORDER,
    name: 'MyOrder',
    component: () => import('../user/MyOrder'),
  },
  {
    path: MY_FAVORITE,
    name: 'MyFavorite',
    component: () => import('../user/MyFavorite'),
  },
  {
    path: `${ORDER_DETAIL}/:orderId`,
    name: 'OrderDetail',
    component: () => import('../user/OrderDetail'),
  },
  {
    path: `${ORDER_EVALUATION}/:orderId`,
    name: 'OrderEvaluation',
    component: () => import('../user/OrderEvaluation'),
  },
  {
    path: USER_SETTING,
    name: 'UserSetting',
    component: () => import('../user/UserSetting'),
  },
  {
    path: ADMIN_OVERVIEW,
    name: 'Overview',
    component: () => import('../admin/Overview'),
  },
  {
    path: PRODUCT_MANAGE,
    name: 'ProductManage',
    component: () => import('../admin/ProductManage'),
  },
  {
    path: `${PRODUCT_MANAGE_DETAIL}/:proId`,
    name: 'ProductManageDetail',
    component: () => import('../admin/ProductManageDetail'),
  },
  {
    path: ORDER_MANAGE,
    name: 'OrderManage',
    component: () => import('../admin/OrderManage'),
  },
  {
    path: `${ORDER_MANAGE_DETAIL}/:orderId`,
    name: 'OrderManageDetail',
    component: () => import('../admin/OrderManageDetail'),
  },
  {
    path: EMPLOYEE_MANAGE,
    name: 'EmployeeManage',
    component: () => import('../admin/EmployeeManage'),
  },
  {
    path: `${EMPLOYEE_MANAGE_DETAIL}/:userId`,
    name: 'EmployeeManageDetail',
    component: () => import('../admin/EmployeeManageDetail'),
  },
  {
    path: CUSTOMER_MANAGE,
    name: 'CustomerManage',
    component: () => import('../admin/CustomerManage'),
  },
  {
    path: `${CUSTOMER_MANAGE_DETAIL}/:userName`,
    name: 'CustomerManageDetail',
    component: () => import('../admin/CustomerManageDetail'),
  },
  {
    path: TRANSPORT_MANAGE,
    name: 'TransportManage',
    component: () => import('../admin/TransportManage'),
  },
  {
    path: CHAT_MANAGE,
    name: 'ChatManage',
    component: () => import('../admin/ChatManage'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
