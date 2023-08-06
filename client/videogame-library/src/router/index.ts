import PocetnaView from '@/views/PocetnaView.vue'
import PrijavaView from '@/views/PrijavaView.vue'
import ProfilView  from '@/views/ProfilView.vue'
import AdminView  from '@/views/AdminView.vue'
import IstraziView  from '@/views/IstraziView.vue'
import IzdavaciView  from '@/views/IzdavaciView.vue'
import IzdavacView  from '@/views/IzdavacView.vue'
import IgraRAWGView  from '@/views/IgraRAWGView.vue'
import ModeratorView  from '@/views/ModeratorView.vue'
import FavoritiView  from '@/views/FavoritiView.vue'
import RecenzijeIgaraView  from '@/views/RecenzijeIgaraView.vue'
import Odjava from '@/components/Odjava.vue'
import { createRouter, createWebHistory } from 'vue-router'

import { isLoggedIn, returnUserType } from '@/services/auth';

import 'vue-router'

export {}

declare module 'vue-router' {
  interface RouteMeta {
    userType?: number
    requiresAuth: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'pocetna',
      component: PocetnaView,
      meta: { requiresAuth: false }
    },
    {
      path: '/prijava',
      name: 'prijava',
      component: PrijavaView,
      meta: { requiresAuth: false }
    },
    {
      path: '/odjava',
      name: 'odjava',
      component: Odjava,
      meta: { requiresAuth: true },
    },
    {
      path: '/profil',
      name: 'profil',
      component: ProfilView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAuth: true, userType: 2 },
    },
    {
      path: '/istrazi',
      name: 'istrazi',
      component: IstraziView,
      meta: { requiresAuth: false },
    },
    {
      path: '/izdavaci',
      name: 'izdavaci',
      component: IzdavaciView,
      meta: { requiresAuth: false },
    },
    {
      path: '/izdavaci/:id',
      name: 'izdavac',
      component: IzdavacView,
      meta: { requiresAuth: false },
    },
    {
      path: '/igre/:id',
      name: 'igra',
      component: IgraRAWGView,
      meta: { requiresAuth: false },
    },
    {
      path: '/moderator',
      name: 'moderator',
      component: ModeratorView,
      meta: { requiresAuth: true, userType: 3 },
    },
    {
      path: '/favoriti',
      name: 'favoriti',
      component: FavoritiView,
      meta: { requiresAuth: true },
    },
    {
      path: '/recenzije',
      name: 'recenzije',
      component: RecenzijeIgaraView,
      meta: { requiresAuth: true },
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: //() => import('../views/AboutView.vue')
    // }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = isLoggedIn();
  const userType = returnUserType();

  if (to.meta.requiresAuth) {
    // autentifikacija
    if (!isAuthenticated) {
      // ako nije autentificiran
      next('/prijava');
    } else {
      if (to.meta.userType && to.meta.userType !== userType) {
        // korisnik nije pravilan tip
        next('/prijava');
      } else {
        // dopusti pristup
        next();
      }
    }
  } else {
    // nema autentifikacije
    next();
  }
});

export default router
