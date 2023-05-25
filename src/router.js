import{ createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import { useOda } from "./store/oda.js"

// Pages
import Intro from './pages/intro.vue'
import Activity from './pages/activity.vue'
import End from './pages/end.vue'
import Loading from './pages/loading.vue'
import ErrorPage from './pages/errorPage.vue'


const routes = [
    {path:'/start', component: Intro },
    {path:'/activity', component: Activity },
    {path:'/activity/:scene', component: Activity },
    {path:'/end', component: End },
    {path: '/error', component: ErrorPage },
    {path: '/loading', component: Loading },
    {path: '/', redirect:'/error' },
    
    {path: '/:odaID', redirect: to => {
        // SET ODA ID
        const oda = useOda()
        oda.setOdaID(to.params.odaID)
        if(to.params.odaID){
            return {path: '/loading'}
        } else {
            return {path: '/error'}
        }
    }}

]
const router = createRouter({
    //history: createMemoryHistory(),
    history: createWebHistory(),
    routes
})

router.beforeEach(async to => {

    const oda = useOda()

    if(to.path!='/loading' && to.path!='/error'){
        // ODA NOT LOADED ALREADY
        
        if(!oda.loaded){
            router.push('/loading')
        }
        // SAVE USER LOCATION
        if(oda.user){
            oda.user.location = to.path
        }
    }

})



export default router;