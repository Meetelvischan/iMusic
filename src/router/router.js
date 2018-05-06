import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '../components/HelloWorld';
import NextVue from '../components/NextVue';
import User from '../components/User';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
      path: '/next',
      name: 'NextVue',
      component: NextVue,
    },
    {
      path: '/user/:username',
      name: 'User',
      component: User,
      meta: {
        login_required: true,
      },
    },
  ],
});
