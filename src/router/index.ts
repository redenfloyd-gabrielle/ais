import { useAppStore } from '@/stores/app';
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/components/dashboard/Dashboard.vue')
        },
        {
          path: '/users',
          name: 'users',
          component: () => import('@/components/user/User.vue')
        },
        {
          path: '/users/active',
          name: 'active users',
          component: () => import('@/components/user/User.vue')
        },
        {
          path: '/users/inactive',
          name: 'inactive users',
          component: () => import('@/components/user/User.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/superadmin',
      name: 'superadmin',
      component: () => import('../views/SuperAdminView.vue')
      // component: TourView,
      // children: [
      //   {
      //     path: 'space',
      //     name: 'space tour',
      //     component: TourView
      //   }

      // ]
    }
  ]
})

// router.beforeEach(async (to, from, next) => {
//   const sessionStore = useSessionStore();
//   const websocketStore = useWebsocketStore();
//   let isRouted = false;

//   const adminPages = [
//     'facility',
//     'register-facility',
//     'edit-facility',
//     'facility_status',
//   ];
//   const managerPages = [
//     'tenant-monitoring',
//     'tenants',
//     'staff',
//     'tenant',
//     'register-tenant',
//     'device',
//     'settings',
//     'tenant-activity-logs',
//     'password-reset',
//     'nursing-care-record',
//     'report'
//   ];
//   const staffPages: any = [
//     'staff-monitoring',
//     'staff-assignment',
//     'nursing-care-record'
//   ];
//   const sessionJSON = localStorage.getItem("wicare_session");

//   if (sessionJSON) {
//     const session = JSON.parse(sessionJSON);

//     if (session && Object.keys(session).length !== 0) {
//       sessionStore.session = session;

//       if (!websocketStore.socket) {
//         websocketStore.connect();
//         websocketStore.addListener();
//       }
//     }
//   } else {
//     sessionStore.session = {} as SessionData;
//   }

//   await sessionStore.reevaluateAuthSession(sessionStore.session);

//   console.log("=== ROUTE GUARD: TO ===", to.name);
//   if ((to.name === 'login' && !sessionStore.session.login_id)
//     || (to.name === 'home' && !sessionStore.session.login_id)
//     || (to.name === 'password-reset' && !sessionStore.session.login_id)
//     || (to.name === 'forgot-password' && !sessionStore.session.login_id)) {
//     isRouted = true;
//     sessionStore.session.current_page = to.fullPath;
//     next();
//   } else if ((to.name === 'login' && sessionStore.session.login_id)
//     || (to.name === 'home' && sessionStore.session.login_id)) {
//     switch (sessionStore.session.role) {
//       case userRole.admin:
//         isRouted = true;
//         sessionStore.session.current_page = to.fullPath;
//         next({ name: 'facility' });
//         break;
//       case userRole.manager:
//         isRouted = true;
//         sessionStore.session.current_page = to.fullPath;
//         next({ name: 'tenant-monitoring' });
//         break;
//       default:
//         isRouted = true;
//         sessionStore.session.current_page = to.fullPath;
//         next({ name: 'staff-assignment' });
//     }
//   }

//   if (!isRouted) {
//     console.log("include staffPages", staffPages.includes(to.name as string), to.name);
//     if (staffPages.includes(to.name as string) && sessionStore.session.role === userRole.staff) {
//       isRouted = true;
//       sessionStore.session.current_page = to.fullPath;
//       next();
//     } else {
//       if (sessionStore.session.role === userRole.staff) {
//         isRouted = true;
//         sessionStore.session.current_page = to.fullPath;
//         next({ name: 'staff-assignment' });
//       }
//     }
//   }

//   if (!isRouted) {
//     console.log("include managerPages", managerPages.includes(to.name as string), to.name);
//     if (managerPages.includes(to.name as string) && sessionStore.session.role === userRole.manager) {
//       isRouted = true;
//       sessionStore.session.current_page = to.fullPath;
//       next();
//     } else {
//       if (sessionStore.session.role === userRole.admin) {
//         if (adminPages.includes(to.name as string)) {
//           isRouted = true;
//           sessionStore.session.current_page = to.fullPath;
//           next();
//         } else {
//           isRouted = true;
//           sessionStore.session.current_page = to.fullPath;
//           next({ name: 'home' });
//         }
//       } else {
//         isRouted = true;
//         sessionStore.session.current_page = to.fullPath;
//         next({ name: 'home' });
//       }
//     }
//   }

//   if (!isRouted) {
//     console.log("include adminPages", adminPages.includes(to.name as string), to.name);
//     if (adminPages.includes(to.name as string) && sessionStore.session.role === userRole.admin) {
//       isRouted = true;
//       sessionStore.session.current_page = to.fullPath;
//       next();
//     } else {
//       if (sessionStore.session.role === userRole.manager) {
//         if (managerPages.includes(to.name as string)) {
//           isRouted = true;
//           sessionStore.session.current_page = to.fullPath;
//           next();
//         } else {
//           isRouted = true;
//           sessionStore.session.current_page = to.fullPath;
//           next({ name: 'home' });
//         }
//       } else {
//         isRouted = true;
//         sessionStore.session.current_page = to.fullPath;
//         next({ name: 'home' });
//       }
//     }
//   }

//   //IMPORTANT DO NOT REMOVE
//   // next();
// })

router.beforeEach(async (to, from, next) => {
  const appStore = useAppStore()
  appStore.currentRoute = to.name?.toString()
  console.log(`appStore.currentRoute :: ${appStore.currentRoute}`)


  next()
})

export default router
