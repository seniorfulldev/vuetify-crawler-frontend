import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    component: () => import('@/layouts/Main'),
    children: [
      {
        path: '',
        match: true,
        name: 'home',
        component: () => import('@/views/Home'),
        meta: {
          title: 'Dashboard'
        }
      },
      {
        path: 'units',
        name: 'unit',
        component: () => import('@/views/Unit/List'),
        meta: {
          title: 'Campaign List',
          breadcrumbs: [
            {
              text: 'Campaign List'
            }
          ]
        }
      },
      {
        path: 'keywords',
        name: 'keyword',
        component: () => import('@/views/Keyword/List'),
        meta: {
          title: 'Keywords List',
          breadcrumbs: [
            {
              text: 'Keywords List'
            }
          ]
        }
      },
      {
        path: 'keywords/:id',
        name: 'keyword',
        component: () => import('@/views/Keydomain/List'),
        meta: {
          title: 'Keywords List',
          breadcrumbs: [
            {
              text: 'Keywords List'
            }
          ]
        }
      },
      {
        path: 'domains/',
        name: 'domain',
        props: true,
        component: () => import('@/views/Domain/List'),
        meta: {
          title: 'Campaign Details',
          breadcrumbs: [
            {
              text: 'Campaign Details'
            }
          ]
        }
      },
      {
        path: 'metricdomains/',
        name: 'metricdomain',
        props: true,
        component: () => import('@/views/MetricDomain/List'),
        meta: {
          title: 'Metrics Details',
          breadcrumbs: [
            {
              text: 'Metrics Details'
            }
          ]
        }
      },
      {
        path: 'urls',
        name: 'url',
        props: true,
        component: () => import('@/views/Url/List'),
        meta: {
          title: 'Campaign Details',
          breadcrumbs: [
            {
              text: 'Campaign Details'
            }
          ]
        }
      },
      {
        path: 'metrics',
        name: 'metric',
        props: true,
        component: () => import('@/views/Metric/List'),
        meta: {
          title: 'Metrics Details',
          breadcrumbs: [
            {
              text: 'Metrics Details'
            }
          ]
        }
      },
      {
        path: 'users',
        name: 'user',
        component: () => import('@/views/User/List'),
        meta: {
          title: 'Users',
          breadcrumbs: [
            {
              text: 'Users'
            }
          ],
          auth: { roles: 'admin', redirect: { name: 'login' }, forbiddenRedirect: '/404' }
        }
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/Settings/Main'),
        meta: {
          title: 'Settings',
          breadcrumbs: [
            {
              text: 'Settings'
            }
          ],
          auth: { roles: 'admin', redirect: { name: 'login' }, forbiddenRedirect: '/404' }
        }
      }
    ],
    meta: {
      auth: true
    }
  },
  {
    path: '',
    component: () => import('@/layouts/Auth'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/Login'),
        meta: {
          title: 'Login'
        }
      }
    ],
    meta: {
      auth: false
    }
  },
  {
    path: '*',
    component: () => import('@/views/Error404')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.afterEach((to) => {
  document.title = `SERP Crawler | ${to.meta.title}`
})

export default router
